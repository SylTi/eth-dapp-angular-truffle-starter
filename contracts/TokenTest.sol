// not protected against uint overflow 

pragma solidity ^0.4.10;

import "./libs/HumanStandardToken.sol";
// import "zeppelin-solidity/contracts/Ownable.sol";
import "./libs/zeppelin/ownership/Ownable.sol";

// Parent paramaters : tokenAmount, tokeName, decimals, symbol
contract TokenTest is HumanStandardToken(1000000, "Sample Token", 18, "STERC20"), Ownable {

    bool public _circuitBreaker;
    address public _owner;

    function TokenTest() {
        _circuitBreaker = false;
        _owner = msg.sender;
    }

    modifier circuitBreaker() {
        require(_circuitBreaker == false);
        _;
    }

    modifier onlyPayloadSize(uint size) {
        assert(msg.data.length >= size + 4);
        _;
    }

    function setCircuitBreaker(bool stop) onlyOwner {
        _circuitBreaker = stop;
    }

    //overload parent function with circuitBreaker
    function transfer(address _to, uint256 _value) circuitBreaker onlyPayloadSize(2 * 32) returns (bool success)  {
        return super.transfer(_to, _value);
    }
}