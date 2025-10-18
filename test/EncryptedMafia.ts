import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

import { EncryptedMafia, EncryptedMafia__factory } from "../types";

type Signers = {
  creator: HardhatEthersSigner;
  players: HardhatEthersSigner[];
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EncryptedMafia")) as EncryptedMafia__factory;
  const contract = (await factory.deploy()) as EncryptedMafia;
  const address = await contract.getAddress();

  return { contract, address };
}

describe("EncryptedMafia", function () {
  let signers: Signers;
  let contract: EncryptedMafia;
  let contractAddress: string;

  before(async function () {
    const [creator, ...rest] = await ethers.getSigners();
    signers = {
      creator,
      players: rest.slice(0, 5),
    };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      this.skip();
    }

    ({ contract, address: contractAddress } = await deployFixture());
  });

  it("creates a game and allows players to join", async function () {
    const tx = await contract.connect(signers.creator).createGame();
    await tx.wait();

    const totalGames = await contract.totalGames();
    expect(totalGames).to.equal(1n);

    const game = await contract.getGame(1n);
    expect(game.creator).to.equal(signers.creator.address);
    expect(game.started).to.equal(false);
    expect(game.playerCount).to.equal(0);

    for (let i = 0; i < signers.players.length; i++) {
      const player = signers.players[i];
      const joinTx = await contract.connect(player).joinGame(1n);
      await joinTx.wait();
    }

    const updatedGame = await contract.getGame(1n);
    expect(updatedGame.playerCount).to.equal(5);

    const players = updatedGame.players.filter((address) => address !== ethers.ZeroAddress);
    expect(players.length).to.equal(5);
  });

  it("assigns encrypted roles when the game starts", async function () {
    await contract.connect(signers.creator).createGame();

    for (let i = 0; i < signers.players.length; i++) {
      await (await contract.connect(signers.players[i]).joinGame(1n)).wait();
    }

    const starter = signers.players[0];
    await (await contract.connect(starter).startGame(1n)).wait();

    const roles: number[] = [];

    for (let i = 0; i < signers.players.length; i++) {
      const player = signers.players[i];
      const encryptedRole = await contract.getEncryptedRole(1n, player.address);
      const clearRole = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        encryptedRole,
        contractAddress,
        player,
      );

      roles.push(Number(clearRole));
    }

    const villagerCount = roles.filter((role) => role === 1).length;
    const werewolfCount = roles.filter((role) => role === 2).length;
    const seerCount = roles.filter((role) => role === 3).length;

    expect(villagerCount).to.equal(2);
    expect(werewolfCount).to.equal(2);
    expect(seerCount).to.equal(1);
  });

  it("reverts when trying to start without five players", async function () {
    await contract.connect(signers.creator).createGame();

    for (let i = 0; i < 3; i++) {
      await (await contract.connect(signers.players[i]).joinGame(1n)).wait();
    }

    await expect(contract.connect(signers.creator).startGame(1n)).to.be.revertedWithCustomError(
      contract,
      "GameNotReady",
    );
  });
});
