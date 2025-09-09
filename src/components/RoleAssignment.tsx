import React from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { getRoleDisplayName, getRoleColor } from '../utils/gameLogic';

const RoleAssignment: React.FC = () => {
  const { 
    gameState, 
    revealRole, 
    closeRole, 
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

  const handleCloseRole = () => {
    if (currentPlayer) {
      closeRole(currentPlayer.id);
    }
  };

  const handleNextPlayer = () => {
    if (currentPlayer) {
      closeRole(currentPlayer.id); // Auto-close current role
    }
    
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
      <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black">
        <div className="content-wrapper">
          <div className="text-center space-y-6 sm:space-y-8 bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12 max-w-md w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Բոլոր դերերը բացահայտված են
            </h2>
            <button
              onClick={handleStartGame}
              className="relative group px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 w-full max-w-xs"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <span className="relative z-10">{armenianTexts.startGame}</span>
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
    <div className="screen-container relative bg-gradient-to-br from-slate-900 via-red-950 to-black">
      {/* Pass Device Instructions */}
      {gameState.currentPlayerIndex > 0 && (
        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="bg-black/30 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/20">
            <p className="text-white text-sm sm:text-base md:text-lg font-medium">
              {armenianTexts.passDeviceTo} {armenianTexts.player} {currentPlayer.id}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12 max-w-md w-full">
          {/* Current Player Display */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center animate-fade-in">
            {armenianTexts.player} {currentPlayer.id}
          </h2>

          {/* View/Close Role Button */}
          <button
            onClick={currentPlayer.hasViewedRole ? handleCloseRole : handleViewRole}
            className="relative group px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 w-full max-w-xs"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <span className="relative z-10">
              {currentPlayer.hasViewedRole ? armenianTexts.closeRole : armenianTexts.viewRole}
            </span>
          </button>

        {/* Role Display */}
        {currentPlayer.hasViewedRole && (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center">
              <div className={`text-3xl font-black drop-shadow-lg ${getRoleColor(currentPlayer.role)}`}>
                {getRoleDisplayName(currentPlayer.role)}
              </div>
              <RoleAnimation role={currentPlayer.role} />
            </div>
          </div>
        )}

          {/* Next Player / Start Button */}
          {currentPlayer.hasViewedRole && (
            <button
              onClick={handleNextPlayer}
              className="relative group px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-base sm:text-lg font-bold rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 w-full max-w-xs"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <span className="relative z-10">
                {isLastPlayer ? armenianTexts.startGame : armenianTexts.nextPlayer}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => setGamePhase('config')}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 px-4 sm:px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 text-sm sm:text-base"
      >
        ← {armenianTexts.back}
      </button>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 bg-black/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-white/10">
        <span className="text-gray-300 text-sm sm:text-base">
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