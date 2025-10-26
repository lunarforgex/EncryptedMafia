# EncryptedMafia

> A blockchain-based Mafia game demonstrating **Fully Homomorphic Encryption (FHE)** for privacy-preserving role assignment

[![License](https://img.shields.io/badge/license-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.27-363636.svg?logo=solidity)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.0-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)

**EncryptedMafia** is a proof-of-concept decentralized application (dApp) that brings the classic Mafia social deduction game to the blockchain with a cutting-edge twist: player roles are encrypted on-chain using **Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine)**. This ensures that role assignments remain private and verifiable without revealing sensitive information to other players or even the smart contract itself.

🎭 **Live Demo**: [Deployed on Sepolia Testnet](https://sepolia.etherscan.io/address/0x668978a871d398DdB8eaC6D4B2380efF35f7Def6)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Why EncryptedMafia?](#why-encryptedmafia)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Deployment](#deployment)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**EncryptedMafia** reimagines the traditional Mafia party game as a decentralized application where trust is guaranteed by cryptography rather than a game moderator. Players join game lobbies, and once a lobby reaches 5 players, roles are assigned using **Fully Homomorphic Encryption (FHE)**—a revolutionary cryptographic technique that allows computation on encrypted data.

### The Game

In this implementation:
- **5 players** per game
- **Role distribution**: 2 Villagers, 2 Werewolves, 1 Seer
- Roles are **encrypted on-chain** and can only be decrypted by the assigned player
- No central authority can view or manipulate role assignments

This project serves as a **technical demonstration** of FHEVM's capabilities in creating privacy-preserving smart contracts for gaming and beyond.

---

## Key Features

### 🔐 Privacy-Preserving Role Assignment
- Player roles are encrypted using **Zama's FHEVM** technology
- Roles are stored on-chain in encrypted form (`euint8` type)
- Only the assigned player can decrypt their role using cryptographic proofs
- Zero-knowledge approach ensures fairness without trusted intermediaries

### 🎮 Decentralized Game Coordination
- Fully on-chain game state management
- Player lobbies and game lifecycle managed by smart contracts
- Transparent and verifiable game history on Ethereum

### 🔗 Web3 Integration
- **RainbowKit** for seamless wallet connection
- Support for multiple wallet providers (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- **Wagmi** and **Viem** for robust blockchain interactions
- **Ethers.js** for contract communication

### ⚡ Modern Tech Stack
- **React 19** with TypeScript for type-safe frontend development
- **Vite** for lightning-fast builds and hot module replacement
- **Hardhat** for smart contract development, testing, and deployment
- **TanStack Query** for efficient async state management

### 🧪 Fully Tested
- Comprehensive smart contract test suite using Chai
- Role distribution verification (ensures correct role counts)
- End-to-end game flow testing

### 🚀 Production-Ready Deployment
- Deployed on **Sepolia testnet** with verified contracts
- Hardhat deployment scripts with environment configuration
- Gas optimization and error handling

---

## Why EncryptedMafia?

Traditional online implementations of social deduction games face several challenges:

### Problems Solved

1. **Trust Issues**: Centralized servers can manipulate role assignments or leak information
   - **Solution**: Blockchain-based, verifiable, and immutable role assignment

2. **Privacy Concerns**: Storing sensitive game data (roles) in plaintext exposes vulnerabilities
   - **Solution**: FHE encryption ensures roles remain private even on a public blockchain

3. **Single Point of Failure**: Traditional game servers can go offline
   - **Solution**: Decentralized infrastructure on Ethereum provides 24/7 availability

4. **Cheating & Collusion**: Moderators or admins can unfairly influence games
   - **Solution**: Cryptographic guarantees eliminate human bias in role distribution

### Advantages Over Traditional Implementations

| Feature | Traditional Games | EncryptedMafia |
|---------|------------------|----------------|
| Role Privacy | Server-side secrets | Cryptographic encryption (FHE) |
| Verifiability | Trust the moderator | Blockchain transparency |
| Censorship Resistance | Centralized control | Permissionless participation |
| Data Availability | Server uptime dependent | Permanent on-chain storage |
| Fairness | Human moderator | Provably random + encrypted |

---

## Technology Stack

### Smart Contracts
- **Solidity**: `^0.8.27` - Smart contract programming language
- **FHEVM Core Libraries**:
  - `@fhevm/solidity`: `^0.8.0` - FHE operations and encrypted types
  - `@zama-fhe/oracle-solidity`: `^0.1.0` - Oracle integration for decryption
  - `encrypted-types`: `^0.0.4` - TypeScript definitions for FHE types
- **Hardhat**: `^2.26.0` - Ethereum development environment
- **TypeChain**: `^8.3.2` - Generate TypeScript bindings from ABIs
- **Ethers.js**: `^6.15.0` - Ethereum library for contract interaction

### Frontend
- **React**: `19.1.1` - UI component library
- **TypeScript**: `~5.8.3` - Type-safe JavaScript
- **Vite**: `^7.1.6` - Next-generation build tool
- **Wagmi**: `^2.17.0` - React hooks for Ethereum
- **Viem**: `^2.37.6` - TypeScript Ethereum library
- **RainbowKit**: `^2.2.8` - Wallet connection UI
- **TanStack React Query**: `^5.89.0` - Async state management
- **Zama Relayer SDK**: `^0.2.0` - FHE decryption service

### Development Tools
- **ESLint**: `^8.57.1` - Code linting
- **Prettier**: `^3.6.2` - Code formatting (with Solidity plugin)
- **SolHint**: `^6.0.0` - Solidity linting
- **Hardhat Plugins**:
  - `hardhat-deploy`: Contract deployment management
  - `hardhat-gas-reporter`: Gas usage analytics
  - `solidity-coverage`: Test coverage reports
  - `@nomicfoundation/hardhat-verify`: Etherscan verification
  - `@fhevm/hardhat-plugin`: FHEVM integration

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ RainbowKit   │  │ GameDashboard│  │   Zama Instance      │  │
│  │ (Wallet UI)  │  │  Component   │  │ (FHE Runtime)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                  │                      │             │
│         └──────────────────┴──────────────────────┘             │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │  Wagmi Provider │
                    │  (Web3 Context) │
                    └─────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │    Ethereum Network          │
              │      (Sepolia Testnet)       │
              │  ┌────────────────────────┐  │
              │  │ EncryptedMafia.sol     │  │
              │  │                        │  │
              │  │ - Game Lobbies         │  │
              │  │ - Role Assignment      │  │
              │  │ - FHE Encrypted Roles  │  │
              │  └────────────────────────┘  │
              └──────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │   Zama FHE Relayer Service   │
              │  (Decryption Oracle)         │
              └──────────────────────────────┘
```

### Data Flow

1. **Wallet Connection**: User connects via RainbowKit
2. **Game Creation**: User creates a game lobby (transaction sent to contract)
3. **Players Join**: Up to 5 players join the lobby
4. **Game Start**: Once full, any player triggers role assignment
5. **Role Encryption**: Contract generates roles and encrypts them using FHE
6. **Access Grant**: FHE permissions granted to individual players
7. **Role Decryption**: Player uses Zama SDK + wallet signature to decrypt their role
8. **Display**: Decrypted role shown in UI

---

## How It Works

### 1. Game Creation
A player calls `createGame()` on the smart contract, which:
- Generates a unique game ID
- Sets the caller as the game creator
- Initializes an empty player lobby

### 2. Joining the Lobby
Players call `joinGame(gameId)` to enter the lobby:
- Contract validates the game isn't full (max 5 players)
- Adds the player to the game's player array
- Marks the player as joined to prevent duplicates

### 3. Starting the Game
Once exactly 5 players have joined, anyone can call `startGame(gameId)`:
- **Role Setup**: Creates an array `[1, 1, 2, 2, 3]` representing:
  - `1` = Villager (2 players)
  - `2` = Werewolf (2 players)
  - `3` = Seer (1 player)
- **Randomization**: Uses Fisher-Yates shuffle with entropy from:
  - `block.prevrandao` (RANDAO beacon)
  - `block.timestamp`
  - `blockhash(block.number - 1)`
  - `gameId` and contract address
- **Encryption**: Each role is converted to an encrypted `euint8` type using `FHE.asEuint8()`
- **Access Control**: Uses `FHE.allow()` to grant decryption permission only to the assigned player

### 4. Decrypting Roles
Players decrypt their role through the frontend:
1. **Generate Keypair**: Frontend generates an ephemeral FHE keypair
2. **EIP-712 Signature**: User signs a typed data message proving wallet ownership
3. **Request Decryption**: Zama Relayer SDK sends encrypted role + signature to decryption service
4. **Receive Plaintext**: Service validates signature and returns decrypted role value
5. **Display**: Frontend maps role value (1/2/3) to human-readable label

### Encryption Flow Diagram

```
Plain Role (uint8)  ──────────────────────────────────────────┐
    │                                                          │
    │ FHE.asEuint8()                                          │
    ▼                                                          │
Encrypted Role (euint8) ────┐                                 │
    │                       │                                 │
    │ Store on-chain        │                                 │
    ▼                       │                                 │
  Blockchain                │                                 │
    │                       │                                 │
    │ Read encrypted data   │                                 │
    ▼                       │                                 │
Frontend ◄──────────────────┘                                 │
    │                                                          │
    │ userDecrypt() with signature                            │
    ▼                                                          │
Zama Relayer ────────────────────────────────────────────────┘
    │                                   Verifies access
    │                                   Decrypts using FHE
    ▼
Plain Role (uint8) ──► Display to user
```

---

## Getting Started

### Prerequisites

- **Node.js**: `>=20.x`
- **npm**: `>=7.0.0`
- **MetaMask** or compatible Web3 wallet
- **Sepolia ETH**: Get testnet ETH from a [Sepolia faucet](https://sepoliafaucet.com/)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/EncryptedMafia.git
cd EncryptedMafia
```

2. **Install smart contract dependencies**:
```bash
npm install
```

3. **Install frontend dependencies**:
```bash
cd app
npm install
cd ..
```

4. **Configure environment variables**:
Create a `.env` file in the root directory:
```env
# Sepolia RPC URL (get from Infura/Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Deployer private key (DO NOT commit this!)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Create a `.env` file in the `app/` directory:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

---

### Running Locally

#### Option 1: Local Hardhat Network

1. **Start local blockchain**:
```bash
npm run chain
```

2. **Deploy contracts** (in a new terminal):
```bash
npm run deploy:localhost
```

3. **Start frontend**:
```bash
cd app
npm run dev
```

4. Open `http://localhost:5173` in your browser

5. **Connect MetaMask to localhost**:
   - Network: `http://127.0.0.1:8545`
   - Chain ID: `31337`

#### Option 2: Sepolia Testnet

The contract is already deployed on Sepolia at:
```
0x668978a871d398DdB8eaC6D4B2380efF35f7Def6
```

1. **Start frontend**:
```bash
cd app
npm run dev
```

2. **Switch MetaMask to Sepolia network**

3. **Get testnet ETH** from a [faucet](https://sepoliafaucet.com/)

4. Start playing!

---

### Deployment

#### Deploy to Sepolia

1. **Ensure environment variables are set** (see `.env` configuration above)

2. **Deploy contract**:
```bash
npm run deploy:sepolia
```

3. **Verify contract on Etherscan**:
```bash
npm run verify:sepolia
```

4. **Update frontend contract address**:
Edit `app/src/config/contract.ts` with your new contract address.

#### Deploy Frontend

The frontend can be deployed to any static hosting service:

```bash
cd app
npm run build
```

Deploy the `app/dist/` directory to:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **IPFS**: `ipfs add -r dist/`

---

## Smart Contract

### EncryptedMafia.sol

**Location**: `contracts/EncryptedMafia.sol`

**Key Functions**:

#### Public Functions

```solidity
function createGame() external returns (uint256 gameId)
```
Creates a new game lobby and returns the game ID.

```solidity
function joinGame(uint256 gameId) external
```
Joins an existing game lobby. Reverts if game is full or already started.

```solidity
function startGame(uint256 gameId) external
```
Starts the game, assigns and encrypts roles. Requires exactly 5 players.

```solidity
function getEncryptedRole(uint256 gameId, address player) external view returns (euint8)
```
Returns the encrypted role for a player in a started game.

```solidity
function requestRoleAccess(uint256 gameId) external
```
Re-issues FHE decryption permissions for a player's role.

```solidity
function getGame(uint256 gameId) external view returns (...)
```
Returns game metadata (creator, started status, player count, player list).

```solidity
function totalGames() external view returns (uint256)
```
Returns the total number of games created.

```solidity
function isPlayerInGame(uint256 gameId, address player) external view returns (bool)
```
Checks if an address is part of a specific game.

#### Events

```solidity
event GameCreated(uint256 indexed gameId, address indexed creator);
event PlayerJoined(uint256 indexed gameId, address indexed player);
event GameStarted(uint256 indexed gameId);
event RoleAccessGranted(uint256 indexed gameId, address indexed player);
```

#### Custom Errors

```solidity
error GameDoesNotExist(uint256 gameId);
error GameAlreadyStarted(uint256 gameId);
error GameNotReady(uint256 gameId);
error GameIsFull(uint256 gameId);
error PlayerAlreadyInGame(uint256 gameId, address player);
error PlayerNotInGame(uint256 gameId, address player);
```

### FHE Implementation Details

The contract uses Zama's FHEVM library:

```solidity
import {FHE, euint8} from "@fhevm/solidity/lib/FHE.sol";
```

**Encrypted Type**: `euint8` - Encrypted 8-bit unsigned integer
- Stores role values (1, 2, or 3) in encrypted form
- Supports FHE operations while encrypted
- Can only be decrypted by authorized addresses

**Access Control**:
```solidity
FHE.allowThis(encryptedRole);  // Contract can read
FHE.allow(encryptedRole, player);  // Player can decrypt
```

### Deployment Address

**Sepolia Testnet**: `0x668978a871d398DdB8eaC6D4B2380efF35f7Def6`

[View on Etherscan](https://sepolia.etherscan.io/address/0x668978a871d398DdB8eaC6D4B2380efF35f7Def6)

---

## Frontend Application

### Architecture

The frontend is built with **React 19** and **TypeScript**, structured for modularity and type safety.

#### Key Components

1. **App.tsx**: Root component
   - Initializes Wagmi provider
   - Configures RainbowKit wallet connection
   - Sets up React Query client

2. **GameDashboard.tsx**: Main game interface
   - Fetches all games from the contract
   - Handles game creation, joining, starting
   - Coordinates FHE role decryption
   - Manages loading states and error handling

3. **GameCard.tsx**: Individual game display
   - Shows game status (waiting/in progress)
   - Lists players with addresses
   - Displays action buttons (join, start, view role)
   - Shows decrypted role when available

#### Custom Hooks

1. **useZamaInstance.ts**:
```typescript
const { instance, isLoading, error } = useZamaInstance();
```
Initializes the Zama FHE SDK for client-side encryption/decryption.

2. **useEthersSigner.ts**:
```typescript
const signer = useEthersSigner();
```
Converts Wagmi's wallet client to Ethers.js signer for contract interactions.

#### Configuration

**config/wagmi.ts**: Blockchain connection setup
- Sepolia testnet configuration
- WalletConnect project ID
- Supported wallet connectors

**config/contract.ts**: Contract integration
- Deployed contract address
- Complete ABI for all contract functions
- Type-safe contract interactions

### User Interface

**Styling**: Custom CSS with modern design
- Dark theme with gradient accents
- Responsive grid layout for game cards
- Loading states and animations
- Color-coded role labels (Villager, Werewolf, Seer)

**Wallet Integration**: RainbowKit provides:
- Beautiful connect wallet modal
- Multi-wallet support (MetaMask, Coinbase, WalletConnect, etc.)
- Network switching
- Account display and disconnect

---

## Project Structure

```
EncryptedMafia/
├── contracts/                  # Solidity smart contracts
│   └── EncryptedMafia.sol     # Main game contract
├── app/                        # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── App.tsx
│   │   │   ├── GameDashboard.tsx
│   │   │   └── GameCard.tsx
│   │   ├── config/            # Configuration files
│   │   │   ├── wagmi.ts       # Web3 provider config
│   │   │   └── contract.ts    # Contract ABI & address
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useZamaInstance.ts
│   │   │   └── useEthersSigner.ts
│   │   ├── constants/         # Application constants
│   │   │   └── roles.ts       # Role labels mapping
│   │   ├── styles/            # CSS stylesheets
│   │   │   ├── App.css
│   │   │   ├── GameDashboard.css
│   │   │   └── index.css
│   │   └── main.tsx           # Application entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
├── test/                       # Smart contract tests
│   └── EncryptedMafia.ts      # Comprehensive test suite
├── deploy/                     # Deployment scripts
│   └── deploy.ts              # Hardhat deployment
├── tasks/                      # Hardhat CLI tasks
│   ├── mafia-address.ts
│   ├── mafia-create.ts
│   ├── mafia-join.ts
│   ├── mafia-start.ts
│   └── mafia-role.ts
├── docs/                       # Documentation
├── artifacts/                  # Compiled contract outputs
├── deployments/                # Deployment records
│   └── sepolia/
│       └── EncryptedMafia.json
├── hardhat.config.ts           # Hardhat configuration
├── package.json                # Root dependencies
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment template
├── .gitignore
├── LICENSE
└── README.md
```

---

## Testing

### Smart Contract Tests

**Location**: `test/EncryptedMafia.ts`

**Run tests**:
```bash
npm test
```

**Test coverage**:
```bash
npm run coverage
```

**Test suite includes**:
- Game creation and ID generation
- Player joining validation (max 5 players)
- Duplicate join prevention
- Game start requirements (exactly 5 players)
- Role distribution verification (2 Villagers, 2 Werewolves, 1 Seer)
- Encrypted role assignment
- Role access control
- Custom error handling

**Example test**:
```typescript
it("should distribute roles correctly (2 Villagers, 2 Werewolves, 1 Seer)", async function () {
  // Test implementation...
});
```

### Frontend Testing

The frontend can be tested manually:
1. **Wallet Connection**: Test multiple wallet providers
2. **Game Flow**: Create → Join → Start → Decrypt
3. **Error Handling**: Try joining full games, starting incomplete games
4. **UI Responsiveness**: Test on different screen sizes
5. **Network Switching**: Verify behavior on wrong network

---

## Security Considerations

### Smart Contract Security

1. **Access Control**:
   - FHE permissions are granular (per player, per role)
   - Only authorized players can decrypt their own roles
   - Contract validates all state transitions

2. **Randomness**:
   - Uses multiple entropy sources (RANDAO, timestamp, blockhash)
   - Fisher-Yates shuffle ensures unbiased distribution
   - **Note**: Not suitable for high-stakes applications; consider Chainlink VRF for production

3. **Reentrancy Protection**:
   - No external calls during state changes
   - Follow checks-effects-interactions pattern

4. **Error Handling**:
   - Custom errors for gas efficiency
   - Comprehensive validation of game states

### Frontend Security

1. **Private Key Management**:
   - Never store private keys in frontend code
   - Use wallet signatures for authentication
   - Ephemeral FHE keypairs discarded after use

2. **API Security**:
   - WalletConnect project ID should be environment variable
   - RPC URLs should use rate-limited endpoints

3. **Input Validation**:
   - Contract addresses validated before interactions
   - TypeScript prevents type-related errors

### Known Limitations

1. **Role Distribution Visibility**: While individual roles are encrypted, the distribution (2-2-1) is known
2. **Blockchain Transparency**: All encrypted data is public; security relies on FHE cryptographic strength
3. **Relayer Trust**: Zama's relayer service is trusted for correct decryption
4. **Gas Costs**: FHE operations are more expensive than plaintext operations

---

## Roadmap

### Phase 1: Foundation (Completed ✅)
- [x] Smart contract implementation with FHEVM
- [x] Basic frontend with wallet connection
- [x] Game creation and joining
- [x] Encrypted role assignment
- [x] Role decryption with Zama SDK
- [x] Deployment to Sepolia testnet

### Phase 2: Game Mechanics (In Progress)
- [ ] Implement full Mafia game loop (day/night phases)
- [ ] Voting system for player elimination
- [ ] Werewolf night actions (choose victim)
- [ ] Seer night actions (investigate player role)
- [ ] Game conclusion and winner determination
- [ ] Time-based turn progression

### Phase 3: Enhanced Features
- [ ] Multi-game lobby system
- [ ] Player profiles and statistics
- [ ] Game history and replay
- [ ] Custom game configurations (role distribution)
- [ ] Chat system (encrypted?)
- [ ] Tournament mode

### Phase 4: Optimization & Scaling
- [ ] Gas optimization (batch operations, storage packing)
- [ ] Layer 2 deployment (Arbitrum, Optimism)
- [ ] Improved randomness (Chainlink VRF integration)
- [ ] Advanced FHE operations (encrypted voting)

### Phase 5: Production Readiness
- [ ] Security audit (smart contract + FHE implementation)
- [ ] Mainnet deployment
- [ ] Mobile-responsive UI improvements
- [ ] Progressive Web App (PWA) support
- [ ] Comprehensive documentation and tutorials

### Future Explorations
- [ ] Support for different game modes (Avalon, Secret Hitler variants)
- [ ] NFT-based character/cosmetic system
- [ ] DAO governance for game rule modifications
- [ ] Cross-chain compatibility
- [ ] Integration with other FHE-based games

---

## Contributing

Contributions are welcome! This project is open-source and community-driven.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow existing patterns, use Prettier for formatting
- **Testing**: Add tests for new smart contract features
- **Documentation**: Update README and code comments for significant changes
- **Commits**: Use clear, descriptive commit messages

### Areas for Contribution

- **Smart Contract**: Implement game logic phases, gas optimization
- **Frontend**: UI/UX improvements, mobile responsiveness
- **Testing**: Expand test coverage, integration tests
- **Documentation**: Tutorials, architecture diagrams, video guides
- **Security**: Code reviews, vulnerability reports

### Reporting Issues

Found a bug? Have a suggestion?
- **GitHub Issues**: [Open an issue](https://github.com/yourusername/EncryptedMafia/issues)
- Include detailed description, steps to reproduce, and environment info

---

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

See [LICENSE](LICENSE) file for details.

**Note**: This license is chosen to align with Zama's FHEVM licensing requirements.

---

## Acknowledgments

### Built With
- **[Zama](https://www.zama.ai/)** - FHEVM and FHE cryptography libraries
- **[Hardhat](https://hardhat.org/)** - Ethereum development framework
- **[Wagmi](https://wagmi.sh/)** - React hooks for Ethereum
- **[RainbowKit](https://www.rainbowkit.com/)** - Beautiful wallet connection UI
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Ethers.js](https://ethers.org/)** - Ethereum library
- **[React](https://react.dev/)** - UI framework

### Special Thanks
- The **Zama team** for pioneering Fully Homomorphic Encryption on blockchain
- The **Ethereum community** for building robust development tools
- **Contributors** to all the open-source libraries used in this project

### Inspiration
This project demonstrates the potential of **privacy-preserving smart contracts** in gaming. As FHE technology matures, we envision a future where:
- Games preserve player privacy by default
- On-chain gaming rivals traditional gaming UX
- Decentralized applications can handle sensitive data securely

---

## Contact & Resources

- **GitHub**: [github.com/yourusername/EncryptedMafia](https://github.com/yourusername/EncryptedMafia)
- **Issues**: [GitHub Issues](https://github.com/yourusername/EncryptedMafia/issues)
- **Zama Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **FHEVM GitHub**: [github.com/zama-ai/fhevm](https://github.com/zama-ai/fhevm)

---

## Quick Start Guide

**For players** (TL;DR):
1. Get Sepolia ETH from a [faucet](https://sepoliafaucet.com/)
2. Visit the deployed app (or run locally)
3. Connect your Web3 wallet
4. Create or join a game
5. Once 5 players join, start the game
6. Decrypt and view your role
7. Play Mafia!

**For developers** (TL;DR):
```bash
# Clone repo
git clone https://github.com/yourusername/EncryptedMafia.git
cd EncryptedMafia

# Install dependencies
npm install
cd app && npm install && cd ..

# Run tests
npm test

# Start local blockchain
npm run chain

# Deploy (new terminal)
npm run deploy:localhost

# Start frontend (new terminal)
cd app && npm run dev
```

---

**Happy Gaming! 🎭🔐**

*EncryptedMafia - Where cryptography meets deception*
