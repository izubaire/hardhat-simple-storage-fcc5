// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract ....");
  const simpleStorage = await SimpleStorageFactory.deploy();
  console.log(`Deploying contract to: ${simpleStorage.address}`);
  // When we deploy to our hardhat network
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  // Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updateValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updateValue}`);
}

async function verify(contractAdress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAdress,
      contructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
