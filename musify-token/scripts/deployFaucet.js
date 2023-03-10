const hre = require("hardhat");

async function main() {
  const Faucet= await hre.ethers.getContractFactory("Faucet");

  const faucet = await Faucet.deploy("0xDe3045129596212f890498608B6c24933652809a");

  await faucet.deployed();

  console.log("Faucet :",faucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
