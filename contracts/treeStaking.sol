//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
contract treeStake is Ownable, ReentrancyGuard, ERC20, ERC20Permit{
    Token treeToken;
    Token carbonToken;

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

    constructor(Token _carbonTokenAddress, Token _treeTokenAddress) ERC20("CarbonToken", "CT") ERC20Permit("CarbonToken") { 
          
        carbonToken = _carbonTokenAddress;       
        treeToken = _treeTokenAddress;  
        totalStakers = 0;
    } 

    function transferCarbonToken(address to,uint256 amount) external onlyOwner{
        require(carbonToken.transfer(to, amount), "Carbon Token transfer failed");  
    }

    function transferTreeToken(address to,uint256 amount) external onlyOwner{
        require(treeToken.transfer(to, amount), "Tree Token transfer failed");  
    } 

    function claimCarbonToken() external returns (bool success){
        success= false;
        require(addressStaked[_msgSender()] == true, "You are not participated");
        require(stakeInfos[_msgSender()].claimed == 0, "Already claimed");
        uint256 stakeTime = stakeInfos[_msgSender()].endTS - block.timestamp;
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
    function expectedGain() external view returns(uint256 gain){
        require(addressStaked[_msgSender()] == true, "You are not participated");
        require(stakeInfos[_msgSender()].claimed == 0, "0");  
        uint256 stakeAmount = stakeInfos[_msgSender()].amount;
        uint256 stakeTime = stakeInfos[_msgSender()].endTS - block.timestamp;
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


}
