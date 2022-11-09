const { expect } = require('chai');

const uint = (num) => parseInt(num.toString());

describe('FantasyPoints', function () {
  let contract, deployer, signers, minterRole, adminRole;

  beforeEach(async () => {
    contract = await (
      await ethers.getContractFactory('FantasyPoints')
    ).deploy();
    minterRole = await contract.MINTER_ROLE();
    adminRole = await contract.DEFAULT_ADMIN_ROLE();
    [deployer, ...signers] = await ethers.getSigners();
  });

  describe('Operation', function () {
    it('Should recognize the deployer as the minter & admin', async () => {
      expect(await contract.hasRole(minterRole, deployer.address)).to.equal(
        true
      );
      expect(await contract.hasRole(adminRole, deployer.address)).to.equal(
        true
      );
    });

    it('Should let the deployer mint', async () => {
      for await (signer of signers)
        await (
          await contract.connect(deployer).mint(signer.address, 100)
        ).wait();

      for await (signer of signers)
        expect(await contract.balanceOf(signer.address)).to.equal(100);
    });

    it('Should let the deployer burn', async () => {
      for await (signer of signers)
        await (
          await contract.connect(deployer).mint(signer.address, 100)
        ).wait();

      for await (const signer of signers)
        await (
          await contract.connect(deployer).burn(signer.address, 100)
        ).wait();

      for await (const signer of signers)
        expect(await contract.balanceOf(signer.address)).to.equal(0);
    });
  });
});
