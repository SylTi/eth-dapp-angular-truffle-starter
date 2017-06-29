// not protected against uint overflow 

pragma solidity ^0.4.10;

import "./libs/HumanStandardToken.sol";
// Parent paramaters : tokenAmount, tokeName, decimals, symbol
contract TokenTest is HumanStandardToken(1000000, "Sample Token", 18, "STERC20") {

    bool public _circuitBreaker;
    address public _owner;

    function TokenTest() {
        _circuitBreaker = false;
        _owner = msg.sender;
    }

    modifier isOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier circuitBreaker() {
        require(_circuitBreaker == false);
        _;
    }

    function setCircuitBreaker(bool stop) isOwner {
        _circuitBreaker = stop;
    }

    //overload parent function with circuitBreaker
    function transfer(address _to, uint256 _value) circuitBreaker returns (bool success)  {
        return super.transfer(_to, _value);
    }
}