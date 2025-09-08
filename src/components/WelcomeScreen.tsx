import React from 'react';
import { armenianTexts } from '../translations/armenian';
import { useGame } from './GameProvider';

const WelcomeScreen: React.FC = () => {
  const { setGamePhase, initializeNewGame } = useGame();

  const handlePlay = () => {
    initializeNewGame();
    setGamePhase('config');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animated-gradient-bg animate-fade-in">
      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10 max-w-md w-full shadow-2xl text-center space-y-8 animate-fade-in-slow">
        {/* Logo */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
              <img 
                src="/logo.png" 
                alt="36 MAF CLUB Logo" 
                className="w-24 h-24 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          {armenianTexts.appTitle}
        </h1>
        <button
          onClick={handlePlay}
          className="relative group px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-2xl font-bold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
          <span className="relative z-10">{armenianTexts.play}</span>
        </button>
        <div className="text-gray-400 text-base mt-8 animate-fade-in-slow">
          {armenianTexts.producedBy}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
