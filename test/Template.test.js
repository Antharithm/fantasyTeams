const { expect } = require('chai');
const { ethers } = require('hardhat');

const uint = (num) => parseInt(num.toString());

async function deployment(name, args = []) {
  return await (await ethers.getContractFactory(name)).deploy(...args);
}

describe('FantasyPoints', () => {
  let deployer, users, tkn, nft;

  beforeEach(async () => {
    [deployer, ...users] = await ethers.getSigners();
    tkn = await deployment('FantasyFootballPoints');
    nft = await deployment('FantasyFootball', [tkn.address]);
    await tkn.connect(deployer).grantRole(await tkn.MINTER_ROLE(), nft.address);
  });

  describe('Initialization & View Functions', () => {
    it('does a thing', async () => {});
  });

  describe('Access Control', () => {
    it('does another', async () => {});
  });

  describe('Minting', () => {
    beforeEach(async () => {});
    it('and another...', async () => {});
    it('and another...', async () => {});
    it('and another...', async () => {});
  });

  describe('Staking', () => {
    beforeEach(async () => {});
    it('and another...', async () => {});
    it('and another...', async () => {});
    it('and another...', async () => {});
  });
});
