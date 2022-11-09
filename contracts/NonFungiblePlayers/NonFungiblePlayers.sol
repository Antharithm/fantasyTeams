// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./INonFungiblePlayers.sol";

contract NonFungiblePlayers is ERC721URIStorage, INonFungiblePlayers {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NonFungiblePlayers", "NFP") {
        _tokenIds.increment();
    }

    function mint(string memory uri) public override returns (uint id) {
        uint tId = _tokenIds.current();
        _safeMint(msg.sender, tId);
        _setTokenURI(tId, uri);
        _tokenIds.increment();

        emit Minted(tId);
        return tId;
    }

    function ownedBy(address user)
        public
        view
        override
        returns (uint[] memory ids)
    {
        uint numTokens = _tokenIds.current();
        uint[] memory result = new uint[](balanceOf(user));
        uint j;

        for (uint i = 1; i < numTokens; i++) {
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
}
