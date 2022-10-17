// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

interface IPoints is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract fantasyFootball is Ownable, ERC721Holder {
    IPoints public points;
    IERC721 public player;

    uint256 public stakedTotal;
    uint256 public stakingStartTime;
    uint256 constant stakingTime = 180 seconds;
    uint256 constant token = 10e18;

    struct Staker {
        uint256[] tokenIds;
        mapping(uint256 => uint256) tokenStakingCoolDown;
        uint256 balance;
        uint256 rewardsReleased;
    }

    constructor(IERC721 _player, IPoints _points, address payable _tellorAddress) UsingTellor (_tellorAddress) {
        player = _player;
        points = _points;
    }

    /// @notice mapping of a staker to its wallet
    mapping(address => Staker) public stakers;

    /// @notice Mapping from token ID to owner address
    mapping(uint256 => address) public tokenOwner;
    bool public tokensClaimable;
    bool initialized;

    /// @notice event emitted when a user has staked a nft

    event Staked(address owner, uint256 amount);

    /// @notice event emitted when a user has unstaked a nft
    event Unstaked(address owner, uint256 amount);

    /// @notice event emitted when a user claims reward
    event RewardPaid(address indexed user, uint256 reward);

    /// @notice Allows reward tokens to be claimed
    event ClaimableStatusUpdated(bool status);

    /// @notice Emergency unstake tokens without rewards
    event EmergencyUnstake(address indexed user, uint256 tokenId);

    //ADD FUNCTION TO PULL API DATA FROM CHAINLINK


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
        returns (uint256[] memory tokenIds)
    {
        return stakers[_user].tokenIds;
    }

    // Setting the lineup
    function stake(uint256 tokenId) public {
        _stake(msg.sender, tokenId);
    }

    // Not likely to use this
    function stakeBatch(uint256[] memory tokenIds) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stake(msg.sender, tokenIds[i]);
        }
    }

    // ADD TELLOR INTEGRATION HERE
    function _stake(address _user, uint256 _tokenId) internal {
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

    function unstake(uint256 _tokenId) public {
        claimReward(msg.sender);
        _unstake(msg.sender, _tokenId);
    }

    function unstakeBatch(uint256[] memory tokenIds) public {
        claimReward(msg.sender);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenOwner[tokenIds[i]] == msg.sender) {
                _unstake(msg.sender, tokenIds[i]);
            }
        }
    }

    // Unstake without caring about rewards. EMERGENCY ONLY.
    function emergencyUnstake(uint256 _tokenId) public {
        require(
            tokenOwner[_tokenId] == msg.sender,
            "nft._unstake: Sender must have staked tokenID"
        );
        _unstake(msg.sender, _tokenId);
        emit EmergencyUnstake(msg.sender, _tokenId);
    }

    function _unstake(address _user, uint256 _tokenId) internal {
        require(
            tokenOwner[_tokenId] == _user,
            "Nft Staking System: user must be the owner of the staked nft"
        );
        Staker storage staker = stakers[_user];

        //uint256 lastIndex = staker.tokenIds.length - 1;
        //uint256 lastIndexKey = staker.tokenIds[lastIndex];

        if (staker.tokenIds.length > 0) {
            staker.tokenIds.pop();
        }
        staker.tokenStakingCoolDown[_tokenId] = 0;
        delete tokenOwner[_tokenId];

        player.safeTransferFrom(address(this), _user, _tokenId);

        emit Unstaked(_user, _tokenId);
        stakedTotal--;
    }

    function updateReward(address _user) public {

        Staker storage staker = stakers[_user];
        uint256[] storage ids = staker.tokenIds;
        for (uint256 i = 0; i < ids.length; i++) {
            if (
                staker.tokenStakingCoolDown[ids[i]] <
                block.timestamp + stakingTime &&
                staker.tokenStakingCoolDown[ids[i]] > 0
            ) {

                uint256 stakedDays = ((block.timestamp - uint(staker.tokenStakingCoolDown[ids[i]]))) / stakingTime;
                uint256 partialTime = ((block.timestamp - uint(staker.tokenStakingCoolDown[ids[i]]))) % stakingTime;

                staker.balance +=  token * stakedDays;

                staker.tokenStakingCoolDown[ids[i]] = block.timestamp + partialTime;

                console.logUint(staker.tokenStakingCoolDown[ids[i]]);
                console.logUint(staker.balance);
            }
        }
    }

    // might remove this later
    function claimReward(address _user) public {
        require(tokensClaimable == true, "Tokens cannnot be claimed yet");
        require(stakers[_user].balance > 0 , "0 rewards yet");


        stakers[_user].rewardsReleased += stakers[_user].balance;
        stakers[_user].balance = 0;

        points.mint(_user, stakers[_user].balance);

        emit RewardPaid(_user, stakers[_user].balance);
    }

}
