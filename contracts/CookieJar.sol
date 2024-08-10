// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract CookieJarMain {
    address public owner;
 
    struct CookieJar {
        uint256 id;
        address daoTokenAddress;
        uint256 totalSupply;
        mapping(address => uint256) balances;  
        mapping(address => bytes32) notes; 
    }

    mapping(bytes32 => uint256) public jarIdToIndex;
    mapping(uint256 => CookieJar) public jarIdToCookieJar;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyDaoMember() {
        require(msg.sender != address(0), "Address 0 is not allowed to perform this action");
        address _daoTokenAddress = msg.sender
        
    }

    constructor() {
        owner = msg.sender;
    }

    function createJar(uint256 _totalSupply, address _daoTokenAddress) public onlyDaoMember {
        require(_totalSupply > 0, "Total supply must be greater than 0");
        
        bytes32 jarId = keccak256(abi.encodePacked(_daoTokenAddress, msg.sender));
        require(jarIdToIndex[jarId] == 0, "Jar already exists");
        
        uint256 jarIdIndex = jarIdToIndex[keccak256(abi.encodePacked(owner, msg.sender))] + 1;
        jarIdToIndex[jarId] = jarIdIndex;
        jarIdToCookieJar[jarIdIndex] = CookieJar(jarIdIndex, _daoTokenAddress, _totalSupply);


    }
}