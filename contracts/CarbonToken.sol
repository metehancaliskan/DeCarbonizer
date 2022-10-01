// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract CarbonToken is ERC20, Ownable, ERC20Permit {
    constructor() ERC20("CarbonToken", "CT") ERC20Permit("CarbonToken") {
        _mint(msg.sender, 4 * 10 ** (decimals() + 11 ));
    }

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }


    function burn(uint amount) external noReentrancy() {
        address msgSender = msg.sender;
        require( balanceOf( msgSender ) >= amount, "not enough balance" );
        _burn(msgSender,amount/10);
        transferFrom( msgSender, pooladdress, amount-amount/10 );
    }


}