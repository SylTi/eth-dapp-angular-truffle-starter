// not protected against uint overflow 

pragma solidity ^0.4.10;

import "./libs/HumanStandardToken.sol";
// import "zeppelin-solidity/contracts/Ownable.sol";
// import "./libs/zeppelin/ownership/Ownable.sol";
import "./libs/zeppelin/lifecycle/Pausable.sol";
// import "./libs/zeppelin/token/SimpleToken.sol";

// Parent paramaters : tokenAmount, tokeName, decimals, symbol
contract TokenTest is HumanStandardToken(1000000, "Sample Token", 18, "STERC20"), Pausable {

    // For usage with SimpleToken instead of HumanStandardToken. Could also use PausableToken instead of Pausable
    // string public name = "Sample Token";
    // string public symbol = "STERC20";
    // uint public decimals = 18;
    // uint public INITIAL_SUPPLY = 1000000;

    function TokenTest() {
    }

    // modifier onlyPayloadSize(uint size) onlyPayloadSize(2 * 32) {
    //     assert(msg.data.length >= size + 4);
    //     _;
    // }

    //overload parent function with circuitBreaker
    function transfer(address _to, uint256 _value) whenNotPaused returns (bool success)  {
        return super.transfer(_to, _value);
    }
}