import { useCallback, useEffect, useMemo, useState } from 'react';
import { Contract } from 'ethers';
import type { Address } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { GameCard, type GameInfo } from './GameCard';
import '../styles/GameDashboard.css';

type RolesByGame = Record<string, number>;

export function GameDashboard() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: isZamaLoading, error: zamaError } = useZamaInstance();

  const zamaReady = useMemo(() => Boolean(instance) && !isZamaLoading && !zamaError, [instance, isZamaLoading, zamaError]);

  const [games, setGames] = useState<GameInfo[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState<bigint | null>(null);
  const [startingGameId, setStartingGameId] = useState<bigint | null>(null);
  const [requestingGameId, setRequestingGameId] = useState<bigint | null>(null);
  const [viewingGameId, setViewingGameId] = useState<bigint | null>(null);
  const [rolesByGame, setRolesByGame] = useState<RolesByGame>({});

  const refreshGames = useCallback(async () => {
    if (!publicClient) {
      return;
    }

    setIsRefreshing(true);
    setError(null);

    try {
      const totalGames = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'totalGames',
      })) as bigint;

      const total = Number(totalGames);
      if (total === 0) {
        setGames([]);
        return;
      }

      const fetches: Promise<GameInfo>[] = [];
      for (let i = 1; i <= total; i++) {
        const gameId = BigInt(i);
        const fetchGame = publicClient
          .readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getGame',
            args: [gameId],
          })
          .then((result) => {
            const [creator, started, playerCount, players] = result as readonly [
              Address,
              boolean,
              number,
              readonly Address[],
            ];
            return {
              id: gameId,
              creator,
              started,
              playerCount: Number(playerCount),
              players: [...players] as Address[],
            } satisfies GameInfo;
          });
        fetches.push(fetchGame);
      }

      const resolved = await Promise.all(fetches);
      setGames(resolved.reverse());
    } catch (err) {
      console.error('Failed to load games', err);
      setError('Failed to load games');
    } finally {
      setIsRefreshing(false);
    }
  }, [publicClient]);

  useEffect(() => {
    if (publicClient) {
      refreshGames();
    }
  }, [publicClient, refreshGames]);

  const resetRoleForGame = useCallback((gameId: bigint) => {
    setRolesByGame((previous) => {
      const next = { ...previous };
      delete next[gameId.toString()];
      return next;
    });
  }, []);

  const getWritableContract = useCallback(async () => {
    if (!signerPromise) {
      throw new Error('Wallet is not connected');
    }
    const signer = await signerPromise;
    if (!signer) {
      throw new Error('Wallet is not connected');
    }

    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signerPromise]);

  const handleCreateGame = useCallback(async () => {
    setFeedback(null);
    setError(null);

    try {
      setIsCreating(true);
      const contract = await getWritableContract();
      const tx = await contract.createGame();
      setFeedback('Game creation submitted. Waiting for confirmation…');
      await tx.wait();
      setFeedback('Game created successfully.');
      await refreshGames();
    } catch (err) {
      console.error('Failed to create game', err);
      setError('Failed to create game');
    } finally {
      setIsCreating(false);
    }
  }, [getWritableContract, refreshGames]);

  const handleJoinGame = useCallback(
    async (gameId: bigint) => {
      setFeedback(null);
      setError(null);
      setJoiningGameId(gameId);

      try {
        const contract = await getWritableContract();
        const tx = await contract.joinGame(gameId);
        setFeedback('Join submitted. Awaiting confirmation…');
        await tx.wait();
        setFeedback('Joined game successfully.');
        resetRoleForGame(gameId);
        await refreshGames();
      } catch (err) {
        console.error('Failed to join game', err);
        setError('Failed to join game');
      } finally {
        setJoiningGameId(null);
      }
    },
    [getWritableContract, refreshGames, resetRoleForGame],
  );

  const handleStartGame = useCallback(
    async (gameId: bigint) => {
      setFeedback(null);
      setError(null);
      setStartingGameId(gameId);

      try {
        const contract = await getWritableContract();
        const tx = await contract.startGame(gameId);
        setFeedback('Start submitted. Waiting for confirmation…');
        await tx.wait();
        setFeedback('Roles assigned.');
        resetRoleForGame(gameId);
        await refreshGames();
      } catch (err) {
        console.error('Failed to start game', err);
        setError('Failed to start game');
      } finally {
        setStartingGameId(null);
      }
    },
    [getWritableContract, refreshGames, resetRoleForGame],
  );

  const handleRequestRoleAccess = useCallback(
    async (gameId: bigint) => {
      setFeedback(null);
      setError(null);
      setRequestingGameId(gameId);

      try {
        const contract = await getWritableContract();
        const tx = await contract.requestRoleAccess(gameId);
        setFeedback('Submitting access request…');
        await tx.wait();
        setFeedback('Role access refreshed.');
      } catch (err) {
        console.error('Failed to update role access', err);
        setError('Failed to update role access');
      } finally {
        setRequestingGameId(null);
      }
    },
    [getWritableContract],
  );

  const handleViewRole = useCallback(
    async (gameId: bigint) => {
      if (!publicClient) {
        setError('Public client is not ready');
        return;
      }

      if (!instance) {
        setError('Encryption service is not ready');
        return;
      }

      if (!address) {
        setError('Connect your wallet to decrypt roles');
        return;
      }

      if (!signerPromise) {
        setError('Wallet is not connected');
        return;
      }

      setFeedback(null);
      setError(null);
      setViewingGameId(gameId);

      try {
        const encryptedRole = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'getEncryptedRole',
          args: [gameId, address as Address],
        })) as string;

        const signer = await signerPromise;
        if (!signer) {
          throw new Error('Wallet is not connected');
        }

        const keypair = instance.generateKeypair();
        const handleContractPairs = [
          {
            handle: encryptedRole,
            contractAddress: CONTRACT_ADDRESS,
          },
        ];

        const startTimestamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = '7';
        const contractAddresses = [CONTRACT_ADDRESS];

        const eip712 = instance.createEIP712(keypair.publicKey, contractAddresses, startTimestamp, durationDays);

        const signature = await signer.signTypedData(
          eip712.domain,
          { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
          eip712.message,
        );

        const result = await instance.userDecrypt(
          handleContractPairs,
          keypair.privateKey,
          keypair.publicKey,
          signature.replace(/^0x/, ''),
          contractAddresses,
          signer.address,
          startTimestamp,
          durationDays,
        );

        const decryptedValue = Number(result[encryptedRole]);
        setRolesByGame((previous) => ({ ...previous, [gameId.toString()]: decryptedValue }));
        setFeedback('Role decrypted successfully.');
      } catch (err) {
        console.error('Failed to decrypt role', err);
        setError('Failed to decrypt role');
      } finally {
        setViewingGameId(null);
      }
    },
    [address, instance, publicClient, signerPromise],
  );

  const zamaStatus = useMemo(() => {
    if (isZamaLoading) {
      return 'Loading encryption runtime…';
    }
    if (zamaError) {
      return `Encryption service error: ${zamaError}`;
    }
    if (zamaReady) {
      return 'Encryption runtime ready.';
    }
    return null;
  }, [isZamaLoading, zamaError, zamaReady]);

  return (
    <div className="dashboard-panel">
      <div className="dashboard-actions">
        <button onClick={handleCreateGame} disabled={!isConnected || isCreating }>
          {isCreating ? 'Creating…' : 'Create Game'}
        </button>
        <button onClick={refreshGames} disabled={isRefreshing }>
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {feedback && <div className="dashboard-feedback">{feedback}</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {zamaStatus && (
        <div className={zamaError ? 'dashboard-error zama-error' : 'zama-banner'}>{zamaStatus}</div>
      )}

      {games.length === 0 ? (
        <div className="games-empty">No games yet. Create one to get started.</div>
      ) : (
        <div className="game-grid">
          {games.map((game) => (
            <GameCard
              key={game.id.toString()}
              game={game}
              currentAccount={address as Address | undefined}
              isConnected={isConnected}
              zamaReady={zamaReady}
              roleValue={rolesByGame[game.id.toString()]}
              isJoining={joiningGameId === game.id}
              isStarting={startingGameId === game.id}
              isRequesting={requestingGameId === game.id}
              isViewing={viewingGameId === game.id}
              onJoin={handleJoinGame}
              onStart={handleStartGame}
              onRequestAccess={handleRequestRoleAccess}
              onViewRole={handleViewRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}
