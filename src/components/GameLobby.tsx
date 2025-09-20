import React, { useState } from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { Player } from '../types/game';
import { getRoleDisplayName, getRoleColor } from '../utils/gameLogic';
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Minus, X, Info, Clock } from 'lucide-react';
import InfoModal from './InfoModal';

const GameLobby: React.FC = () => {
  const { 
    gameState, 
    toggleVote, 
    addWarning, 
    removeWarning, 
    eliminatePlayer,
    startTimer, 
    stopTimer,
    resetTimer,
    setGamePhase,
    endGame
  } = useGame();

  const [showInfo, setShowInfo] = useState(false);
  const [swipedPlayerId, setSwipedPlayerId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activePlayers = gameState.players.filter(player => !player.isEliminated);

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
    const isVoting = gameState.votingPlayers.includes(player.id);
    const isEliminated = player.isEliminated;
    const isSwipedOut = swipedPlayerId === player.id;

    const handleTouchStart = (e: React.TouchEvent) => {
      if (isEliminated) return;
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const deltaX = startX - currentX;
        
        if (deltaX > 50) { // Swipe left threshold
          setSwipedPlayerId(player.id);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        }
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (isEliminated) return;
      const startX = e.clientX;
      
      const handleMouseMove = (e: MouseEvent) => {
        const currentX = e.clientX;
        const deltaX = startX - currentX;
        
        if (deltaX > 50) { // Swipe left threshold
          setSwipedPlayerId(player.id);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleDeleteClick = () => {
      setShowDeleteConfirm(player.id);
    };

    const handleConfirmDelete = () => {
      eliminatePlayer(player.id);
      setShowDeleteConfirm(null);
      setSwipedPlayerId(null);
    };

    const handleCancelDelete = () => {
      setShowDeleteConfirm(null);
      setSwipedPlayerId(null);
    };

    return (
      <div className={`relative transition-all duration-300 ${isEliminated ? 'opacity-50' : ''} overflow-hidden`}>
        {/* Delete Button Background */}
        <div className={`absolute inset-0 bg-red-600 flex items-center justify-end pr-4 transition-all duration-300 ${
          isSwipedOut ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <button
            onClick={handleDeleteClick}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold transition-colors armenian-text"
          >
            Հեռացնել
          </button>
        </div>

        {/* Main Card */}
        <div 
          className={`bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border rounded-lg sm:rounded-xl p-2 sm:p-4 mb-1 sm:mb-3 transition-all duration-300 hover:border-white/30 cursor-pointer relative ${
            isVoting ? 'border-red-500/70 shadow-red-500/20 shadow-lg' : 'border-white/10'
          } ${isEliminated ? 'bg-gray-800/30' : ''} ${
            isSwipedOut ? '-translate-x-20' : 'translate-x-0'
          }`}
          onClick={() => !isEliminated && !isSwipedOut && toggleVote(player.id)}
          onTouchStart={handleTouchStart}
          onMouseDown={handleMouseDown}
        >
          {/* Reset swipe on tap */}
          {isSwipedOut && (
            <div 
              className="absolute inset-0 bg-transparent z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSwipedPlayerId(null);
              }}
            />
          )}

          <div className="flex items-center justify-between">
            {/* Player Info with Role */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-white font-bold text-sm sm:text-lg armenian-text">
                  {armenianTexts.player} {player.id}
                </span>
                <span className="text-gray-400 hidden sm:inline">|</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className={`font-semibold text-xs sm:text-base armenian-text ${getRoleColor(player.role)}`}>
                  {getRoleDisplayName(player.role)}
                </span>
                {isVoting && (
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold shadow-lg animate-pulse armenian-text">
                    ՔՎԵԱՐԿՈՒԹՅՈՒՆ
                  </div>
                )}
                {isEliminated && (
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold armenian-text">
                    ՎԵՐԱՑՎԱԾ
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              {/* Warning System */}
              <div className="flex items-center space-x-0.5 sm:space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWarning(player.id);
                  }}
                  disabled={player.warnings === 0 || isEliminated}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                </button>
                
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-red-500/30 shadow-inner min-w-[24px] sm:min-w-[40px] text-center">
                  <span className="text-white font-bold text-xs sm:text-base">
                    {player.warnings}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addWarning(player.id);
                  }}
                  disabled={player.warnings >= 3 || isEliminated}
                  className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm === player.id && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 text-center armenian-text">
                Հաստատել հեռացումը
              </h3>
              <p className="text-gray-300 mb-6 text-center armenian-text">
                Իսկապե՞ս ուզում եք հեռացնել {armenianTexts.player} {player.id}-ին:
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors armenian-text"
                >
                  Չեղարկել
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors armenian-text"
                >
                  Հեռացնել
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black">
      <div className="content-wrapper w-full max-w-4xl"
        style={{ 
          paddingTop: '1rem', 
          paddingBottom: '6rem' // Extra padding for fixed navigation
        }}
      >
      {/* Info Button - Fixed to top right with safe area support */}
      <button
        onClick={() => setShowInfo(true)}
        className="fixed z-50 p-2 sm:p-3 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-md border border-gray-600/50 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl"
        style={{
          top: 'max(env(safe-area-inset-top, 0px) + 1rem, 1rem)',
          right: 'max(env(safe-area-inset-right, 0px) + 1rem, 1rem)'
        }}
      >
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200" />
      </button>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        
        <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-1 sm:mb-2 armenian-text">
          {armenianTexts.gameLobby}
        </h1>
        <p className="text-gray-300 text-xs sm:text-base armenian-text">
          Ընդամենը {gameState.totalPlayers} խաղացող
        </p>
      </div>

      {/* Main Game Container */}
      <div className="w-full space-y-3 sm:space-y-6">
        {/* Active Players */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
          <h2 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-4 flex items-center armenian-text">
            <span className="mr-1 sm:mr-2">👥</span> Ակտիվ Խաղացողներ ({activePlayers.length})
          </h2>
          <div className="max-h-60 sm:max-h-96 overflow-y-auto space-y-1 sm:space-y-2 pr-1 sm:pr-2">
            {activePlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>


        {/* Timer Section */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center armenian-text">
              <Clock className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Ժամանակաչափ (1 րոպե)
            </h2>
            
            {/* Timer Display */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className={`text-2xl sm:text-5xl font-mono font-bold transition-all duration-300 ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 ? 'text-red-400 animate-pulse scale-110' : 'text-white'
              }`}>
                {formatTime(gameState.timerSeconds)}
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <button
              onClick={startTimer}
              disabled={gameState.isTimerRunning}
              className="flex-1 sm:flex-none relative group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 rounded-lg sm:rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-base armenian-text">{armenianTexts.startTimer}</span>
              </span>
            </button>
            
            <button
              onClick={resetTimer}
              className="flex-1 sm:flex-none relative group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg sm:rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-base armenian-text">{armenianTexts.resetTimer}</span>
              </span>
            </button>
          </div>

          {/* Timer Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-3 shadow-inner">
            <div 
              className={`h-1.5 sm:h-3 rounded-full transition-all duration-1000 shadow-lg ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.max(0, (gameState.timerSeconds / 60) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      </div>
      
      {/* Navigation Buttons - Fixed at bottom for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={() => setGamePhase('roles')}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl text-gray-300 hover:text-white transition-all duration-200 hover:bg-black/70 flex items-center"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-base armenian-text">{armenianTexts.back}</span>
          </button>

          <button
            onClick={endGame}
            className="relative group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg sm:rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
            <span className="relative z-10 text-xs sm:text-base armenian-text">🏠 {armenianTexts.endGame}</span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default GameLobby;