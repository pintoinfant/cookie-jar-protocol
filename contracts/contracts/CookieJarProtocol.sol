// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {IEAS, AttestationRequest, AttestationRequestData} from "https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/EAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/Common.sol";

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);
}

interface IGovernor {
    function quorum(uint256 timepoint) external view returns (uint256);

    function getVotes(
        address account,
        uint256 timepoint
    ) external view returns (uint256);
}

contract CookieJarProtocol {
    error InvalidEAS();

    uint256 constant LOCKED_FUNDS = 0.001 ether;

    // The address of the global EAS contract.
    IEAS private immutable _eas;
    address public owner;
    address public operator;
    bytes32 public cookieJarSchemaEAS;
    uint256 public lockedFunds;

    struct CookieJarWithdrawal {
        string note;
        uint256 amount;
        address requester;
        bytes32 attestationUID;
    }

    struct CookieJar {
        mapping(uint16 => CookieJarWithdrawal) withdrawals;
        bytes32 jarId;
        address owner;
        IERC20 daoTokenAddress; // Should be deployed at the same chain as CookieJar
        IGovernor daoGovernorAddress; // Should be deployed at the same chain as CookieJar
        uint256 jarBalance;
        uint16 noOfWithdrawals;
    }

    struct CompleteCCWithdrawalCallData {
        address _requester;
        uint256 _amount;
        uint32 _sourceChainId;
        uint32 _targetChainId;
        address _jarOwner;
        uint256 _jarBalance;
        bytes32 _jarId;
        uint16 _noOfWithdrawals;
        IGovernor _daoGovernorAddress;
        IERC20 _daoTokenAddress;
        CookieJarWithdrawal[] _withdrawals;
    }

    mapping(bytes32 => CookieJar) public jarIdToCookieJar;

    event OperatorChanged(address indexed operator);
    event WithdrawalCCHandled(
        bytes32 indexed jarId,
        uint256 amount,
        address requester,
        uint32 sourceChainId,
        uint32 targetChainId
    );
    event InitiateCCWithdrawal(
        bytes32 indexed jarId,
        uint256 amount,
        address requester,
        string note,
        uint32 chainId
    );
    event WithdrawalRequest(
        bytes32 indexed jarId,
        uint256 amount,
        string note,
        address requester,
        bytes32 attestationUID
    );
    event WithdrawalCCRequest(
        bytes32 indexed jarId,
        uint256 amount,
        string note,
        address requester,
        uint32 chainId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyOperator() {
        require(
            msg.sender == operator,
            "Only the operator can perform this action"
        );
        _;
    }

    modifier onlyCookieJarOwner(bytes32 _jarId) {
        require(
            msg.sender == jarIdToCookieJar[_jarId].owner,
            "Only the owner of the cookie jar can perform this action"
        );
        _;
    }

    modifier onlyDAOMember(bytes32 _jarId, address _member) {
        require(
            jarIdToCookieJar[_jarId].daoGovernorAddress.getVotes(
                _member, // Voter
                block.number // Block number
            ) > 0,
            "Only the DAO members can perform this action"
        );
        _;
    }

    constructor(
        IEAS eas,
        bytes32 _cookieJarSchemaEAS,
        address _operator
    ) payable {
        // Ensure sender sent 0.5 ETH to deploy the contract
        require(msg.value == LOCKED_FUNDS, "Invalid deployment fee");

        if (address(eas) == address(0)) {
            revert InvalidEAS();
        }

        _eas = eas;
        owner = msg.sender;
        operator = _operator;
        cookieJarSchemaEAS = _cookieJarSchemaEAS;
        lockedFunds = msg.value;
    }

    // Calculate the share of the user (How much of the Jar can the user withdraw)
    function getJarShareOfUserInPercent(
        bytes32 _jarId,
        address _user
    ) public view returns (uint256) {
        uint256 quorum = jarIdToCookieJar[_jarId].daoGovernorAddress.quorum(
            block.timestamp
        );
        uint256 votes = jarIdToCookieJar[_jarId].daoGovernorAddress.getVotes(
            _user,
            block.timestamp
        );

        return (votes * 100) / quorum;
    }

    function getJarShareOfUser(
        bytes32 _jarId,
        address _user
    ) public view returns (uint256) {
        return
            (jarIdToCookieJar[_jarId].jarBalance *
                getJarShareOfUserInPercent(_jarId, _user)) / 100;
    }

    function createJar(
        IERC20 _daoTokenAddress,
        IGovernor _daoGovernorAddress
    ) external payable {
        require(
            _daoGovernorAddress.getVotes(msg.sender, block.number) > 0,
            "Only the DAO members can perform this action"
        );
        // Check if the user has enough ETH balance to create a new jar
        require(msg.value > 0, "Insufficient deposit to create a new jar");

        bytes32 _jarId = keccak256(
            abi.encodePacked(block.timestamp, msg.sender)
        );

        jarIdToCookieJar[_jarId].jarId = _jarId;
        jarIdToCookieJar[_jarId].owner = msg.sender;
        jarIdToCookieJar[_jarId].daoTokenAddress = _daoTokenAddress;
        jarIdToCookieJar[_jarId].daoGovernorAddress = _daoGovernorAddress;
        jarIdToCookieJar[_jarId].jarBalance = msg.value;
    }

    /// @notice Attests to a schema with the given data.
    function attestNote(
        string memory _note,
        bytes32 _jarId,
        uint256 _amount
    ) internal returns (bytes32) {
        return
            _eas.attest(
                AttestationRequest({
                    schema: cookieJarSchemaEAS,
                    data: AttestationRequestData({
                        recipient: address(0), // No recipient
                        expirationTime: NO_EXPIRATION_TIME, // No expiration time
                        revocable: true,
                        refUID: EMPTY_UID, // No references UI
                        data: abi.encode(_note, _jarId, _amount), // Encode the parameters with their respective types
                        value: 0 // No value/ETH
                    })
                })
            );
    }

    function withdraw(
        bytes32 _jarId,
        uint256 _amount,
        string calldata _note
    ) external {
        require(
            jarIdToCookieJar[_jarId].jarBalance >= _amount,
            "Insufficient balance in the jar"
        );
        require(
            getJarShareOfUser(_jarId, msg.sender) >= _amount,
            "Insufficient share of the user"
        );

        bytes32 _attestationUID = attestNote(_note, _jarId, _amount);

        jarIdToCookieJar[_jarId].jarBalance -= _amount;
        uint16 _noOfWithdrawals = jarIdToCookieJar[_jarId].noOfWithdrawals + 1;
        jarIdToCookieJar[_jarId].noOfWithdrawals = _noOfWithdrawals;
        jarIdToCookieJar[_jarId].withdrawals[
            _noOfWithdrawals
        ] = CookieJarWithdrawal({
            note: _note,
            amount: _amount,
            requester: msg.sender,
            attestationUID: _attestationUID
        });

        // Send the funds to the requester
        payable(msg.sender).transfer(_amount);

        emit WithdrawalRequest(
            _jarId,
            _amount,
            _note,
            msg.sender,
            _attestationUID
        );
    }

    function withdrawCC(
        bytes32 _jarId,
        uint256 _amount,
        string calldata _note,
        uint32 _chainId
    ) external {
        if (jarIdToCookieJar[_jarId].owner != address(0)) {
            require(
                jarIdToCookieJar[_jarId].jarBalance >= _amount,
                "Insufficient balance in the target jar"
            );
        }

        emit WithdrawalCCRequest(_jarId, _amount, _note, msg.sender, _chainId);
    }

    // Will be called on the primary chain (on WithdrawalCCRequest)
    function initiateCCWithdrawal(
        bytes32 _jarId,
        uint256 _amount,
        address _requester,
        string calldata _note,
        uint32 _chainId
    ) external onlyOperator {
        require(
            jarIdToCookieJar[_jarId].jarBalance >= _amount,
            "Insufficient balance in the jar"
        );
        lockedFunds += _amount;
        jarIdToCookieJar[_jarId].jarBalance -= _amount;

        // Create a withdrawal request
        bytes32 _attestationUID = attestNote(_note, _jarId, _amount);
        jarIdToCookieJar[_jarId].noOfWithdrawals =
            jarIdToCookieJar[_jarId].noOfWithdrawals +
            1;
        jarIdToCookieJar[_jarId].withdrawals[
            jarIdToCookieJar[_jarId].noOfWithdrawals
        ] = CookieJarWithdrawal({
            note: _note,
            amount: _amount,
            requester: _requester,
            attestationUID: _attestationUID
        });

        emit InitiateCCWithdrawal(_jarId, _amount, _requester, _note, _chainId);
    }

    // Called on the secondary chain: (On InitiateCCWithdrawal)
    function completeCCWithdrawal(
        CompleteCCWithdrawalCallData calldata _data
    ) external onlyOperator {
        lockedFunds -= _data._amount;

        // Update the storage CookieJar with the memory CookieJar data
        jarIdToCookieJar[_data._jarId].jarId = _data._jarId;
        jarIdToCookieJar[_data._jarId].owner = _data._jarOwner;
        jarIdToCookieJar[_data._jarId].daoTokenAddress = _data._daoTokenAddress;
        jarIdToCookieJar[_data._jarId].daoGovernorAddress = _data
            ._daoGovernorAddress;
        jarIdToCookieJar[_data._jarId].jarBalance = _data._jarBalance;

        // Copy each withdrawal from memory to storage
        for (uint16 i = 0; i < _data._noOfWithdrawals; i++) {
            jarIdToCookieJar[_data._jarId].withdrawals[i] = _data._withdrawals[
                i
            ];
        }

        // Send the funds to the requester
        payable(_data._requester).transfer(_data._amount);

        emit WithdrawalCCHandled(
            jarIdToCookieJar[_data._jarId].jarId,
            _data._amount,
            _data._requester,
            _data._sourceChainId,
            _data._targetChainId
        );
    }

    function setOperator(address _operator) external onlyOwner {
        operator = _operator;
        emit OperatorChanged(_operator);
    }
}
