const { expect, assert } = require('chai');

const uint = (num) => parseInt(num.toString());
const uintArray = (nums) => nums.map((num) => uint(num));

describe('NonFungiblePlayers', function () {
  const expectedUri = 'expected uri';
  let contract, signers;

  beforeEach(async () => {
    contract = await (
      await ethers.getContractFactory('NonFungiblePlayers')
    ).deploy();
    signers = await ethers.getSigners();
  });

  describe('Operation', function () {
    it('Should let people mint', async () => {
      for await (signer of signers) {
        const idx = signers.indexOf(signer);
        await (await contract.connect(signer).mint(expectedUri)).wait();
        expect(uint(await contract.balanceOf(signer.address))).to.equal(1);
        expect(await contract.ownerOf(idx + 1)).to.equal(signer.address);
        expect(await contract.tokenURI(idx + 1)).to.equal(expectedUri);
      }
    });

    it('Should show us who owns what', async () => {
      let expected = [];

      signers.forEach((signer) => expected.push([signers.indexOf(signer) + 1]));

      for await (signer of signers)
        await (await contract.connect(signer).mint(expectedUri)).wait();

      for await (signer of signers) {
        assert.deepEqual(
          uintArray(await contract.ownedBy(signer.address)),
          expected[signers.indexOf(signer)]
        );
        assert.deepEqual(
          uintArray(await contract.connect(signer).myTokens()),
          expected[signers.indexOf(signer)]
        );
      }

      let current = signers.length + 1;
      for await (signer of signers) {
        await (await contract.connect(signer).mint(expectedUri)).wait();
        expected[signers.indexOf(signer)].push(current);
        current++;
        assert.deepEqual(
          uintArray(await contract.ownedBy(signer.address)),
          expected[signers.indexOf(signer)]
        );
        assert.deepEqual(
          uintArray(await contract.connect(signer).myTokens()),
          expected[signers.indexOf(signer)]
        );
      }

      for (let i = 0; i < 10; i++) {
        await (await contract.connect(signers[0]).mint(expectedUri)).wait();
        expected[0].push(current);
        current++;
      }

      assert.deepEqual(
        uintArray(await contract.ownedBy(signers[0].address)),
        expected[0]
      );

      assert.deepEqual(
        uintArray(await contract.connect(signers[0]).myTokens()),
        expected[0]
      );
    });
  });
});
