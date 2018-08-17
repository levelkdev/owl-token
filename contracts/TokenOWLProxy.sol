pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "@gnosis.pm/util-contracts/contracts/Proxy.sol";

contract TokenOWLProxy is Proxy, StandardToken {
    using SafeMath for *;

    string public constant name = "OWL Token";
    string public constant symbol = "OWL";
    uint8 public constant decimals = 18;

    struct masterCopyCountdownType {
        address masterCopy;
        uint timeWhenAvailable;
    }

    masterCopyCountdownType masterCopyCountdown;

    address public creator;
    address public minter;

    /// @dev Constructor of the contract OWL, which distributes tokens
    function TokenOWLProxy(address proxied)
        Proxy(proxied)
        public
    {
        creator = msg.sender;
    }
}