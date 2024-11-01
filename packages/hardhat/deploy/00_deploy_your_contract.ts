import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const feeData = await hre.ethers.provider.getFeeData();

  const poolAddressesProvider = "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A"; // Aave PoolAddressesProvider
  const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8"; // USDC Token
  try {
    console.log("🚀 Starting the deployment...");

    await deploy("FlashVault", {
      from: deployer,
      // gasLimit: 30000000,
      args: [deployer, poolAddressesProvider, usdcAddress],
      log: true,
      autoMine: true,
      maxFeePerGas: feeData.maxFeePerGas as any,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas as any,
    });

    // Get the deployed contract instance to interact with it post-deployment
    const flashVault: Contract = await hre.ethers.getContract<Contract>("FlashVault", deployer);

    const flashVaultAddy = await flashVault.getAddress();
    console.log("✅ FlashVault deployed at:", flashVaultAddy);

    // Set the flashFunction address
    const flashFunctionAddress = "0x08762fc6bb91Af12ab6b6bF9f72729a5cD636152";
    const setFlashFunctionTx = await flashVault.setFlashFunction(flashFunctionAddress);
    await setFlashFunctionTx.wait();
    console.log(`✅ flashFunction set to ${flashFunctionAddress}`);
  } catch (error) {
    console.error("❌ Error deploying contracts or interacting with whale account:", error);
  }
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["YourContract"];
