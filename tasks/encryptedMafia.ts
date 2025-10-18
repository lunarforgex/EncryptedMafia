import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const CONTRACT_NAME = "EncryptedMafia";

function parseSignerIndex(raw: unknown): number {
  const value = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("Invalid signer index");
  }
  return value;
}

task("task:mafia-address", "Prints the EncryptedMafia address").setAction(async (_taskArguments: TaskArguments, hre) => {
  const deployment = await hre.deployments.get(CONTRACT_NAME);
  console.log(`${CONTRACT_NAME} address is ${deployment.address}`);
});

task("task:mafia-create", "Creates a new Mafia game")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index", "0")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const signerIndex = parseSignerIndex(taskArguments.signer);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get(CONTRACT_NAME);

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);

    const tx = await contract.connect(signer).createGame();
    const receipt = await tx.wait();

    const totalGames = await contract.totalGames();
    console.log(`createGame tx=${tx.hash} status=${receipt?.status}`);
    console.log(`total games now ${totalGames}`);
  });

task("task:mafia-join", "Joins an existing Mafia game")
  .addParam("game", "Game identifier")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index", "0")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const signerIndex = parseSignerIndex(taskArguments.signer);
    const gameId = BigInt(taskArguments.game);

    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get(CONTRACT_NAME);

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);

    const tx = await contract.connect(signer).joinGame(gameId);
    const receipt = await tx.wait();
    console.log(`joinGame tx=${tx.hash} status=${receipt?.status}`);
  });

task("task:mafia-start", "Starts a Mafia game once five players joined")
  .addParam("game", "Game identifier")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index", "0")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments } = hre;

    const signerIndex = parseSignerIndex(taskArguments.signer);
    const gameId = BigInt(taskArguments.game);

    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get(CONTRACT_NAME);

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);

    const tx = await contract.connect(signer).startGame(gameId);
    const receipt = await tx.wait();
    console.log(`startGame tx=${tx.hash} status=${receipt?.status}`);
  });

task("task:mafia-role", "Decrypts the caller role for a game")
  .addParam("game", "Game identifier")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index", "0")
  .setAction(async (taskArguments: TaskArguments, hre) => {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const signerIndex = parseSignerIndex(taskArguments.signer);
    const gameId = BigInt(taskArguments.game);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const deployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get(CONTRACT_NAME);

    const contract = await ethers.getContractAt(CONTRACT_NAME, deployment.address);

    const encryptedRole = await contract.getEncryptedRole(gameId, signer.address);
    const clearRole = await fhevm.userDecryptEuint(
      FhevmType.euint8,
      encryptedRole,
      deployment.address,
      signer,
    );

    console.log(`Game ${gameId} role for ${signer.address}: ${clearRole}`);
  });
