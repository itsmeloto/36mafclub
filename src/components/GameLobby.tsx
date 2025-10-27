import React, { useState, useEffect } from 'react';
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
  const [isModalAnimating, setIsModalAnimating] = useState(false);

  // Handle modal animation
  useEffect(() => {
    if (showDeleteConfirm !== null) {
      setIsModalAnimating(true);
    }
  }, [showDeleteConfirm]);

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
    setIsModalAnimating(false);
    setTimeout(() => setShowDeleteConfirm(null), 200); // Wait for animation to complete
  };

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
    const isVoting = gameState.votingPlayers.includes(player.id);
    const isEliminated = player.isEliminated;

    return (
      <div className={`relative smooth-transition h-full ${isEliminated ? 'opacity-60' : 'opacity-100'}`}>
        {/* Main Card - Polished design with enhanced depth */}
        <div 
          className={`h-full bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border rounded-xl smooth-transition cursor-pointer ${
            isVoting 
              ? 'border-red-500/80 shadow-red-500/40 shadow-2xl ring-2 ring-red-500/40 scale-[1.02]' 
              : 'border-white/15 hover:border-white/35 shadow-lg hover:shadow-xl hover:scale-[1.01]'
          } ${isEliminated ? 'bg-gray-800/50 cursor-not-allowed' : ''}`}
          style={{ 
            padding: 'clamp(0.4rem, 1.2vh, 0.6rem)',
            minHeight: 'clamp(55px, 7vh, 75px)',
            boxShadow: isEliminated 
              ? '0 2px 8px rgba(0,0,0,0.4)' 
              : isVoting 
                ? '0 8px 24px rgba(239, 68, 68, 0.35), 0 4px 12px rgba(0,0,0,0.5)' 
                : '0 4px 12px rgba(0,0,0,0.4)',
          }}
          onClick={() => !isEliminated && toggleVote(player.id)}
          onTouchStart={handleTouchStart(player.id, isEliminated)}
          onMouseDown={handleMouseDown(player.id, isEliminated)}
        >
          <div className="flex items-center justify-between gap-2.5">
            {/* Player Info with Role - Enhanced clarity and alignment */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              {/* Top row: Player name with inline status (Թեկնածություն) next to name */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold armenian-text whitespace-nowrap" 
                      style={{ 
                        fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)',
                        letterSpacing: '0.01em'
                      }}>
                  {armenianTexts.player} {player.id}
                </span>
                {/* Voting label displayed inline next to player name with separator */}
                {isVoting && (
                  <>
                    <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.85vw, 0.875rem)' }}>|</span>
                    <span className="text-red-400 font-bold armenian-text animate-pulse"
                          style={{ 
                            fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)',
                            textShadow: '0 0 8px rgba(248, 113, 113, 0.5)'
                          }}>
                      Թեկնածություն
                    </span>
                  </>
                )}
                {/* Eliminated label displayed inline */}
                {isEliminated && (
                  <>
                    <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.85vw, 0.875rem)' }}>|</span>
                    <span className="text-gray-400 font-bold armenian-text"
                          style={{ fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)' }}>
                      Վերացված
                    </span>
                  </>
                )}
              </div>
              {/* Bottom row: Role display with color and enhanced styling */}
              <span className={`font-semibold armenian-text ${getRoleColor(player.role)}`}
                    style={{ 
                      fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)',
                      letterSpacing: '0.015em',
                      lineHeight: '1.3'
                    }}>
                {getRoleDisplayName(player.role)}
              </span>
            </div>

            {/* Warning Controls - Enhanced visual design with better touch targets */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWarning(player.id);
                  }}
                  disabled={player.warnings === 0 || isEliminated}
                  className="touch-target bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-40 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  style={{ 
                    width: 'clamp(26px, 3.8vw, 30px)',
                    height: 'clamp(26px, 3.8vw, 30px)',
                    boxShadow: player.warnings > 0 && !isEliminated ? '0 4px 12px rgba(239, 68, 68, 0.4)' : '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                  aria-label="Նվազեցնել նախազգուշացումը"
                >
                  <Minus style={{ width: 'clamp(11px, 1.9vw, 13px)', height: 'clamp(11px, 1.9vw, 13px)' }} />
                </button>
                
                <div className="bg-gradient-to-br from-slate-700/90 to-slate-800/90 rounded-lg border border-red-500/40 shadow-inner text-center backdrop-blur-sm"
                     style={{ 
                       padding: 'clamp(0.2rem, 0.9vh, 0.35rem) clamp(0.4rem, 1.4vw, 0.6rem)',
                       minWidth: 'clamp(24px, 2.8vw, 32px)',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                     }}>
                  <span className="text-white font-bold tabular-nums" 
                        style={{ 
                          fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)',
                          textShadow: player.warnings >= 3 ? '0 0 8px rgba(239, 68, 68, 0.6)' : 'none'
                        }}>
                    {player.warnings}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addWarning(player.id);
                  }}
                  disabled={player.warnings >= 3 || isEliminated}
                  className="touch-target bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-40 rounded-full flex items-center justify-center text-white font-bold smooth-transition hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg hover:shadow-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  style={{ 
                    width: 'clamp(26px, 3.8vw, 30px)',
                    height: 'clamp(26px, 3.8vw, 30px)',
                    boxShadow: player.warnings < 3 && !isEliminated ? '0 4px 12px rgba(234, 179, 8, 0.4)' : '0 2px 6px rgba(0,0,0,0.3)'
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
      {/* Main content wrapper - Optimized for perfect vertical fit with enhanced spacing */}
      <div className="content-wrapper w-full max-w-5xl flex flex-col flex-1"
        style={{ 
          paddingTop: 'clamp(0.4rem, 0.9vh, 0.625rem)',
          paddingLeft: 'clamp(0.625rem, 1.8vw, 1rem)',
          paddingRight: 'clamp(0.625rem, 1.8vw, 1rem)',
          paddingBottom: 'clamp(3.5rem, 8vh, 5.5rem)' // Safe spacing to prevent footer overlap
        }}
      >

      {/* Header - Polished design with enhanced visual hierarchy */}
      <div className="text-center animate-slide-in-up"
           style={{ marginBottom: 'clamp(0.4rem, 0.8vh, 0.5rem)' }}>
        <h1 className="heading-gradient font-bold armenian-text drop-shadow-lg" 
            style={{ 
              fontSize: 'clamp(1rem, 3.2vw, 1.375rem)', 
              lineHeight: '1.2',
              marginBottom: 'clamp(0.2rem, 0.4vh, 0.35rem)',
              textShadow: '0 2px 12px rgba(239, 68, 68, 0.3)'
            }}>
          {armenianTexts.gameLobby}
        </h1>
        <p className="text-gray-200 font-medium armenian-text" 
           style={{ fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)' }}>
          Ընդամենը {gameState.totalPlayers} խաղացող
        </p>
      </div>

      {/* Main Game Container - Optimized vertical list with auto-scaling */}
      <div className="w-full flex flex-col flex-1 min-h-0 animate-fade-in-slow"
           style={{ gap: 'clamp(0.4rem, 0.9vh, 0.625rem)' }}>
        
        {/* Active Players Grid - Premium design with enhanced depth */}
        <div className="glass-card-light flex-1 min-h-0 flex flex-col animate-scale-in shadow-2xl"
             style={{ 
               padding: 'clamp(0.4rem, 1.2vh, 0.75rem)',
               background: 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 100%)',
               backdropFilter: 'blur(16px)',
               border: '1px solid rgba(255,255,255,0.12)'
             }}>
          <h2 className="font-bold text-white flex items-center armenian-text" 
              style={{ 
                fontSize: 'clamp(0.8125rem, 2.1vw, 1rem)',
                marginBottom: 'clamp(0.4rem, 0.9vh, 0.625rem)',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}>
            <span className="mr-2" style={{ fontSize: 'clamp(1rem, 2.4vw, 1.125rem)' }}>👥</span> 
            Ակտիվ խաղացողներ ({activePlayers.length})
          </h2>
          {/* Responsive 2-column grid: perfectly balanced for all screen sizes */}
          <div className="flex-1 min-h-0 grid auto-rows-fr"
               style={{ 
                 gap: 'clamp(0.35rem, 0.9vh, 0.5rem)',
                 gridTemplateColumns: activePlayers.length <= 5 ? '1fr' : 'repeat(2, 1fr)',
                 gridTemplateRows: `repeat(${Math.ceil(activePlayers.length / (activePlayers.length <= 5 ? 1 : 2))}, minmax(0, 1fr))`
               }}>
            {activePlayers.map((player, index) => (
              <div key={player.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.04}s` }}>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>

        {/* Timer & Controls Section - Premium design with enhanced accessibility */}
        <div className="glass-card-light shadow-2xl animate-slide-in-up"
             style={{ 
               padding: 'clamp(0.4rem, 1.2vh, 0.75rem)',
               background: 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 100%)',
               backdropFilter: 'blur(16px)',
               border: '1px solid rgba(255,255,255,0.12)'
             }}>
          <div className="flex items-center justify-between flex-wrap"
               style={{ gap: 'clamp(0.4rem, 1.4vw, 0.75rem)' }}>
            {/* Timer Display - Enhanced with icon and glow effect */}
            <div className="flex items-center"
                 style={{ gap: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
              <div className={`p-1.5 rounded-lg smooth-transition ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                  ? 'bg-red-500/20 border border-red-500/40' 
                  : 'bg-slate-700/40 border border-slate-600/40'
              }`}>
                <Clock style={{ 
                  width: 'clamp(15px, 2.4vw, 18px)', 
                  height: 'clamp(15px, 2.4vw, 18px)' 
                }} className={`smooth-transition ${
                  gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                    ? 'text-red-400' 
                    : 'text-gray-300'
                }`} />
              </div>
              <div className={`font-mono font-bold tabular-nums smooth-transition ${
                gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                  ? 'text-red-400 animate-pulse' 
                  : 'text-white'
              }`} style={{ 
                fontSize: 'clamp(1rem, 2.7vw, 1.375rem)',
                textShadow: gameState.timerSeconds <= 10 && gameState.timerSeconds > 0 
                  ? '0 0 16px rgba(248, 113, 113, 0.6)' 
                  : '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {formatTime(gameState.timerSeconds)}
              </div>
            </div>

            {/* Timer Controls with Info Button - Enhanced polish and accessibility */}
            <div className="flex items-center"
                 style={{ gap: 'clamp(0.3rem, 1vw, 0.5rem)' }}>
              <button
                onClick={startTimer}
                disabled={gameState.isTimerRunning}
                className="touch-target bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-40 text-white font-medium rounded-xl shadow-xl smooth-transition hover:scale-105 active:scale-95 disabled:hover:scale-100 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                style={{ 
                  padding: 'clamp(0.35rem, 1vh, 0.55rem) clamp(0.5rem, 1.8vw, 0.75rem)',
                  boxShadow: !gameState.isTimerRunning ? '0 4px 14px rgba(34, 197, 94, 0.35)' : '0 2px 6px rgba(0,0,0,0.3)'
                }}
                aria-label="Սկսել ժամանակաչափը"
              >
                <Play style={{ 
                  width: 'clamp(13px, 2vw, 15px)', 
                  height: 'clamp(13px, 2vw, 15px)',
                  marginRight: 'clamp(0.2rem, 0.8vw, 0.4rem)'
                }} />
                <span className="armenian-text hidden sm:inline"
                      style={{ fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)' }}>
                  {armenianTexts.startTimer}
                </span>
              </button>
              
              <button
                onClick={resetTimer}
                className="touch-target bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl shadow-xl smooth-transition hover:scale-105 active:scale-95 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                style={{ 
                  padding: 'clamp(0.35rem, 1vh, 0.55rem) clamp(0.5rem, 1.8vw, 0.75rem)',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                }}
                aria-label="Վերականգնել ժամանակաչափը"
              >
                <RotateCcw style={{ 
                  width: 'clamp(13px, 2vw, 15px)', 
                  height: 'clamp(13px, 2vw, 15px)',
                  marginRight: 'clamp(0.2rem, 0.8vw, 0.4rem)'
                }} />
                <span className="armenian-text hidden sm:inline"
                      style={{ fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)' }}>
                  {armenianTexts.resetTimer}
                </span>
              </button>

              {/* Info Button - Premium design with enhanced visibility */}
              <button
                onClick={() => setShowInfo(true)}
                className="touch-target bg-gradient-to-br from-gray-700/95 to-gray-800/95 hover:from-gray-600/95 hover:to-gray-700/95 backdrop-blur-md border border-gray-500/60 rounded-xl smooth-transition hover:scale-105 active:scale-95 shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                style={{ 
                  padding: 'clamp(0.35rem, 1vh, 0.55rem)',
                  minWidth: 'clamp(38px, 5vw, 44px)',
                  minHeight: 'clamp(38px, 5vw, 44px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(107, 114, 128, 0.35)'
                }}
                aria-label="Տեղեկատվություն"
              >
                <Info style={{ 
                  width: 'clamp(15px, 2.4vw, 18px)', 
                  height: 'clamp(15px, 2.4vw, 18px)' 
                }} className="text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
      
      {/* Navigation Footer - Premium fixed design with enhanced depth */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/98 via-black/85 to-transparent backdrop-blur-xl border-t border-white/15 shadow-2xl animate-slide-in-up z-40"
           style={{ 
             padding: 'clamp(0.5rem, 1.2vh, 0.75rem)',
             paddingBottom: 'max(clamp(0.5rem, 1.2vh, 0.75rem), env(safe-area-inset-bottom))',
             boxShadow: '0 -4px 24px rgba(0,0,0,0.5)'
           }}>
        <div className="flex justify-between items-center max-w-5xl mx-auto"
             style={{ gap: 'clamp(0.5rem, 1.8vw, 0.75rem)' }}>
          <button
            onClick={() => setGamePhase('roles')}
            className="touch-target bg-black/40 backdrop-blur-md border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-black/60 hover:border-white/30 transition-all duration-200 flex items-center armenian-text focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            style={{ 
              gap: 'clamp(0.25rem, 1vw, 0.5rem)',
              padding: 'clamp(0.35rem, 1vh, 0.5rem) clamp(0.5rem, 1.8vw, 0.75rem)'
            }}
            aria-label="Վերադառնալ դերերի բաշխում"
          >
            <ArrowLeft style={{ 
              width: 'clamp(13px, 2vw, 15px)', 
              height: 'clamp(13px, 2vw, 15px)' 
            }} />
            <span style={{ fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)' }}>{armenianTexts.back}</span>
          </button>

          <button
            onClick={endGame}
            className="relative group touch-target"
            aria-label="Ավարտել խաղը"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl blur opacity-40 group-hover:opacity-80 transition-opacity duration-300"></div>
            <span className="relative flex items-center rounded-xl shadow-xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold border border-purple-500/50"
                  style={{ 
                    fontSize: 'clamp(0.6875rem, 1.75vw, 0.8125rem)',
                    gap: 'clamp(0.2rem, 1vw, 0.4rem)',
                    padding: 'clamp(0.35rem, 1vh, 0.5rem) clamp(0.75rem, 2.8vw, 1.5rem)',
                    boxShadow: '0 4px 16px rgba(147, 51, 234, 0.4)'
                  }}>
              <span style={{ fontSize: 'clamp(0.8125rem, 2vw, 0.9375rem)' }}>🏠</span>
              {armenianTexts.endGame}
            </span>
          </button>
        </div>
      </div>

      {/* Premium Swipe-to-Remove Modal with Smooth Animations */}
      {showDeleteConfirm !== null && (
        <div 
          className={`fixed inset-0 bg-black/96 backdrop-blur-xl flex items-center justify-center z-50 p-4 transition-all duration-300 ${
            isModalAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            animation: isModalAnimating ? 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          <div 
            className={`bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-2xl border border-red-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transition-all duration-300 ${
              isModalAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
            style={{
              animation: isModalAnimating ? 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              boxShadow: '0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(239, 68, 68, 0.2)'
            }}
          >
            {/* Icon - Enhanced with animated glow effect */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-3 bg-red-500/25 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500/30 to-red-600/30 border-2 border-red-500/50 rounded-full flex items-center justify-center shadow-xl">
                  <X className="w-8 h-8 text-red-400" style={{ filter: 'drop-shadow(0 2px 8px rgba(248, 113, 113, 0.5))' }} />
                </div>
              </div>
            </div>
            
            {/* Title - Enhanced typography with shadow */}
            <h3 className="font-bold text-white mb-4 text-center armenian-text" 
                style={{ 
                  fontSize: 'clamp(1.125rem, 3.2vw, 1.375rem)', 
                  lineHeight: '1.3',
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)'
                }}>
              Հեռացնել խաղացողին
            </h3>
            
            {/* Message - Enhanced readability with better contrast */}
            <p className="text-gray-100 mb-7 text-center armenian-text leading-relaxed" 
               style={{ fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)' }}>
              Վստա՞հ եք, որ ցանկանում եք հեռացնել{' '}
              <span className="font-bold text-white bg-red-500/20 px-2 py-0.5 rounded-md">
                {armenianTexts.player} {showDeleteConfirm}
              </span>
              {'-ին:'}
            </p>
            
            {/* Buttons - Premium design with enhanced effects */}
            <div className="flex gap-4">
              <button
                onClick={handleCancelDelete}
                className="flex-1 touch-target px-5 py-3.5 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-medium rounded-xl shadow-xl smooth-transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 armenian-text border border-gray-500/50"
                style={{ 
                  fontSize: 'clamp(0.9375rem, 2.2vw, 1.0625rem)',
                  boxShadow: '0 4px 16px rgba(75, 85, 99, 0.4)'
                }}
                aria-label="Չեղարկել"
              >
                Չեղարկել
              </button>
              
              <button
                onClick={handleConfirmDelete}
                className="flex-1 touch-target px-5 py-3.5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-xl shadow-xl smooth-transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 armenian-text border border-red-500/50"
                style={{ 
                  fontSize: 'clamp(0.9375rem, 2.2vw, 1.0625rem)',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.5)'
                }}
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