// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

interface IPoints is IERC20 {
    function mint(address to, uint amount) external;
}

contract fantasy is Ownable, ERC721Holder {
    IPoints public points;
    IERC721 public player;

    uint public stakedTotal;
    uint public stakingStartTime;
    uint constant stakingTime = 180 seconds;
    uint constant token = 10e18;

    struct Staker {
        uint[] tokenIds;
        mapping(uint => uint) tokenStakingCoolDown;
        uint balance;
        uint rewardsReleased;
    }

    constructor(IERC721 _player, IPoints _points) {
        player = _player;
        points = _points;
    }

    /// @notice mapping of a staker to its wallet
    mapping(address => Staker) public stakers;

    /// @notice Mapping from token ID to owner address
    mapping(uint => address) public tokenOwner;
    bool public tokensClaimable;
    bool initialized;

    /// @notice event emitted when a user has staked a nft

    event Staked(address owner, uint amount);

    /// @notice event emitted when a user has unstaked a nft
    event Unstaked(address owner, uint amount);

    /// @notice event emitted when a user claims reward
    event RewardPaid(address indexed user, uint reward);

    /// @notice Allows reward tokens to be claimed
    event ClaimableStatusUpdated(bool status);

    /// @notice Emergency unstake tokens without rewards
    event EmergencyUnstake(address indexed user, uint tokenId);

    function initStaking() public onlyOwner {
        //needs access control
        require(!initialized, "Already initialized");
        stakingStartTime = block.timestamp;
        initialized = true;
    }

    // Allow owners to claim their points, can be changed to just sending them to address
    function setTokensClaimable(bool _enabled) public onlyOwner {
        //needs access control
        tokensClaimable = _enabled;
        emit ClaimableStatusUpdated(_enabled);
    }

    // Returns Scores for owners
    function getScore(address _user)
        public
        view
        returns (uint[] memory tokenIds)
    {
        return stakers[_user].tokenIds;
    }

    // Setting the lineup
    function stake(uint tokenId) public {
        _stake(msg.sender, tokenId);
    }

    function _stake(address _user, uint _tokenId) internal {
        require(initialized, "Fantasy Leauge: Football season has not started");
        require(
            player.ownerOf(_tokenId) == _user,
            "You must be the owner of this player"
        );
        Staker storage staker = stakers[_user];

        staker.tokenIds.push(_tokenId);
        staker.tokenStakingCoolDown[_tokenId] = block.timestamp;
        tokenOwner[_tokenId] = _user;
        player.approve(address(this), _tokenId);
        player.safeTransferFrom(_user, address(this), _tokenId);

        emit Staked(_user, _tokenId);
        stakedTotal++;
    }

    function unstake(uint _tokenId) public {
        claimReward(msg.sender);
        _unstake(msg.sender, _tokenId);
    }

    // Unstake without caring about rewards. EMERGENCY ONLY.
    function emergencyUnstake(uint _tokenId) public {
        require(
            tokenOwner[_tokenId] == msg.sender,
            "nft._unstake: Sender must have staked tokenID"
        );
        _unstake(msg.sender, _tokenId);
        emit EmergencyUnstake(msg.sender, _tokenId);
    }

    function _unstake(address _user, uint _tokenId) internal {
        require(
            tokenOwner[_tokenId] == _user,
            "Nft Staking System: user must be the owner of the staked nft"
        );
        Staker storage staker = stakers[_user];

        //uint lastIndex = staker.tokenIds.length - 1;
        //uint lastIndexKey = staker.tokenIds[lastIndex];

        if (staker.tokenIds.length > 0) {
            staker.tokenIds.pop();
        }
        staker.tokenStakingCoolDown[_tokenId] = 0;
        delete tokenOwner[_tokenId];

        player.safeTransferFrom(address(this), _user, _tokenId);

        emit Unstaked(_user, _tokenId);
        stakedTotal--;
    }

    function updateReward(address _user, uint score) public {
        Staker storage staker = stakers[_user];
        staker.balance += token * score;
        tokensClaimable == true;

        console.logUint(staker.balance);
    }

    // might remove this later
    function claimReward(address _user) public {
        require(tokensClaimable == true, "Tokens cannnot be claimed yet");
        require(stakers[_user].balance > 0, "0 rewards yet");

        stakers[_user].rewardsReleased += stakers[_user].balance;
        stakers[_user].balance = 0;

        points.mint(_user, stakers[_user].balance);

        emit RewardPaid(_user, stakers[_user].balance);
    }
}
