import React from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { getRoleDisplayName, getRoleColor } from '../utils/gameLogic';

const RoleAssignment: React.FC = () => {
  const { 
    gameState, 
    revealRole, 
    nextPlayer, 
    setGamePhase 
  } = useGame();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isLastPlayer = gameState.currentPlayerIndex === gameState.totalPlayers - 1;

  const handleViewRole = () => {
    if (currentPlayer) {
      revealRole(currentPlayer.id);
    }
  };

  const handleNextPlayer = () => {
    if (isLastPlayer) {
      setGamePhase('handoff');
    } else {
      nextPlayer();
    }
  };

  const handleStartGame = () => {
    setGamePhase('handoff');
  };

  const RoleAnimation: React.FC<{ role: string }> = ({ role }) => {
    const getAnimationContent = () => {
      switch (role) {
        case 'sheriff':
          return (
            <div className="flex items-center justify-center animate-bounce">
              <div className="text-4xl mr-4 animate-pulse">🛡️</div>
            </div>
          );
        case 'black':
          return (
            <div className="flex items-center justify-center animate-bounce">
              <div className="text-4xl mr-4 animate-pulse">🔫</div>
            </div>
          );
        case 'don':
          return (
            <div className="flex items-center justify-center">
              <div 
                className="text-4xl animate-pulse"
                style={{
                  animation: 'sway 2s ease-in-out infinite'
                }}
              >
                🃏
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="inline-flex items-center ml-4">
        {getAnimationContent()}
      </div>
    );
  };

  if (gameState.allRolesRevealed) {
    return (
      <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black animate-fade-in">
        <div className="content-wrapper">
          <div className="glass-card text-center space-y-8 p-8 sm:p-10 md:p-12 max-w-md w-full animate-scale-in">
            <h2 className="font-bold text-white armenian-text" 
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: '1.3' }}>
              Բոլոր դերերը բացահայտված են
            </h2>
            <button
              onClick={handleStartGame}
              className="relative group w-full max-w-xs mx-auto touch-target"
              aria-label="Սկսել խաղը"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-2xl shadow-2xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}>
                {armenianTexts.startGame}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black">
        <div className="content-wrapper">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container relative bg-gradient-to-br from-slate-900 via-red-950 to-black animate-fade-in">
      {/* Pass Device Instructions - Enhanced visibility */}
      {gameState.currentPlayerIndex > 0 && (
        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 text-center z-10 animate-slide-in-up px-4">
          <div className="glass-card-light px-4 sm:px-6 py-2 sm:py-3">
            <p className="text-white font-medium armenian-text" 
               style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
              {armenianTexts.passDeviceTo} {armenianTexts.player} {currentPlayer.id}
            </p>
          </div>
        </div>
      )}

      {/* Main Content - Improved spacing and animations */}
      <div className="content-wrapper">
        <div className="glass-card flex flex-col items-center space-y-8 p-8 sm:p-10 md:p-12 max-w-md w-full animate-scale-in">
          
          {/* Current Player Display - Enhanced typography */}
          <h2 className="font-bold text-white text-center animate-fade-in armenian-text" 
              style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: '1.2' }}>
            {armenianTexts.player} {currentPlayer.id}
          </h2>

          {/* View Role Button - Improved accessibility */}
          {!currentPlayer.hasViewedRole && (
            <button
              onClick={handleViewRole}
              className="relative group w-full max-w-xs touch-target animate-fade-in"
              aria-label="Դիտել դերը"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl shadow-2xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}>
                {armenianTexts.viewRole}
              </span>
            </button>
          )}

          {/* Role Display - Enhanced animation and sizing */}
          {currentPlayer.hasViewedRole && (
            <div className="text-center space-y-4 animate-scale-in">
              <div className="flex items-center justify-center">
                <div className={`font-black drop-shadow-2xl ${getRoleColor(currentPlayer.role)} armenian-text`}
                     style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
                  {getRoleDisplayName(currentPlayer.role)}
                </div>
                <RoleAnimation role={currentPlayer.role} />
              </div>
            </div>
          )}

          {/* Next Player / Start Button - Consistent styling */}
          {currentPlayer.hasViewedRole && (
            <button
              onClick={handleNextPlayer}
              className="relative group w-full max-w-xs touch-target animate-fade-in"
              aria-label={isLastPlayer ? "Սկսել խաղը" : "Հաջորդ խաղացող"}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
                {isLastPlayer ? armenianTexts.startGame : armenianTexts.nextPlayer}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Back Button - Improved positioning and styling */}
      <button
        onClick={() => setGamePhase('config')}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 btn-ghost armenian-text animate-fade-in"
        aria-label="Վերադառնալ կարգավորումներ"
      >
        ← {armenianTexts.back}
      </button>

      {/* Progress Indicator - Enhanced readability */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 glass-card-light px-4 py-2 animate-fade-in">
        <span className="text-gray-200 font-medium tabular-nums" 
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          {gameState.currentPlayerIndex + 1} / {gameState.totalPlayers}
        </span>
      </div>

      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default RoleAssignment;