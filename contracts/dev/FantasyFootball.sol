// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../FantasyPoints/IFantasyPoints.sol";
import "./IFantasyFootball.sol";
import "./IFantasyFootballPoints.sol";

contract FantasyFootball is IFantasyFootball, Ownable, ERC721 {
    uint public totalSupply;
    mapping(uint => uint) public tokenMetadata;
    mapping(uint => bool) public tokenStaked;

    mapping(uint => string) public playerMetadata;
    mapping(uint => bool) public playerEligible;

    mapping(address => uint[]) public team;
    mapping(address => uint) public collateral;

    IFantasyFootballPoints public points;

    constructor(address points_) ERC721("FantasyFootball", "FF") {
        points = IFantasyFootballPoints(points_);
    }

    function ownedBy(address user)
        public
        view
        override
        returns (uint[] memory ids)
    {
        uint[] memory result = new uint[](balanceOf(user));
        uint j;

        for (uint i = 1; i < totalSupply; i++) {
            if (ownerOf(i) == user) {
                result[j] = i;
                j++;
            }
        }
        return result;
    }

    function myTokens() public view override returns (uint[] memory ids) {
        return ownedBy(msg.sender);
    }

    function tokenURIs(uint[] memory ids)
        public
        view
        override
        returns (string[] memory uris)
    {
        string[] memory result = new string[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            result[i] = tokenURI(ids[i]);
        }
        uris = result;
    }

    function mint(uint playerId_) public override returns (uint tokenId_) {
        require(playerEligible[playerId_], "FantasyFootball: !mintable");
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
        tokenMetadata[totalSupply] = playerId_;
        emit Minted(totalSupply);
        return (totalSupply - 1);
    }

    function stake(uint[] memory ids, uint amount) public override {
        require(collateral[msg.sender] == 0, "FantasyFootball: staked");
        for (uint i = 0; i < ids.length; i++)
            require(playerEligible[ids[i]], "FantasyFootball: !eligiblePlayer");
        for (uint i = 0; i < ids.length; i++)
            require(
                msg.sender == ownerOf(ids[i]),
                "FantasyFootball: !eligiblePlayer"
            );

        for (uint i = 0; i < ids.length; i++) tokenStaked[ids[i]] = true;
        team[msg.sender] = ids;
        points.burn(msg.sender, amount);
        collateral[msg.sender] = amount;

        emit NftStake(ids, "Points Deposited", amount);
    }

    function unstake() public override {
        require(collateral[msg.sender] != 0, "FantasyFootball: !staked");

        uint[] memory ids = team[msg.sender];
        for (uint i = 0; i < ids.length; i++) delete tokenStaked[ids[i]];
        delete team[msg.sender];

        // INSERT REWARD/PENALTY LOGIC HERE
        uint amount = collateral[msg.sender];
        delete collateral[msg.sender];
        points.mint(msg.sender, amount);

        emit NftStake(ids, "Points Claimed", amount);
    }

    function updatePlayer(uint playerId_, string memory data)
        public
        override
        onlyOwner
    {
        playerMetadata[playerId_] = data;
        emit PlayerUpdated(playerId_, "Metadata Updated");
    }

    function updatePlayer(uint playerId_) public override onlyOwner {
        playerEligible[playerId_] = !playerEligible[playerId_];
        emit PlayerUpdated(playerId_, "Eligibility Toggled");
    }

    function tokenURI(uint tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);
        return playerMetadata[tokenMetadata[tokenId]];
    }

    function _burn(uint tokenId) internal virtual override {
        super._burn(tokenId);
        delete tokenMetadata[tokenId];
    }
}
