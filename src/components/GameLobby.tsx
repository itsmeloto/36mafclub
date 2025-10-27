import React, { useState } from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { Player } from '../types/game';
import { getRoleDisplayName, getRoleColor } from '../utils/gameLogic';
import { ArrowLeft, Play, RotateCcw, Plus, Minus, X, Info, Clock } from 'lucide-react';
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

  // Swipe gesture handlers for player removal
  const handleTouchStart = (playerId: number, isEliminated: boolean) => (e: React.TouchEvent) => {
    if (isEliminated) return;
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const deltaX = startX - currentX;
      
      if (deltaX > 50) { // Swipe left threshold
        setShowDeleteConfirm(playerId);
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

  const handleMouseDown = (playerId: number, isEliminated: boolean) => (e: React.MouseEvent) => {
    if (isEliminated) return;
    const startX = e.clientX;
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const deltaX = startX - currentX;
      
      if (deltaX > 50) { // Swipe left threshold
        setShowDeleteConfirm(playerId);
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
    if (showDeleteConfirm !== null) {
      eliminatePlayer(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
    const isVoting = gameState.votingPlayers.includes(player.id);
    const isEliminated = player.isEliminated;

    return (
      <div className={`relative smooth-transition h-full ${isEliminated ? 'opacity-50' : 'opacity-100'}`}>
        {/* Main Card - Compact design optimized to fit all 10 players on screen */}
        <div 
          className={`h-full bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border rounded-lg smooth-transition cursor-pointer shadow-md hover:shadow-lg ${
            isVoting 
              ? 'border-red-500/70 shadow-red-500/30 shadow-xl ring-2 ring-red-500/30' 
              : 'border-white/10 hover:border-white/30'
          } ${isEliminated ? 'bg-gray-800/40' : ''}`}
          style={{ 
            padding: 'clamp(0.375rem, 1.2vh, 0.625rem)', // Reduced padding for tighter fit
            minHeight: 'clamp(55px, 6.5vh, 75px)' // Slightly reduced height
          }}
          onClick={() => !isEliminated && toggleVote(player.id)}
          onTouchStart={handleTouchStart(player.id, isEliminated)}
          onMouseDown={handleMouseDown(player.id, isEliminated)}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Player Info with Role - Compact layout with inline voting label */}
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              {/* Top row: Player name with inline voting badge (Թեկնածություն) */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold armenian-text whitespace-nowrap" 
                      style={{ fontSize: 'clamp(0.8125rem, 1.9vw, 0.9375rem)' }}>
                  {armenianTexts.player} {player.id}
                </span>
                {isVoting && (
                  <>
                    <span className="text-gray-400" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>|</span>
                    <span className="text-red-400 font-bold armenian-text animate-pulse"
                          style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                      ԹԵԿՆԱԾՈՒԹՅՈՒՆ
                    </span>
                  </>
                )}
                {isEliminated && (
                  <>
                    <span className="text-gray-400" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>|</span>
                    <span className="text-gray-400 font-bold armenian-text"
                          style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                      ՎԵՐԱՑՎԱԾ
                    </span>
                  </>
                )}
              </div>
              {/* Bottom row: Role display with color */}
              <span className={`font-semibold armenian-text ${getRoleColor(player.role)}`}
                    style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                {getRoleDisplayName(player.role)}
              </span>
            </div>

            {/* Warning Controls - Compact design for space efficiency */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWarning(player.id);
                  }}
                  disabled={player.warnings === 0 || isEliminated}
                  className="touch-target bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
                  style={{ 
                    width: 'clamp(26px, 3.8vw, 30px)',
                    height: 'clamp(26px, 3.8vw, 30px)'
                  }}
                  aria-label="Նվազեցնել նախազգուշացումը"
                >
                  <Minus style={{ width: 'clamp(11px, 1.9vw, 13px)', height: 'clamp(11px, 1.9vw, 13px)' }} />
                </button>
                
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg border border-red-500/30 shadow-inner text-center"
                     style={{ 
                       padding: 'clamp(0.2rem, 0.9vh, 0.35rem) clamp(0.4rem, 1.4vw, 0.65rem)',
                       minWidth: 'clamp(22px, 2.8vw, 30px)'
                     }}>
                  <span className="text-white font-bold tabular-nums" 
                        style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                    {player.warnings}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addWarning(player.id);
                  }}
                  disabled={player.warnings >= 3 || isEliminated}
                  className="touch-target bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
                  style={{ 
                    width: 'clamp(26px, 3.8vw, 30px)',
                    height: 'clamp(26px, 3.8vw, 30px)'
                  }}
                  aria-label="Ավելացնել նախազգուշացում"
                >
                  <Plus style={{ width: 'clamp(11px, 1.9vw, 13px)', height: 'clamp(11px, 1.9vw, 13px)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="screen-container bg-gradient-to-br from-slate-900 via-red-950 to-black flex flex-col animate-fade-in">
      {/* Main content wrapper - Optimized spacing to fit all 10 players without scrolling */}
      <div className="content-wrapper w-full max-w-4xl flex flex-col flex-1"
        style={{ 
          paddingTop: 'clamp(0.4rem, 0.9vh, 0.6rem)',
          paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
          paddingRight: 'clamp(0.5rem, 2vw, 1rem)',
          paddingBottom: 'clamp(3.5rem, 8.5vh, 5.5rem)' // Safe spacing to prevent footer overlap
        }}
      >

      {/* Header - Compact design optimized for space efficiency */}
      <div className="text-center animate-slide-in-up"
           style={{ marginBottom: 'clamp(0.375rem, 0.8vh, 0.5rem)' }}>
        <h1 className="heading-gradient font-bold armenian-text" 
            style={{ 
              fontSize: 'clamp(1rem, 3.2vw, 1.375rem)', 
              lineHeight: '1.2',
              marginBottom: 'clamp(0.2rem, 0.4vh, 0.375rem)'
            }}>
          {armenianTexts.gameLobby}
        </h1>
        <p className="text-gray-200 font-medium armenian-text" 
           style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
          Ընդամենը {gameState.totalPlayers} խաղացող
        </p>
      </div>

      {/* Main Game Container - Optimized to display all 10 players without scrolling */}
      <div className="w-full flex flex-col flex-1 min-h-0 animate-fade-in-slow"
           style={{ gap: 'clamp(0.375rem, 0.8vh, 0.625rem)' }}>
        
        {/* Active Players Grid - Designed to fit all 10 players on screen simultaneously */}
        <div className="glass-card-light flex-1 min-h-0 flex flex-col animate-scale-in"
             style={{ padding: 'clamp(0.375rem, 1.2vh, 0.75rem)' }}>
          <h2 className="font-bold text-white flex items-center armenian-text" 
              style={{ 
                fontSize: 'clamp(0.8125rem, 2vw, 1rem)',
                marginBottom: 'clamp(0.375rem, 0.8vh, 0.625rem)'
              }}>
            <span className="mr-2" style={{ fontSize: 'clamp(0.9375rem, 2.3vw, 1.125rem)' }}>👥</span> 
            Ակտիվ խաղացողներ ({activePlayers.length})
          </h2>
          {/* Responsive grid: 2-column layout for efficient use of screen space, ensuring 10 players visible */}
          <div className="flex-1 min-h-0 grid auto-rows-fr"
               style={{ 
                 gap: 'clamp(0.3rem, 0.8vh, 0.5rem)',
                 gridTemplateColumns: activePlayers.length <= 5 ? '1fr' : 'repeat(2, 1fr)',
                 gridTemplateRows: `repeat(${Math.ceil(activePlayers.length / (activePlayers.length <= 5 ? 1 : 2))}, minmax(0, 1fr))`
               }}>
            {activePlayers.map((player, index) => (
              <div key={player.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Timer & Controls Section - Compact, always-visible design with Info button */}
        <div className="glass-card-light shadow-xl animate-slide-in-up"
             style={{ padding: 'clamp(0.375rem, 1.2vh, 0.75rem)' }}>
          <div className="flex items-center justify-between flex-wrap"
               style={{ gap: 'clamp(0.375rem, 1.5vw, 0.75rem)' }}>
            {/* Timer Display - Enhanced visibility with icon */}
            <div className="flex items-center"
                 style={{ gap: 'clamp(0.3rem, 0.9vw, 0.5rem)' }}>
              <Clock style={{ 
                width: 'clamp(15px, 2.3vw, 18px)', 
                height: 'clamp(15px, 2.3vw, 18px)' 
              }} className="text-gray-400" />
              <div className={`font-mono font-bold tabular-nums smooth-transition ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                  ? 'text-red-400 animate-pulse scale-110' 
                  : 'text-white'
              }`} style={{ fontSize: 'clamp(1rem, 2.6vw, 1.375rem)' }}>
                {formatTime(gameState.timerSeconds)}
              </div>
            </div>

            {/* Timer Controls with Info Button - All accessible and touch-friendly */}
            <div className="flex items-center"
                 style={{ gap: 'clamp(0.3rem, 0.9vw, 0.5rem)' }}>
              <button
                onClick={startTimer}
                disabled={gameState.isTimerRunning}
                className="touch-target bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-lg smooth-transition hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ 
                  padding: 'clamp(0.35rem, 0.9vh, 0.55rem) clamp(0.45rem, 1.8vw, 0.7rem)'
                }}
                aria-label="Սկսել ժամանակաչափը"
              >
                <Play style={{ 
                  width: 'clamp(13px, 1.9vw, 15px)', 
                  height: 'clamp(13px, 1.9vw, 15px)',
                  marginRight: 'clamp(0.2rem, 0.8vw, 0.4rem)'
                }} />
                <span className="armenian-text hidden sm:inline"
                      style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                  {armenianTexts.startTimer}
                </span>
              </button>
              
              <button
                onClick={resetTimer}
                className="touch-target bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg smooth-transition hover:scale-105 active:scale-95 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ 
                  padding: 'clamp(0.35rem, 0.9vh, 0.55rem) clamp(0.45rem, 1.8vw, 0.7rem)'
                }}
                aria-label="Վերականգնել ժամանակաչափը"
              >
                <RotateCcw style={{ 
                  width: 'clamp(13px, 1.9vw, 15px)', 
                  height: 'clamp(13px, 1.9vw, 15px)',
                  marginRight: 'clamp(0.2rem, 0.8vw, 0.4rem)'
                }} />
                <span className="armenian-text hidden sm:inline"
                      style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>
                  {armenianTexts.resetTimer}
                </span>
              </button>

              {/* Info Button - Clearly visible and accessible */}
              <button
                onClick={() => setShowInfo(true)}
                className="touch-target bg-gray-700/90 hover:bg-gray-600/90 backdrop-blur-md border border-gray-500/50 rounded-lg smooth-transition hover:scale-105 active:scale-95 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ 
                  padding: 'clamp(0.35rem, 0.9vh, 0.55rem)',
                  minWidth: 'clamp(38px, 5vw, 44px)',
                  minHeight: 'clamp(38px, 5vw, 44px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Տեղեկատվություն"
              >
                <Info style={{ 
                  width: 'clamp(15px, 2.3vw, 18px)', 
                  height: 'clamp(15px, 2.3vw, 18px)' 
                }} className="text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
      
      {/* Navigation Footer - Fixed position with safe spacing to avoid overlap */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-md border-t border-white/10 shadow-2xl animate-slide-in-up z-40"
           style={{ 
             padding: 'clamp(0.5rem, 1.2vh, 0.75rem)',
             paddingBottom: 'max(clamp(0.5rem, 1.2vh, 0.75rem), env(safe-area-inset-bottom))'
           }}>
        <div className="flex justify-between items-center max-w-4xl mx-auto"
             style={{ gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
          <button
            onClick={() => setGamePhase('roles')}
            className="touch-target btn-ghost flex items-center armenian-text"
            style={{ gap: 'clamp(0.25rem, 1vw, 0.5rem)' }}
            aria-label="Վերադառնալ դերերի բաշխում"
          >
            <ArrowLeft style={{ 
              width: 'clamp(13px, 1.9vw, 15px)', 
              height: 'clamp(13px, 1.9vw, 15px)' 
            }} />
            <span style={{ fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)' }}>{armenianTexts.back}</span>
          </button>

          <button
            onClick={endGame}
            className="relative group touch-target"
            aria-label="Ավարտել խաղը"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
            <span className="relative flex items-center rounded-lg shadow-lg smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold"
                  style={{ 
                    fontSize: 'clamp(0.6875rem, 1.7vw, 0.8125rem)',
                    gap: 'clamp(0.2rem, 0.9vw, 0.35rem)',
                    padding: 'clamp(0.35rem, 0.9vh, 0.5rem) clamp(0.7rem, 2.8vw, 1.4rem)'
                  }}>
              <span style={{ fontSize: 'clamp(0.8125rem, 1.9vw, 0.9375rem)' }}>🏠</span>
              {armenianTexts.endGame}
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Centered Overlay Modal for Player Removal Confirmation */}
      {showDeleteConfirm !== null && (
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
              Հեռացնել <span className="font-bold text-white">{armenianTexts.player} {showDeleteConfirm}</span>-ին:
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

      {/* Info Modal */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default GameLobby;