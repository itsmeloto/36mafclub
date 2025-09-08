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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activePlayers = gameState.players.filter(player => !player.isEliminated);
  const eliminatedPlayers = gameState.players.filter(player => player.isEliminated);

  const PlayerCard: React.FC<{ player: Player }> = ({ player }) => {
    const isVoting = gameState.votingPlayers.includes(player.id);
    const isEliminated = player.isEliminated;

    return (
      <div className={`relative transition-all duration-300 ${isEliminated ? 'opacity-50' : ''}`}>
        <div 
          className={`bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border rounded-lg sm:rounded-xl p-2 sm:p-4 mb-1 sm:mb-3 transition-all duration-300 hover:border-white/30 cursor-pointer ${
            isVoting ? 'border-red-500/70 shadow-red-500/20 shadow-lg' : 'border-white/10'
          } ${isEliminated ? 'bg-gray-800/30' : ''}`}
          onClick={() => !isEliminated && toggleVote(player.id)}
        >
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

              {/* Eliminate Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  eliminatePlayer(player.id);
                }}
                disabled={isEliminated}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100 shadow-lg"
              >
                <X className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-2 sm:p-6 bg-gradient-to-br from-slate-900 via-red-950 to-black">
      {/* Header with Info Button */}
      <div className="relative text-center mb-4 sm:mb-8">
        <button
          onClick={() => setShowInfo(true)}
          className="absolute top-0 right-0 p-1.5 sm:p-3 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Info className="w-3 h-3 sm:w-5 sm:h-5 text-gray-300" />
        </button>
        
        <h1 className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-1 sm:mb-2 armenian-text">
          {armenianTexts.gameLobby}
        </h1>
        <p className="text-gray-300 text-xs sm:text-base armenian-text">
          Ընդամենը {gameState.totalPlayers} խաղացող
        </p>
      </div>

      {/* Main Game Container */}
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6 pb-20 sm:pb-24">
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

        {/* Eliminated Players */}
        {eliminatedPlayers.length > 0 && (
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl">
            <h2 className="text-base sm:text-xl font-bold text-gray-400 mb-2 sm:mb-4 flex items-center armenian-text">
              <span className="mr-1 sm:mr-2">🚫</span> Հեռացված Խաղացողներ ({eliminatedPlayers.length})
            </h2>
            <div className="max-h-32 sm:max-h-48 overflow-y-auto space-y-1 sm:space-y-2 pr-1 sm:pr-2">
              {eliminatedPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}

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