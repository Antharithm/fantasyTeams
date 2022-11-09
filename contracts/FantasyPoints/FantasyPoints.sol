// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./IFantasyPoints.sol";

contract FantasyPoints is ERC20, AccessControl, IFantasyPoints {
    constructor() ERC20("Fantasy Points", "FP") {
        _grantRole(admin, msg.sender);
    }

    bytes32 public constant admin = keccak256("DEFAULT_ADMIN_ROLE");

    function mint(address user, uint amount)
        public
        override
        onlyRole(admin)
        returns (uint balance)
    {
        _mint(user, amount);
        emit Minted(user, amount);
        return balanceOf(user);
    }

    function burn(address user, uint amount)
        public
        override
        onlyRole(admin)
        returns (uint balance)
    {
        _burn(user, amount);
        emit Burned(user, amount);
        return balanceOf(user);
    }
}
