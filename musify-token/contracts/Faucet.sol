//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address to,uint256 amount) external returns(bool) ;
    function balanceOf(address account) external view returns (uint256) ;
    event Transfer(address indexed from , address indexed to, uint256 value);
}

contract Faucet{
    address payable owner;
    IERC20 public token;

    uint256 public withdrawlAmount=1*(10**18);

    uint256 public lockTime = 6 hours; 

    event Deposit(address indexed from,uint256 indexed amount);
    event Withdrawl(address indexed to,uint256 indexed amount); 

    mapping (address => uint256) nextAccessTime;

    constructor(address tokenAddress) payable{
        token=IERC20(tokenAddress);
        owner=payable(msg.sender);
    }

    function requestTokens() public {
        require(msg.sender != address(0),"Request must not originate from a zero account");
        require(token.balanceOf(address(this))>=withdrawlAmount ,"Insufficient balance in faucet for withdrawl");
        require(block.timestamp >= nextAccessTime[msg.sender],"Faucet only after 6 hours time interval");

        nextAccessTime[msg.sender]=block.timestamp+lockTime;
        token.transfer(msg.sender,withdrawlAmount);
    }

    receive() external payable{
        emit Deposit(msg.sender,msg.value);
    }

    function getBalance() external view returns(uint256){
        return token.balanceOf(address(this));
    }

    function setWithdrawAmount(uint256 amount) public onlyOwner{
        withdrawlAmount=amount*(10**18);
    }

    function setLockTime(uint256 amount) public onlyOwner{
        lockTime=amount*1 hours;
    }

    function withdrawl() external onlyOwner{
        emit Withdrawl(msg.sender,token.balanceOf(address(this)));
        token.transfer(msg.sender,token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(msg.sender==owner,"Only the contract owner can call this function");
        _;
    }
}