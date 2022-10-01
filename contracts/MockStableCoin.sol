// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract MockStableCoin is ERC20, ERC20Permit {
    constructor() ERC20("Mock USD", "MUSD") ERC20Permit("Mock USD") {
        _mint(msg.sender, 5000000000 * 10 ** decimals());
    }

    function mint() external {
        _mint( msg.sender, 1000 );
    }
    
}