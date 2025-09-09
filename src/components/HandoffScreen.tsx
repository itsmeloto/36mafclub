import React from 'react';
import { useGame } from './GameProvider';
import { armenianTexts } from '../translations/armenian';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const HandoffScreen: React.FC = () => {
  const { setGamePhase } = useGame();

  return (
    <div className="screen-container animated-gradient-bg">
      <div className="content-wrapper">
        <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="p-4 rounded-2xl bg-purple-600/20 border border-purple-500/40 animate-fade-in">
            <ShieldCheck className="w-10 h-10 text-purple-300" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white animate-fade-in">
          {armenianTexts.handoffTitle}
        </h1>
        <p className="text-gray-300 animate-fade-in-slow">
          {armenianTexts.handoffDesc}
        </p>
        <button
          onClick={() => setGamePhase('game')}
          className="relative group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-lg font-bold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
          <span className="relative z-10">{armenianTexts.handoffContinue}</span>
          <ArrowRight className="w-5 h-5 relative z-10" />
        </button>
        </div>
      </div>
    </div>
  );
};

export default HandoffScreen;
