import type { Address } from 'viem';

import { ROLE_LABELS } from '../constants/roles';

export type GameInfo = {
  id: bigint;
  creator: Address;
  started: boolean;
  playerCount: number;
  players: Address[];
};

type GameCardProps = {
  game: GameInfo;
  currentAccount?: Address;
  isConnected: boolean;
  isJoining: boolean;
  isStarting: boolean;
  isRequesting: boolean;
  isViewing: boolean;
  zamaReady: boolean;
  roleValue?: number;
  onJoin: (gameId: bigint) => Promise<void>;
  onStart: (gameId: bigint) => Promise<void>;
  onRequestAccess: (gameId: bigint) => Promise<void>;
  onViewRole: (gameId: bigint) => Promise<void>;
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

function formatAddress(value: Address): string {
  if (!value || value === ZERO_ADDRESS) {
    return 'Open slot';
  }

  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

export function GameCard({
  game,
  currentAccount,
  isConnected,
  isJoining,
  isStarting,
  isRequesting,
  isViewing,
  zamaReady,
  roleValue,
  onJoin,
  onStart,
  onRequestAccess,
  onViewRole,
}: GameCardProps) {
  const isPlayer =
    !!currentAccount && game.players.some((player) => player.toLowerCase() === currentAccount.toLowerCase());
  const canJoin = !game.started && game.playerCount < 5 && !isPlayer;
  const canStart = game.playerCount === 5 && !game.started;
  const canRequestAccess = game.started && isPlayer;
  const canViewRole = game.started && isPlayer && zamaReady;

  const statusClass = game.started ? 'game-status active' : 'game-status waiting';
  const statusLabel = game.started ? 'In Progress' : 'Waiting';

  return (
    <section className="game-card">
      <div className="game-header">
        <h2>Game #{Number(game.id)}</h2>
        <span className={statusClass}>{statusLabel}</span>
      </div>

      <div className="game-meta">
        <span>Creator · {formatAddress(game.creator)}</span>
        <span>Players · {game.playerCount}/5</span>
      </div>

      <ul className="players-list">
        {game.players.map((player, index) => {
          const isCurrent = currentAccount ? player.toLowerCase() === currentAccount.toLowerCase() : false;
          const className = [
            'player-entry',
            player === ZERO_ADDRESS ? 'empty' : '',
            isCurrent ? 'me' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li key={index} className={className}>
              <span>{formatAddress(player)}</span>
              {isCurrent && <span>you</span>}
            </li>
          );
        })}
      </ul>

      <div className="game-actions">
        <button onClick={() => onJoin(game.id)} disabled={!isConnected || !canJoin || isJoining}>
          {isJoining ? 'Joining…' : 'Join Game'}
        </button>
        <button onClick={() => onStart(game.id)} disabled={!isConnected || !canStart || isStarting}>
          {isStarting ? 'Starting…' : 'Start Game'}
        </button>
        <button onClick={() => onRequestAccess(game.id)} disabled={!isConnected || !canRequestAccess || isRequesting}>
          {isRequesting ? 'Updating…' : 'Request Role Access'}
        </button>
        <button onClick={() => onViewRole(game.id)} disabled={!isConnected || !canViewRole || isViewing}>
          {isViewing ? 'Decrypting…' : 'View My Role'}
        </button>
      </div>

      {roleValue !== undefined && (
        <div className="role-banner">
          Your role: {ROLE_LABELS[roleValue] ?? `Unknown (${roleValue})`}
        </div>
      )}
    </section>
  );
}
