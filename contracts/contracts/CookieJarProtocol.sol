// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/governance/IGovernor.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {NO_EXPIRATION_TIME, EMPTY_UID} from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract CookieJarProtocol {
    error InvalidEAS();

    // The address of the global EAS contract.
    IEAS private immutable _eas;
    address public owner;
    address public operator;
    bytes32 public cookieJarSchemaEAS;
    uint256 public lockedFunds;

    struct CookieJarWithdrawal {
        // Note
        string note;
        // Amount
        uint256 amount;
        // Requester
        address requester;
        // Attestation UID
        bytes32 attestationUID;
    }

    struct CookieJar {
        bytes32 jarId;
        address owner;
        IERC20 daoTokenAddress; // Should be deployed at the same chain as CookieJar
        IGovernor daoGovernorAddress; // Should be deployed at the same chain as CookieJar
        uint256 jarBalance;
        CookieJarWithdrawal[] withdrawals;
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
        require(msg.value == 0.5 ether, "Invalid deployment fee");

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

        CookieJar memory newJar = CookieJar({
            jarId: keccak256(abi.encodePacked(block.timestamp, msg.sender)),
            owner: msg.sender,
            daoTokenAddress: _daoTokenAddress,
            daoGovernorAddress: _daoGovernorAddress,
            jarBalance: msg.value,
            withdrawals: new CookieJarWithdrawal[](0)
        });
        jarIdToCookieJar[newJar.jarId] = newJar;
    }

    /// @notice Attests to a schema with the given data.
    /// @param _note The note for the withdraw request
    /// @param _jarId The jarId associated with the request
    /// @param _amount The amount to be withdrawn from their share of the Jar
    /// @return The UID of the new attestation.
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
        string memory _note
    ) external {
        require(
            jarIdToCookieJar[_jarId].jarBalance >= _amount,
            "Insufficient balance in the jar"
        );
        require(
            getJarShareOfUser(_jarId, msg.sender) >= _amount,
            "Insufficient share of the user"
        );

        jarIdToCookieJar[_jarId].jarBalance -= _amount;

        bytes32 _attestationUID = attestNote(_note, _jarId, _amount);
        CookieJarWithdrawal memory _cookieJarWithdrawal = CookieJarWithdrawal({
            note: _note,
            amount: _amount,
            requester: msg.sender,
            attestationUID: _attestationUID
        });
        jarIdToCookieJar[_jarId].withdrawals.push(_cookieJarWithdrawal);

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
        string memory _note,
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
        string memory _note,
        uint32 _chainId
    ) external onlyOperator onlyDAOMember(_jarId, _requester) {
        require(
            jarIdToCookieJar[_jarId].jarBalance >= _amount,
            "Insufficient balance in the jar"
        );
        lockedFunds += _amount;
        jarIdToCookieJar[_jarId].jarBalance -= _amount;

        // Create a withdrawal request
        bytes32 _attestationUID = attestNote(_note, _jarId, _amount);
        CookieJarWithdrawal memory _cookieJarWithdrawal = CookieJarWithdrawal({
            note: _note,
            amount: _amount,
            requester: _requester,
            attestationUID: _attestationUID
        });

        jarIdToCookieJar[_jarId].withdrawals.push(_cookieJarWithdrawal);

        emit InitiateCCWithdrawal(_jarId, _amount, _requester, _note, _chainId);
    }

    // Called on the secondary chain: (On InitiateCCWithdrawal)
    function completeCCWithdrawal(
        address _requester,
        uint256 _amount,
        CookieJar memory _cookieJar,
        uint32 _sourceChainId,
        uint32 _targetChainId
    ) external onlyOperator {
        lockedFunds -= _amount;

        // Check if the cookie jar exists
        if (jarIdToCookieJar[_cookieJar.jarId].owner == address(0)) {
            // Update cookie jar state to this chain
            jarIdToCookieJar[_cookieJar.jarId] = _cookieJar;
        } else {
            // Update the balance of the cookie jar
            jarIdToCookieJar[_cookieJar.jarId].jarBalance += _amount;
            jarIdToCookieJar[_cookieJar.jarId].withdrawals = _cookieJar
                .withdrawals;
        }

        // Send the funds to the requester
        payable(_requester).transfer(_amount);

        emit WithdrawalCCHandled(
            _cookieJar.jarId,
            _amount,
            _requester,
            _sourceChainId,
            _targetChainId
        );
    }

    function setOperator(address _operator) external onlyOwner {
        operator = _operator;
        emit OperatorChanged(_operator);
    }
}
