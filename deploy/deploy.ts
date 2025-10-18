import * as dotenv from "dotenv";

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

dotenv.config();

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  if (!process.env.INFURA_API_KEY) {
    log("Warning: INFURA_API_KEY is not defined. Remote deployments may fail.");
  }

  const encryptedMafia = await deploy("EncryptedMafia", {
    from: deployer,
    log: true,
  });

  log(`EncryptedMafia contract deployed at ${encryptedMafia.address}`);
};

export default func;
func.id = "deploy_encrypted_mafia";
func.tags = ["EncryptedMafia"];
