// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IFantasyFootballPoints.sol";

interface IFantasyFootball {
    event Minted(uint id);
    event PlayerUpdated(uint id, string indexed change);
    event NftStake(uint[] ids, string indexed change, uint amount);

    // Variables
    function totalSupply() external view returns (uint);

    function points() external view returns (IFantasyFootballPoints contract_);

    // Mappings
    function tokenMetadata(uint tokenId) external view returns (uint playerId);

    function tokenStaked(uint tokenId) external view returns (bool staked);

    function playerMetadata(uint tokenId)
        external
        view
        returns (string memory uri);

    function playerEligible(uint tokenId) external view returns (bool eligible);

    // function team(address user)
    //     external
    //     view
    //     returns (uint[] memory stakedPlayers);

    function collateral(address user) external view returns (uint stakedAmount);

    // Functions
    function ownedBy(address user) external view returns (uint[] memory ids);

    function myTokens() external view returns (uint[] memory ids);

    function tokenURIs(uint[] memory)
        external
        view
        returns (string[] memory uris);

    function mint(uint playerId_) external returns (uint tokenId_);

    function stake(uint[] memory ids, uint amount) external;

    function unstake() external;

    //// update metadata
    function updatePlayer(uint playerId_, string memory data) external;

    //// eligibility toggle
    function updatePlayer(uint playerId_) external;
}
