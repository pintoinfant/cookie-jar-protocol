// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./CookieJarProtocol.sol";   

// Used to withdraw funds from a CookieJar (Cross-chain using CCIP)
contract CookieJarHandler { 
    address public owner;
    CookieJarProtocol public cookieJarProtocol;
    
 
 
    constructor(CookieJarProtocol _cookieJarProtocol) { 
        owner = msg.sender;
        cookieJarProtocol = _cookieJarProtocol;
    }

    function sendWithdrawalRequest(uint256 _jarId, uint256 _amount, string memory _note) public {
        
    }
}