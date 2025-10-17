// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, euint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Encrypted Mafia game coordinator
/// @notice Manages five-player Mafia games with encrypted roles
contract EncryptedMafia is SepoliaConfig {
    uint8 private constant MAX_PLAYERS = 5;
    uint256 private _nextGameId = 1;

    struct Game {
        address creator;
        uint8 playerCount;
        bool started;
        address[MAX_PLAYERS] players;
        mapping(address => bool) joined;
        mapping(address => euint8) encryptedRoles;
    }

    mapping(uint256 => Game) private _games;
    mapping(uint256 => bool) private _gameExists;

    event GameCreated(uint256 indexed gameId, address indexed creator);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event GameStarted(uint256 indexed gameId);
    event RoleAccessGranted(uint256 indexed gameId, address indexed player);

    error GameDoesNotExist(uint256 gameId);
    error GameAlreadyStarted(uint256 gameId);
    error GameNotReady(uint256 gameId);
    error GameIsFull(uint256 gameId);
    error PlayerAlreadyInGame(uint256 gameId, address player);
    error PlayerNotInGame(uint256 gameId, address player);

    /// @notice Creates a new game lobby
    /// @return gameId The identifier of the created game
    function createGame() external returns (uint256 gameId) {
        gameId = _nextGameId++;

        Game storage game = _games[gameId];
        game.creator = msg.sender;
        game.playerCount = 0;

        _gameExists[gameId] = true;

        emit GameCreated(gameId, msg.sender);
    }

    /// @notice Returns the number of games created so far
    function totalGames() external view returns (uint256) {
        return _nextGameId - 1;
    }

    /// @notice Returns summary information for a game
    function getGame(uint256 gameId)
        external
        view
        returns (address creator, bool started, uint8 playerCount, address[5] memory players)
    {
        Game storage game = _getGame(gameId);
        return (game.creator, game.started, game.playerCount, game.players);
    }

    /// @notice Checks whether an address is part of a game
    function isPlayerInGame(uint256 gameId, address player) external view returns (bool) {
        Game storage game = _getGame(gameId);
        return game.joined[player];
    }

    /// @notice Joins a game lobby
    function joinGame(uint256 gameId) external {
        Game storage game = _getGame(gameId);

        if (game.started) {
            revert GameAlreadyStarted(gameId);
        }

        if (game.joined[msg.sender]) {
            revert PlayerAlreadyInGame(gameId, msg.sender);
        }

        if (game.playerCount >= MAX_PLAYERS) {
            revert GameIsFull(gameId);
        }

        game.players[game.playerCount] = msg.sender;
        game.playerCount += 1;
        game.joined[msg.sender] = true;

        emit PlayerJoined(gameId, msg.sender);
    }

    /// @notice Starts a game once the lobby has five players
    function startGame(uint256 gameId) external {
        Game storage game = _getGame(gameId);

        if (game.started) {
            revert GameAlreadyStarted(gameId);
        }

        if (game.playerCount != MAX_PLAYERS) {
            revert GameNotReady(gameId);
        }

        uint8[5] memory roles = [uint8(1), uint8(1), uint8(2), uint8(2), uint8(3)];
        uint256 randomSeed = uint256(
            keccak256(
                abi.encodePacked(block.prevrandao, block.timestamp, blockhash(block.number - 1), gameId, address(this))
            )
        );

        for (uint256 i = roles.length - 1; i > 0; i--) {
            uint256 swapIndex = randomSeed % (i + 1);
            randomSeed = uint256(keccak256(abi.encodePacked(randomSeed, i)));
            uint8 temp = roles[i];
            roles[i] = roles[swapIndex];
            roles[swapIndex] = temp;
        }

        for (uint256 i = 0; i < MAX_PLAYERS; i++) {
            address player = game.players[i];

            euint8 encryptedRole = FHE.asEuint8(roles[i]);
            game.encryptedRoles[player] = encryptedRole;

            FHE.allowThis(encryptedRole);
            FHE.allow(encryptedRole, player);

            emit RoleAccessGranted(gameId, player);
        }

        game.started = true;

        emit GameStarted(gameId);
    }

    /// @notice Returns the encrypted role for a player in a started game
    function getEncryptedRole(uint256 gameId, address player) external view returns (euint8) {
        Game storage game = _getGame(gameId);

        if (!game.started) {
            revert GameNotReady(gameId);
        }

        if (!game.joined[player]) {
            revert PlayerNotInGame(gameId, player);
        }

        return game.encryptedRoles[player];
    }

    /// @notice Re-issues access to a player's encrypted role
    function requestRoleAccess(uint256 gameId) external {
        Game storage game = _getGame(gameId);

        if (!game.started) {
            revert GameNotReady(gameId);
        }

        if (!game.joined[msg.sender]) {
            revert PlayerNotInGame(gameId, msg.sender);
        }

        euint8 encryptedRole = game.encryptedRoles[msg.sender];
        FHE.allowThis(encryptedRole);
        FHE.allow(encryptedRole, msg.sender);

        emit RoleAccessGranted(gameId, msg.sender);
    }

    function _getGame(uint256 gameId) private view returns (Game storage) {
        if (!_gameExists[gameId]) {
            revert GameDoesNotExist(gameId);
        }
        return _games[gameId];
    }
}
