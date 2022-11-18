const hre = require('hardhat');
const fs = require('fs');
const { ethers } = require('ethers');

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

async function deployAndVerify(name, constructorArguments = []) {
  const base = './client/src/components/Dapp/data/';
  const cache = base + hre.network.name;
  if (!fs.existsSync(cache)) fs.mkdirSync(cache);

  const signer = (await hre.ethers.getSigners())[0];
  const { abi, bytecode } = hre.artifacts.readArtifactSync(name);
  const contract = await new ethers.ContractFactory(
    abi,
    bytecode,
    signer
  ).deploy(...constructorArguments);
  await contract.deployTransaction.wait();

  const data = {
    abi,
    bytecode,
    address: contract.address,
  };
  fs.writeFileSync(`${cache}/${name}.json`, JSON.stringify(data, null, 2));

  if (!['hardhat', 'localhost'].includes(hre.network.name))
    await verify(contract.deployTransaction, {
      address: contract.address,
      constructorArguments,
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
  console.log('Deployment operations complete');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
