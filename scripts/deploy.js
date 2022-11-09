const hre = require('hardhat');
const fs = require('fs');

async function deploy(name) {
  const cache = './client/src/components/Dapp/data';
  const pathTo = `${cache}/${name}.json`;
  if (!fs.existsSync(cache)) fs.mkdirSync(cache);
  else if (fs.existsSync(pathTo)) {
    throw new Error('already deployed');
  }

  const contract = await (await hre.ethers.getContractFactory(name)).deploy();
  await contract.deployTransaction.wait();

  fs.writeFileSync(
    pathTo,
    JSON.stringify(
      {
        abi: hre.artifacts.readArtifactSync(name).abi,
        address: contract.address,
      },
      null,
      2
    )
  );
  return contract;
}

async function verify(tx, options) {
  await tx.wait();
  await new Promise((resolve) => setTimeout(resolve, 15000));
  try {
    console.log('Verifying...');
    await hre.run('verify:verify', options);
    console.log('Verified!');
  } catch (e) {
    const reason = e.toString().split('\n')[2];
    if (reason === 'Reason: Already Verified') console.log('Double Verified!');
    else if (
      reason ===
      `Reason: The Etherscan API responded that the address ${options.address} does not have bytecode.`
    ) {
      console.log('Contract not indexed, re-verifying...');
      await verify(tx, options);
    } else throw e;
  }
}

async function deployAndVerify(name) {
  const contract = await deploy(name);
  await verify(contract.deployTransaction, { address: contract.address });
}

async function main() {
  await deployAndVerify('NonFungiblePlayers');
  await deployAndVerify('FantasyPoints');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
