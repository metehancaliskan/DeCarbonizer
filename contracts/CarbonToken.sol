// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

interface Token {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract CarbonToken is ERC20, ReentrancyGuard, Ownable, ERC20Permit {

    address poolAddress;

    Token treeToken;

    // 365 Days (365 * 24 * 60 * 60)
    uint256 public planDuration = 31536000;
    uint8 public multiplier = 32;
    uint8 public totalStakers;


    mapping(address => StakeInfo) public stakeInfos;
    mapping(address => bool) public addressStaked;

    struct StakeInfo {        
        uint256 startTS;
        uint256 endTS;        
        uint256 amount; 
        uint256 claimed;       
    }    

    event Staked(address indexed from, uint256 amount);
    event Claimed(address indexed from, uint256 amount);
    event EarlyRequest(address indexed from, uint256 amount);

    constructor( Token _treeTokenAddress, address _poolAddress) ERC20("CarbonToken", "CT") ERC20Permit("CarbonToken") {
        _mint(msg.sender, 4 * 10 ** (decimals() + 11 ));  
        treeToken = _treeTokenAddress;  
        totalStakers = 0;
        poolAddress = _poolAddress;
    }

    bool locked;

    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

        function transferCarbonToken(address to,uint256 amount) external onlyOwner{
        require(transfer(to, amount), "Carbon Token transfer failed");  
    }

    function transferTreeToken(address to,uint256 amount) external onlyOwner{
        require(treeToken.transfer(to, amount), "Tree Token transfer failed");  
    } 

    function claimCarbonToken() external returns (bool success){
        success= false;
        require(addressStaked[_msgSender()] == true, "You are not participated");
        require(stakeInfos[_msgSender()].claimed == 0, "Already claimed");
        uint256 stakeTime = block.timestamp - stakeInfos[_msgSender()].startTS;
        uint256 stakeAmount = stakeInfos[_msgSender()].amount;
        if(stakeInfos[_msgSender()].endTS < block.timestamp){
            emit EarlyRequest(_msgSender(), stakeTime );    
        }
        uint256 totalTokens = (stakeAmount * multiplier * stakeTime / planDuration);
        stakeInfos[_msgSender()].claimed == totalTokens;
        _mint(_msgSender(), totalTokens); 
        treeToken.transfer(_msgSender(), stakeAmount);
        addressStaked[_msgSender()] = false;
        emit Claimed(_msgSender(), totalTokens);
        success = true;    
    }
    function expectedGain( address staker ) external view returns(uint256 gain){
        require(addressStaked[staker] == true, "You are not participated");
        require(stakeInfos[staker].claimed == 0, "0");  
        uint256 stakeAmount = stakeInfos[staker].amount;
        uint256 stakeTime = block.timestamp - stakeInfos[staker].startTS;
        gain = (stakeAmount * multiplier * stakeTime / planDuration);      
    }
    function stakeTreeToken(uint256 stakeAmount) external  {
        require(stakeAmount >0, "Stake amount should be correct");
        require(addressStaked[_msgSender()] == false, "You already participated");
        require(treeToken.balanceOf(_msgSender()) >= stakeAmount, "Insufficient Balance");
        
           treeToken.transferFrom(_msgSender(), address(this), stakeAmount);
            totalStakers++;
            addressStaked[_msgSender()] = true;

            stakeInfos[_msgSender()] = StakeInfo({                
                startTS: block.timestamp,
                endTS: block.timestamp + planDuration,
                amount: stakeAmount,
                claimed: 0
            });
        
        emit Staked(_msgSender(), stakeAmount);
    }    

    function getTreeTokenExpiry() external view returns (uint256) {
        require(addressStaked[_msgSender()] == true, "You are not participated");
        return stakeInfos[_msgSender()].endTS;
    }



    function burn(uint amount) external noReentrancy() {
        address msgSender = msg.sender;
        require( balanceOf( msgSender ) >= amount, "not enough balance" );
        _burn(msgSender,amount/10);
        _transfer( msgSender, poolAddress, amount-amount/10 );
    }


}