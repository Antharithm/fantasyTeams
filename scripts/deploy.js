const hre = require('hardhat');
const fs = require('fs');

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

async function deployAndVerify(name, args = []) {
  const cache = './client/src/components/Dapp/data/' + hre.network.name;
  if (!fs.existsSync(cache)) fs.mkdirSync(cache);

  const contract = await (
    await hre.ethers.getContractFactory(name)
  ).deploy(...args);
  await contract.deployTransaction.wait();
  fs.writeFileSync(
    `${cache}/${name}.json`,
    JSON.stringify(
      {
        abi: hre.artifacts.readArtifactSync(name).abi,
        address: contract.address,
      },
      null,
      2
    )
  );

  if (!['hardhat', 'localhost'].includes(hre.network.name))
    await verify(contract.deployTransaction, {
      address: contract.address,
      constructorArguments: args,
    });

  console.log('DEPLOYED:', name, contract.address);
  return contract;
}

async function main() {
  console.log();
  const nft = await deployAndVerify('NonFungiblePlayers');
  const tkn = await deployAndVerify('FantasyPoints');
  await deployAndVerify('fantasy', [nft.address, tkn.address]);
  // await deployAndVerify('TruflationTester', [oracleId_, jobId_, fee_]);
  console.log();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
