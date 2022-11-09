// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IFantasyPoints {
    event Minted(address user, uint amount);
    event Burned(address user, uint amount);

    function MINTER_ROLE() external view returns (bytes32);

    function mint(address user, uint amount) external returns (uint balance);

    function burn(address user, uint amount) external returns (uint balance);
}
