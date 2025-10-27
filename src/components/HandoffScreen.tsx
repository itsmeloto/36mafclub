import React from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const HandoffScreen: React.FC = () => {
  const { setGamePhase } = useGame();

  return (
    <div className="screen-container animated-gradient-bg animate-fade-in">
      <div className="content-wrapper">
        {/* Enhanced handoff card with improved spacing and animations */}
        <div className="glass-card p-10 sm:p-12 max-w-lg w-full text-center space-y-8 animate-scale-in">
          
          {/* Icon container - Enhanced visual appeal */}
          <div className="flex items-center justify-center animate-fade-in">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-purple-600/20 rounded-2xl blur-xl animate-pulse-glow"></div>
              {/* Icon background */}
              <div className="relative p-5 rounded-2xl bg-purple-600/20 border border-purple-500/40 shadow-xl">
                <ShieldCheck className="w-12 h-12 text-purple-300" />
              </div>
            </div>
          </div>
          
          {/* Title - Responsive typography */}
          <h1 className="font-extrabold text-white animate-fade-in armenian-text" 
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: '1.3' }}>
            {armenianTexts.handoffTitle}
          </h1>
          
          {/* Description - Improved readability */}
          <p className="text-gray-200 leading-relaxed animate-fade-in-slow armenian-text" 
             style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
            {armenianTexts.handoffDesc}
          </p>
          
          {/* Continue button - Enhanced with icon and smooth transitions */}
          <button
            onClick={() => setGamePhase('game')}
            className="relative group inline-flex items-center justify-center gap-2 touch-target animate-fade-in"
            aria-label="Շարունակել դեպի խաղ"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl shadow-2xl smooth-transition group-hover:scale-105 group-active:scale-95 armenian-text"
                  style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)' }}>
              {armenianTexts.handoffContinue}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandoffScreen;
