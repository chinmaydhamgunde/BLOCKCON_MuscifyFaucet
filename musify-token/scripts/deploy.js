const hre = require("hardhat");

async function main() {
  const Musify= await hre.ethers.getContractFactory("Musify");

  const musicToken = await Musify.deploy(100000,1);

  await musicToken.deployed();

  console.log("Musify :",musicToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
