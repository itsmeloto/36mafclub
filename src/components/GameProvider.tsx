import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameState, GameContextType, Player, GameSession } from '../types/game';
import { createPlayers, generateSessionId, saveSession } from '../utils/gameLogic';

const initialGameState: GameState = {
  sessionId: '',
  redPlayerCount: 7,
  blackPlayerCount: 3,
  totalPlayers: 10,
  players: [],
  currentPlayerIndex: 0,
  gamePhase: 'welcome',
  allRolesRevealed: false,
  timerSeconds: 60,
  isTimerRunning: false,
  votingPlayers: []
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...initialGameState,
    sessionId: generateSessionId()
  }));

  // Initialize new game session
  const initializeNewGame = useCallback(() => {
    const newSessionId = generateSessionId();
    // Create fresh randomized players immediately to persist the assignment
    const players = createPlayers(initialGameState.redPlayerCount, initialGameState.blackPlayerCount);
    const session: GameSession = {
      id: newSessionId,
      createdAt: Date.now(),
      redPlayerCount: initialGameState.redPlayerCount,
      blackPlayerCount: initialGameState.blackPlayerCount,
      totalPlayers: initialGameState.redPlayerCount + initialGameState.blackPlayerCount,
      players: players.map((p) => ({ id: p.id, role: p.role, isEliminated: false }))
    };
    saveSession(session);

    setGameState({
      ...initialGameState,
      sessionId: newSessionId,
      players,
    });
  }, []);

  const endGame = useCallback(() => {
    try {
      const session: GameSession = {
        id: gameState.sessionId,
        createdAt: Date.now(),
        endedAt: Date.now(),
        redPlayerCount: gameState.redPlayerCount,
        blackPlayerCount: gameState.blackPlayerCount,
        totalPlayers: gameState.totalPlayers,
        players: gameState.players.map((p) => ({ id: p.id, role: p.role, isEliminated: p.isEliminated }))
      };
      saveSession(session);
    } catch {}
    setGameState((prev) => ({ ...prev, gamePhase: 'welcome' }));
  }, [gameState.blackPlayerCount, gameState.players, gameState.redPlayerCount, gameState.sessionId, gameState.totalPlayers]);

  const setRedPlayerCount = useCallback((count: number) => {
    setGameState(prev => ({
      ...prev,
      redPlayerCount: Math.max(1, Math.min(20, count)),
      totalPlayers: Math.max(1, Math.min(20, count)) + prev.blackPlayerCount
    }));
  }, []);

  const setBlackPlayerCount = useCallback((count: number) => {
    setGameState(prev => ({
      ...prev,
      blackPlayerCount: Math.max(1, Math.min(20, count)),
      totalPlayers: prev.redPlayerCount + Math.max(1, Math.min(20, count))
    }));
  }, []);

  const initializePlayers = useCallback(() => {
    const players = createPlayers(gameState.redPlayerCount, gameState.blackPlayerCount);
    // mark session started
    try {
      const session: GameSession = {
        id: gameState.sessionId,
        createdAt: Date.now(),
        startedAt: Date.now(),
        redPlayerCount: gameState.redPlayerCount,
        blackPlayerCount: gameState.blackPlayerCount,
        totalPlayers: gameState.totalPlayers,
        players: players.map((p) => ({ id: p.id, role: p.role, isEliminated: false }))
      };
      saveSession(session);
    } catch {}

    setGameState(prev => ({
      ...prev,
      players,
      currentPlayerIndex: 0,
      allRolesRevealed: false,
      votingPlayers: []
    }));
  }, [gameState.blackPlayerCount, gameState.redPlayerCount, gameState.sessionId, gameState.totalPlayers]);

  const revealRole = useCallback((playerId: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId ? { ...player, hasViewedRole: true } : player
      )
    }));
  }, []);

  const closeRole = useCallback((playerId: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId ? { ...player, hasViewedRole: false } : player
      )
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentPlayerIndex + 1;
      const allRevealed = nextIndex >= prev.totalPlayers;
      
      return {
        ...prev,
        currentPlayerIndex: allRevealed ? prev.currentPlayerIndex : nextIndex,
        allRolesRevealed: allRevealed
      };
    });
  }, []);

  const toggleVote = useCallback((playerId: number) => {
    setGameState(prev => {
      const isCurrentlyVoting = prev.votingPlayers.includes(playerId);
      const newVotingPlayers = isCurrentlyVoting
        ? prev.votingPlayers.filter(id => id !== playerId)
        : [...prev.votingPlayers, playerId];

      return {
        ...prev,
        votingPlayers: newVotingPlayers,
        players: prev.players.map(player => {
          if (player.id === playerId) {
            return { 
              ...player, 
              isVoted: !player.isVoted
            };
          }
          return player;
        })
      };
    });
  }, []);

  const addWarning = useCallback((playerId: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId && player.warnings < 3
          ? { ...player, warnings: player.warnings + 1 }
          : player
      )
    }));
  }, []);

  const removeWarning = useCallback((playerId: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId && player.warnings > 0
          ? { ...player, warnings: player.warnings - 1 }
          : player
      )
    }));
  }, []);

  const eliminatePlayer = useCallback((playerId: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId
          ? { ...player, isEliminated: true, isVoted: false, warnings: 0 }
          : player
      ),
      votingPlayers: prev.votingPlayers.filter(id => id !== playerId)
    }));
  }, []);

  const startTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timerSeconds: 60,
      isTimerRunning: true
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isTimerRunning: false
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timerSeconds: 60,
      isTimerRunning: false
    }));
  }, []);

  const setGamePhase = useCallback((phase: GameState['gamePhase']) => {
    setGameState(prev => ({ ...prev, gamePhase: phase }));
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isTimerRunning && gameState.timerSeconds > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timerSeconds: prev.timerSeconds - 1
        }));
      }, 1000);
    } else if (gameState.timerSeconds === 0) {
      setGameState(prev => ({ ...prev, isTimerRunning: false }));
    }

    return () => clearInterval(interval);
  }, [gameState.isTimerRunning, gameState.timerSeconds]);

  const contextValue: GameContextType = {
    gameState,
    setRedPlayerCount,
    setBlackPlayerCount,
    initializePlayers,
    revealRole,
    closeRole,
    nextPlayer,
    toggleVote,
    addWarning,
    removeWarning,
    eliminatePlayer,
    startTimer,
    stopTimer,
    resetTimer,
    setGamePhase,
    initializeNewGame,
    endGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};