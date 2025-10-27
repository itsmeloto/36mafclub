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
    <div className="screen-container animated-gradient-bg animate-fade-in">
      <div className="content-wrapper">
        <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in-slow">
        
        {/* Header - Improved visual hierarchy */}
        <div className="text-center mb-8 animate-slide-in-up">
          <h1 className="heading-gradient font-bold mb-4 armenian-text" 
              style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', lineHeight: '1.2' }}>
            {armenianTexts.setPlayers}
          </h1>
          {/* Decorative divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Configuration Card - Enhanced glass effect */}
        <div className="glass-card p-6 sm:p-8 animate-scale-in">
          {/* Red Players - Enhanced touch targets and visual feedback */}
          <div className="mb-8">
            <label className="block text-red-300 font-semibold mb-4 armenian-text" 
                   style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
              {armenianTexts.redPlayers}
            </label>
            <div className="flex items-center justify-between bg-red-900/30 border border-red-500/50 rounded-xl p-4 shadow-lg">
              <button
                onClick={() => setRedPlayerCount(gameState.redPlayerCount - 1)}
                disabled={gameState.redPlayerCount <= 1}
                className="touch-target w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full text-white text-2xl font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Նվազեցնել կարմիր խաղացողների քանակը"
              >
                −
              </button>
              <span className="text-3xl font-bold text-white px-4 tabular-nums">
                {gameState.redPlayerCount}
              </span>
              <button
                onClick={() => setRedPlayerCount(gameState.redPlayerCount + 1)}
                disabled={gameState.redPlayerCount >= 20}
                className="touch-target w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full text-white text-2xl font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Ավելացնել կարմիր խաղացողների քանակը"
              >
                +
              </button>
            </div>
          </div>

          {/* Black Players - Consistent styling with red section */}
          <div className="mb-8">
            <label className="block text-gray-200 font-semibold mb-4 armenian-text" 
                   style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
              {armenianTexts.blackPlayers}
            </label>
            <div className="flex items-center justify-between bg-gray-900/30 border border-gray-500/50 rounded-xl p-4 shadow-lg">
              <button
                onClick={() => setBlackPlayerCount(gameState.blackPlayerCount - 1)}
                disabled={gameState.blackPlayerCount <= 1}
                className="touch-target w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Նվազեցնել սև խաղացողների քանակը"
              >
                −
              </button>
              <span className="text-3xl font-bold text-white px-4 tabular-nums">
                {gameState.blackPlayerCount}
              </span>
              <button
                onClick={() => setBlackPlayerCount(gameState.blackPlayerCount + 1)}
                disabled={gameState.blackPlayerCount >= 20}
                className="touch-target w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 rounded-full text-white text-2xl font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Ավելացնել սև խաղացողների քանակը"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Players Display - Enhanced visual importance */}
          <div className="text-center mb-8 p-5 bg-purple-900/30 border border-purple-500/50 rounded-xl shadow-lg">
            <span className="text-purple-200 armenian-text" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
              Ընդամենը: <span className="font-bold text-white tabular-nums" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{gameState.totalPlayers}</span> խաղացող
            </span>
          </div>

          {/* Continue Button - Improved accessibility */}
          <button
            onClick={handleContinue}
            disabled={gameState.totalPlayers < 3}
            className="w-full relative group touch-target py-4 smooth-transition disabled:cursor-not-allowed"
            aria-label="Շարունակել դեպի դերերի բաշխում"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur opacity-30 group-hover:opacity-75 group-disabled:opacity-0 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl shadow-lg group-hover:scale-105 group-active:scale-95 group-disabled:hover:scale-100 group-disabled:opacity-50 transition-all duration-300 armenian-text"
                  style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)' }}>
              {armenianTexts.continue}
            </span>
          </button>
        </div>

        {/* Back Button - Consistent with design system */}
        <div className="mt-6 text-center animate-fade-in">
          <button
            onClick={() => setGamePhase('welcome')}
            className="btn-ghost armenian-text"
            aria-label="Վերադառնալ"
          >
            ← {armenianTexts.back}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerConfig;