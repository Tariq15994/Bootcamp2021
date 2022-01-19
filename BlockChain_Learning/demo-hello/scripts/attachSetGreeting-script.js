const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");

   
  const greeter = await Greeter.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");

  console.log("Greeter deployed at:", greeter.address);

  const result = await greeter.setGreeting("Hello from Tariq Jokhio");
  console.log("result" , result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
