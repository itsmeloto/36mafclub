import { Player, PlayerRole, GameSession } from '../types/game';

// Generate a truly random session ID for each game
export const generateSessionId = (): string => {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Crypto-safe shuffle when available; fallback to Math.random Fisher-Yates
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    // Durstenfeld shuffle using crypto randomness
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randArray = new Uint32Array(1);
      crypto.getRandomValues(randArray);
      const j = randArray[0] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  // Fallback
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateRandomRoles = (redCount: number, blackCount: number): PlayerRole[] => {
  const roles: PlayerRole[] = [];
  
  // Add black team roles
  if (blackCount > 0) {
    roles.push('don'); // First black player is Don
    for (let i = 1; i < blackCount; i++) {
      roles.push('black'); // Rest are regular mafia
    }
  }
  
  // Add red team roles (civilians)
  if (redCount > 0) {
    roles.push('sheriff'); // One sheriff
    
    // Fill remaining with regular red players (civilians)
    for (let i = 1; i < redCount; i++) {
      roles.push('red');
    }
  }
  
  // Shuffle only the roles array for randomization
  return shuffleArray(roles);
};

export const createPlayers = (redCount: number, blackCount: number): Player[] => {
  const totalPlayers = redCount + blackCount;
  const roles = generateRandomRoles(redCount, blackCount);
  
  // Create players in order (1, 2, 3, ...) but assign shuffled roles
  const players = Array.from({ length: totalPlayers }, (_, index) => ({
    id: index + 1,
    role: roles[index],
    isVoted: false,
    warnings: 0,
    hasViewedRole: false,
    isEliminated: false
  }));
  
  // Return players in order (no shuffling of player array)
  return players;
};

export const getRoleDisplayName = (role: PlayerRole): string => {
  const roleNames = {
    red: 'Կարմիր Խաղացող',
    sheriff: 'Շերիֆ',
    black: 'Սև Խաղացող',
    don: 'Դոն'
  };
  return roleNames[role];
};

export const getRoleColor = (role: PlayerRole): string => {
  const roleColors = {
    red: 'text-red-300',
    sheriff: 'text-blue-400',
    black: 'text-gray-300',
    don: 'text-gray-500'
  };
  return roleColors[role];
};

export const getRoleBackground = (role: PlayerRole): string => {
  const roleBackgrounds = {
    red: 'bg-red-800/30 border-red-500/50',
    sheriff: 'bg-blue-900/30 border-blue-500/50',
    black: 'bg-gray-800/30 border-gray-400/50',
    don: 'bg-red-900/30 border-red-500/50'
  };
  return roleBackgrounds[role];
};

// --- Local session storage helpers ---
const SESSIONS_KEY = 'mafia:sessions';

export const saveSession = (session: GameSession) => {
  try {
    const existing = localStorage.getItem(SESSIONS_KEY);
    const sessions: GameSession[] = existing ? JSON.parse(existing) : [];
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) sessions[idx] = session; else sessions.unshift(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {}
};

export const getSessions = (): GameSession[] => {
  try {
    const existing = localStorage.getItem(SESSIONS_KEY);
    return existing ? (JSON.parse(existing) as GameSession[]) : [];
  } catch {
    return [];
  }
};

export const getSessionById = (id: string): GameSession | undefined => {
  return getSessions().find((s) => s.id === id);
};