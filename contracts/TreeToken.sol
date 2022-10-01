// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreeToken is ERC20, Ownable, ERC20Permit {

    address donateAddress = 0x9d019EC71aEbf34bf9Ef5071974A83e2163Ac99a;
    address constant stableCoinAddress = 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8; 

    uint treePrice = 5;
    IERC20 stableToken;

    bool locked;

    constructor() ERC20("TreeToken", "TT") ERC20Permit("TreeToken") {
        stableToken = IERC20( stableCoinAddress );
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }


//first approve
    function donate(uint amount) external noReentrancy() {
        address msgSender = msg.sender;
        require( stableToken.balanceOf( msgSender ) >= amount, "not enough balance" );

        stableToken.transferFrom( msgSender, donateAddress, amount );
        _mint( msgSender, amount / treePrice );
    }

    
}