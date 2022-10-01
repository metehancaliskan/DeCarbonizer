// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreeToken is ERC20, Ownable, ERC20Permit {

    address donateAddress = 0xC4C022271afCe9Bfa8b7C9807C4A2C6f456c5b69;
    address constant stableCoinAddress = 0x161DdeF47226C84596ad4c7290c30b4D8FC3AcfF; 

    uint treePrice = 5 ** decimals();
    IERC20 stableToken;

    bool locked;

    constructor() ERC20("TreeToken", "TREE") ERC20Permit("TreeToken") {
        stableToken = IERC20( stableCoinAddress );
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }


    function setTreePrice( uint _price ) external onlyOwner {
        treePrice = _price;
    }

//first approve
    function donate(uint amount) external noReentrancy() {
        address msgSender = msg.sender;
        require( stableToken.balanceOf( msgSender ) >= amount, "not enough balance" );

        stableToken.transferFrom( msgSender, donateAddress, amount );
        _mint( msgSender, amount / treePrice );
    }

    
}