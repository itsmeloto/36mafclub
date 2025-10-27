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
    <div className="screen-container animated-gradient-bg animate-fade-in">
      <div className="content-wrapper">
        {/* Main Welcome Card - Enhanced with consistent spacing and animations */}
        <div className="glass-card p-8 sm:p-10 md:p-12 max-w-md w-full text-center space-y-8 animate-fade-in-slow">
          
          {/* Logo Section - Improved visual hierarchy */}
          <div className="flex justify-center animate-scale-in">
            <div className="relative">
              {/* Animated glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl animate-pulse-glow"></div>
              {/* Logo container */}
              <div className="relative bg-black/20 backdrop-blur-sm border border-black/40 rounded-2xl p-5 shadow-2xl">
                <img 
                  src="/logo.png" 
                  alt="36 MAF CLUB Logo" 
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
          
          {/* Title - Responsive typography with clamp */}
          <h1 className="heading-gradient font-extrabold mb-6 animate-fade-in armenian-text" 
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}>
            {armenianTexts.appTitle}
          </h1>
          
          {/* Play Button - Enhanced accessibility and visual feedback */}
          <button
            onClick={handlePlay}
            className="relative group w-full max-w-xs mx-auto touch-target animate-fade-in"
            aria-label="Սկսել խաղը"
          >
            {/* Button glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
            {/* Button content */}
            <span className="relative flex items-center justify-center px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-2xl shadow-2xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                  style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)' }}>
              {armenianTexts.play}
            </span>
          </button>
          
          {/* Credit Text - Improved contrast for accessibility */}
          <div className="text-gray-300 animate-fade-in-slow armenian-text" 
               style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            {armenianTexts.producedBy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;