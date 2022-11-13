// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./IFantasyFootballPoints.sol";

contract FantasyFootballPoints is ERC20, AccessControl, IFantasyFootballPoints {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor()
        // (address FantasyFootball)
        ERC20("FantasyFootball Points", "FFP")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(MINTER_ROLE, FantasyFootball);
    }

    function mint(address user, uint amount)
        public
        override
        onlyRole(MINTER_ROLE)
        returns (uint balance)
    {
        _mint(user, amount);
        emit Minted(user, amount);
        return balanceOf(user);
    }

    function burn(address user, uint amount)
        public
        override
        onlyRole(MINTER_ROLE)
        returns (uint balance)
    {
        _burn(user, amount);
        emit Burned(user, amount);
        return balanceOf(user);
    }
}
