const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = hre.ethers.utils.parseEther("1");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(
    `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// LEAVE THIS COMMENTED OUT FOR NOW - WE WILL NEED IT LATER

// const hre = require("hardhat");

// async function main() {

//   const OakToken = await hre.ethers.getContractFactory("OakToken"); // the class
//   const oakTokenDeployed = await OakToken.deploy("OakTokenName", "OAK"); // paste in constructor arguments
//   await oakTokenDeployed.deployed();

//   console.log("Deployed OneOfAKind to:", oakTokenDeployed.address);

// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });