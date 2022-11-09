// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface INonFungiblePlayers {
    event Minted(uint id);

    function ownedBy(address user) external view returns (uint[] memory ids);

    function myTokens() external view returns (uint[] memory ids);

    function tokenURIs(uint[] memory)
        external
        view
        returns (string[] memory uris);

    function mint(string memory uri) external returns (uint id);
}
