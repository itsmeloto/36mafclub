import React from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';

const PlayerConfig: React.FC = () => {
  const { 
    gameState, 
    setRedPlayerCount, 
    setBlackPlayerCount, 
    initializePlayers, 
    setGamePhase 
  } = useGame();

  const handleContinue = () => {
    initializePlayers();
    setGamePhase('roles');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-900 via-black to-black">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4">
            {armenianTexts.setPlayers}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
        </div>

        {/* Configuration Card */}
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          {/* Red Players */}
          <div className="mb-8">
            <label className="block text-red-300 text-lg font-semibold mb-4">
              {armenianTexts.redPlayers}
            </label>
            <div className="flex items-center justify-between bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <button
                onClick={() => setRedPlayerCount(gameState.redPlayerCount - 1)}
                disabled={gameState.redPlayerCount <= 1}
                className="w-12 h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
              >
                −
              </button>
              <span className="text-3xl font-bold text-white px-4">
                {gameState.redPlayerCount}
              </span>
              <button
                onClick={() => setRedPlayerCount(gameState.redPlayerCount + 1)}
                disabled={gameState.redPlayerCount >= 20}
                className="w-12 h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Black Players */}
          <div className="mb-8">
            <label className="block text-gray-300 text-lg font-semibold mb-4">
              {armenianTexts.blackPlayers}
            </label>
            <div className="flex items-center justify-between bg-gray-900/30 border border-gray-500/50 rounded-xl p-4">
              <button
                onClick={() => setBlackPlayerCount(gameState.blackPlayerCount - 1)}
                disabled={gameState.blackPlayerCount <= 1}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
              >
                −
              </button>
              <span className="text-3xl font-bold text-white px-4">
                {gameState.blackPlayerCount}
              </span>
              <button
                onClick={() => setBlackPlayerCount(gameState.blackPlayerCount + 1)}
                disabled={gameState.blackPlayerCount >= 20}
                className="w-12 h-12 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Players Display */}
          <div className="text-center mb-8 p-4 bg-purple-900/30 border border-purple-500/50 rounded-xl">
            <span className="text-purple-300 text-lg">
              Ընդամենը: <span className="font-bold text-white text-2xl">{gameState.totalPlayers}</span> խաղացող
            </span>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={gameState.totalPlayers < 3}
            className="w-full relative group py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <span className="relative z-10">{armenianTexts.continue}</span>
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setGamePhase('welcome')}
            className="px-6 py-3 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200 hover:bg-black/50"
          >
            ← {armenianTexts.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerConfig;