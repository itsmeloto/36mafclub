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

    const handleTouchStart = (e: React.TouchEvent) => {
      if (isEliminated) return;
      const touch = e.touches[0];
      const startX = touch.clientX;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const deltaX = startX - currentX;
        
        if (deltaX > 50) { // Swipe left threshold
          setShowDeleteConfirm(player.id);
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
          setShowDeleteConfirm(player.id);
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

    const handleConfirmDelete = () => {
      eliminatePlayer(player.id);
      setShowDeleteConfirm(null);
    };

    const handleCancelDelete = () => {
      setShowDeleteConfirm(null);
    };

    return (
      <div className={`relative smooth-transition ${isEliminated ? 'opacity-50' : 'opacity-100'}`}>
        {/* Main Card - Enhanced design with better visual feedback */}
        <div 
          className={`bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border rounded-xl p-3 sm:p-4 smooth-transition cursor-pointer shadow-md hover:shadow-lg ${
            isVoting 
              ? 'border-red-500/70 shadow-red-500/30 shadow-xl ring-2 ring-red-500/30' 
              : 'border-white/10 hover:border-white/30'
          } ${isEliminated ? 'bg-gray-800/40' : ''}`}
          onClick={() => !isEliminated && toggleVote(player.id)}
          onTouchStart={handleTouchStart}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Player Info with Role - Enhanced typography and spacing */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 min-w-0 flex-1">
              <span className="text-white font-bold armenian-text" 
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
                {armenianTexts.player} {player.id}
              </span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className={`font-semibold armenian-text ${getRoleColor(player.role)}`}
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                {getRoleDisplayName(player.role)}
              </span>
              {isVoting && (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full font-bold shadow-lg animate-pulse armenian-text"
                     style={{ fontSize: 'clamp(0.75rem, 1.75vw, 0.875rem)' }}>
                  ԹԵԿՆԱՑՈՒԹՅՈՒՆ
                </div>
              )}
              {isEliminated && (
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-2.5 py-1 rounded-full font-bold armenian-text"
                     style={{ fontSize: 'clamp(0.75rem, 1.75vw, 0.875rem)' }}>
                  ՎԵՐԱՑՎԱԾ
                </div>
              )}
            </div>

            {/* Controls - Enhanced warning system with better visual feedback */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Warning System - Improved button styling and touch targets */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWarning(player.id);
                  }}
                  disabled={player.warnings === 0 || isEliminated}
                  className="touch-target w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Նվազեցնել նախազգուշացումը"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-2 sm:px-3 py-1.5 rounded-lg border border-red-500/30 shadow-inner min-w-[28px] sm:min-w-[36px] text-center">
                  <span className="text-white font-bold tabular-nums" 
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {player.warnings}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addWarning(player.id);
                  }}
                  disabled={player.warnings >= 3 || isEliminated}
                  className="touch-target w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Ավելացնել նախազգուշացում"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Delete Confirmation Modal */}
        {showDeleteConfirm === player.id && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scale-in">
              {/* Icon - Enhanced with glow effect */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-lg"></div>
                  <div className="relative w-14 h-14 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center shadow-lg">
                    <X className="w-7 h-7 text-red-400" />
                  </div>
                </div>
              </div>
              
              {/* Title - Responsive typography */}
              <h3 className="font-bold text-white mb-4 text-center armenian-text" 
                  style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', lineHeight: '1.3' }}>
                Հեռացնել խաղացողին
              </h3>
              
              {/* Message - Improved readability */}
              <p className="text-gray-200 mb-6 text-center armenian-text leading-relaxed" 
                 style={{ fontSize: 'clamp(0.9375rem, 2.5vw, 1rem)' }}>
                Հեռացնել <span className="font-bold text-white">{armenianTexts.player} {player.id}</span>-ին:
              </p>
              
              {/* Buttons - Enhanced with better touch targets */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 touch-target px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-medium rounded-xl shadow-lg smooth-transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 armenian-text"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  aria-label="Չեղարկել"
                >
                  Չեղարկել
                </button>
                
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 touch-target px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-xl shadow-lg smooth-transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 armenian-text"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  aria-label="Հեռացնել խաղացողին"
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
    <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black flex flex-col animate-fade-in">
      <div className="content-wrapper w-full max-w-4xl flex flex-col flex-1"
        style={{ 
          paddingTop: '0.75rem', 
          paddingBottom: '4.5rem' // Optimized spacing for fixed navigation
        }}
      >

      {/* Header - Enhanced with better spacing and typography */}
      <div className="text-center mb-3 sm:mb-4 animate-slide-in-up">
        <h1 className="heading-gradient font-bold mb-1 armenian-text" 
            style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', lineHeight: '1.2' }}>
          {armenianTexts.gameLobby}
        </h1>
        <p className="text-gray-200 font-medium armenian-text" 
           style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
          Ընդամենը {gameState.totalPlayers} խաղացող
        </p>
      </div>

      {/* Main Game Container - Optimized layout with smooth animations */}
      <div className="w-full flex flex-col space-y-3 flex-1 min-h-0 animate-fade-in-slow">
        
        {/* Active Players Section - Enhanced with better scrolling */}
        <div className="glass-card-light p-4 sm:p-5 flex-1 min-h-0 flex flex-col animate-scale-in">
          <h2 className="font-bold text-white mb-3 flex items-center armenian-text" 
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
            <span className="mr-2 text-xl">👥</span> Ակտիվ խաղացողներ ({activePlayers.length})
          </h2>
          {/* Scrollable player list with consistent spacing */}
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {activePlayers.map((player, index) => (
              <div key={player.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Timer Section - Enhanced button design and spacing */}
        <div className="glass-card-light p-4 sm:p-5 shadow-xl animate-slide-in-up">
          <div className="flex items-center justify-between gap-4">
            {/* Timer Display - Enhanced with better visual feedback */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className={`font-mono font-bold tabular-nums smooth-transition ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                  ? 'text-red-400 animate-pulse scale-110' 
                  : 'text-white'
              }`} style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                {formatTime(gameState.timerSeconds)}
              </div>
            </div>

            {/* Timer Controls - Enhanced buttons with better touch targets */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={startTimer}
                disabled={gameState.isTimerRunning}
                className="touch-target px-3 sm:px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-lg smooth-transition hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Սկսել ժամանակաչափը"
              >
                <Play className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm armenian-text hidden sm:inline">{armenianTexts.startTimer}</span>
              </button>
              
              <button
                onClick={resetTimer}
                className="touch-target px-3 sm:px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg smooth-transition hover:scale-105 active:scale-95 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Վերականգնել ժամանակաչափը"
              >
                <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm armenian-text hidden sm:inline">{armenianTexts.resetTimer}</span>
              </button>

              {/* Info Button - Enhanced with better styling */}
              <button
                onClick={() => setShowInfo(true)}
                className="touch-target p-2.5 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-md border border-gray-500/50 rounded-lg smooth-transition hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Տեղեկատվություն"
              >
                <Info className="w-4 h-4 text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
      
      {/* Navigation Buttons - Enhanced fixed footer with better visual hierarchy */}
      <div className="fixed bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md border-t border-white/10 shadow-2xl animate-slide-in-up">
        <div className="flex justify-between items-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => setGamePhase('roles')}
            className="touch-target btn-ghost flex items-center gap-1 sm:gap-2 armenian-text"
            aria-label="Վերադառնալ դերերի բաշխում"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>{armenianTexts.back}</span>
          </button>

          <button
            onClick={endGame}
            className="relative group touch-target"
            aria-label="Ավարտել խաղը"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-1.5 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold rounded-lg shadow-lg smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                  style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
              <span>🏠</span>
              {armenianTexts.endGame}
            </span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default GameLobby;