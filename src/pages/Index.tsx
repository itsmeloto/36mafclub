import React from 'react';
import { GameProvider } from '../components/GameProvider';
import WelcomeScreen from '../components/WelcomeScreen';
import PlayerConfig from '../components/PlayerConfig';
import RoleAssignment from '../components/RoleAssignment';
import GameLobby from '../components/GameLobby';
import { useGame } from '../components/GameProvider';
import HandoffScreen from '../components/HandoffScreen';

const GameRouter: React.FC = () => {
  const { gameState } = useGame();

  const renderCurrentScreen = () => {
    switch (gameState.gamePhase) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'config':
        return <PlayerConfig />;
      case 'roles':
        return <RoleAssignment />;
      case 'handoff':
        return <HandoffScreen />;
      case 'game':
        return <GameLobby />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="pwa-container min-h-screen bg-gradient-to-br from-red-900 via-black to-black">
      {renderCurrentScreen()}
    </div>
  );
};

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}