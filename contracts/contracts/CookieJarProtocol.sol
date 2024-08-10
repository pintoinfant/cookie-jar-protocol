// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";  
import "@openzeppelin/contracts/governance/IGovernor.sol";
import { IEAS, AttestationRequest, AttestationRequestData } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import { NO_EXPIRATION_TIME, EMPTY_UID } from "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

contract CookieJarProtocol {
     error InvalidEAS();

    // The address of the global EAS contract.
    IEAS private immutable _eas;
    address public owner;
    bytes32 public cookieJarSchemaEAS;

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
        address owner;
        IERC20 daoTokenAddress; // Should be deployed at the same chain as CookieJar
        IGovernor daoGovernorAddress; // Should be deployed at the same chain as CookieJar
        uint256 jarBalance;
        CookieJarWithdrawal[] withdrawal;
    }

    uint256 public jarCount;
    CookieJar[]  public cookieJars;
    mapping(uint256 => CookieJar) public jarIdToCookieJar;  

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyCookieJarOwner(uint256 _jarId) {
        require(msg.sender == jarIdToCookieJar[_jarId].owner, "Only the owner of the cookie jar can perform this action");
        _;
    } 

    modifier onlyDAOMember(uint256 _jarId) {
        require(jarIdToCookieJar[_jarId].daoGovernorAddress.getVotes(
            msg.sender,  // Voter
            block.number // Block number
        ) > 0, "Only the DAO members can perform this action");
        _;
    }

    constructor(IEAS eas, bytes32 _cookieJarSchemaEAS) {
         if (address(eas) == address(0)) {
            revert InvalidEAS();
        }

        _eas = eas;
        owner = msg.sender;
        cookieJarSchemaEAS = _cookieJarSchemaEAS;
    }

    function createJar(IERC20 _daoTokenAddress, IGovernor _daoGovernorAddress, uint256 _jarDepositUSDC) external {
        require(_daoGovernorAddress.getVotes(msg.sender, block.number) > 0, "Only the DAO members can perform this action");
        // Check if the user has enough balance to create a new jar
        require(_daoTokenAddress.balanceOf(msg.sender) >= _jarDepositUSDC, "Insufficient balance to create a new jar");

        // Transfer the deposit to the contract
        _daoTokenAddress.transferFrom(msg.sender, address(this), _jarDepositUSDC);

        jarCount++;
        CookieJar memory newJar = CookieJar({
            owner: msg.sender,
            daoTokenAddress: _daoTokenAddress,
            daoGovernorAddress: _daoGovernorAddress,
            jarBalance: _jarDepositUSDC,
            requests: new CookieJarWithdrawal[](0)
        });
        cookieJars.push(newJar);
        jarIdToCookieJar[jarCount] = newJar;
    }  
    
    function withdraw(uint256 _jarId, uint256 _amount, string memory _note) external onlyCookieJarOwner(_jarId) {
        require(jarIdToCookieJar[_jarId].jarBalance >= _amount, "Insufficient balance in the jar");
        jarIdToCookieJar[_jarId].jarBalance -= _amount;
        bytes32 _attestationUID = attestNote(_note, _jarId, _amount);
        CookieJarWithdrawal _cookieJarWithdrawal = CookieJarWithdrawal({
            note: _note,
            amount: _amount,
            requester: msg.sender,
            attestationUID: _attestationUID
        });
        jarIdToCookieJar[_jarId].requests.push(_cookieJarWithdrawal);
    }

    /// @notice Attests to a schema that receives a uint256 parameter.
    /// @param _note The note for the withdraw request
    /// @param _jarId The jarId associated with the request
    /// @param _amount The amount to be withdrawn from their share of the Jar
    /// @return The UID of the new attestation.
    function attestNote(string memory _note, uint32 _jarId, uint256 _amount) external returns (bytes32) {
        return
            _eas.attest(
            AttestationRequest({
                schema: cookieJarSchemaEAS,
                data: AttestationRequestData({
                    recipient: address(0), // No recipient
                    expirationTime: NO_EXPIRATION_TIME, // No expiration time
                    revocable: true,
                    refUID: EMPTY_UID, // No references UI
                    data: abi.encode(
                        _note,
                        _jarId,
                        _amount
                    ), // Encode the parameters with their respective types
                    value: 0 // No value/ETH
                })
            })
        );
    }
}