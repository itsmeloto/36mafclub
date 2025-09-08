export interface Player {
  id: number;
  role: PlayerRole;
  isVoted: boolean;
  warnings: number;
  hasViewedRole: boolean;
  isEliminated: boolean;
}

export type PlayerRole = 'red' | 'sheriff' | 'black' | 'don';

export interface GameState {
  sessionId: string;
  redPlayerCount: number;
  blackPlayerCount: number;
  totalPlayers: number;
  players: Player[];
  currentPlayerIndex: number;
  gamePhase: 'welcome' | 'config' | 'roles' | 'game' | 'handoff';
  allRolesRevealed: boolean;
  timerSeconds: number;
  isTimerRunning: boolean;
  votingPlayers: number[];
}

export interface GameContextType {
  gameState: GameState;
  setRedPlayerCount: (count: number) => void;
  setBlackPlayerCount: (count: number) => void;
  initializePlayers: () => void;
  revealRole: (playerId: number) => void;
  closeRole: (playerId: number) => void;
  nextPlayer: () => void;
  toggleVote: (playerId: number) => void;
  addWarning: (playerId: number) => void;
  removeWarning: (playerId: number) => void;
  eliminatePlayer: (playerId: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setGamePhase: (phase: GameState['gamePhase']) => void;
  initializeNewGame: () => void;
  endGame: () => void;
}

export interface GameSession {
  id: string;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  redPlayerCount: number;
  blackPlayerCount: number;
  totalPlayers: number;
  players: Array<Pick<Player, 'id' | 'role' | 'isEliminated'>>;
}

export const MAX_WARNINGS = 10;