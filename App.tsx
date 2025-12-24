import React, { useState } from 'react';
import { GameLevel } from './types';
import { Hero } from './components/Hero';
import { MeetingScene } from './components/MeetingScene';
import { Timeline } from './components/Timeline';
import { MemoryGame } from './components/MemoryGame';
import { Quiz } from './components/Quiz';
import { BossFight } from './components/BossFight';
import { Letter } from './components/Letter';
import { CoffeeBreak } from './components/CoffeeBreak';
import { LevelTransition } from './components/LevelTransition';
import { Coffee } from 'lucide-react';

const App: React.FC = () => {
  const [level, setLevel] = useState<GameLevel>(GameLevel.HERO);
  const [isCoffeeBreakOpen, setIsCoffeeBreakOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLevel, setNextLevel] = useState<GameLevel | null>(null);

  // Handle level transition with animation
  const transitionToLevel = (targetLevel: GameLevel) => {
    setNextLevel(targetLevel);
    setIsTransitioning(true);
  };

  // Called when user clicks continue - changes level while transition still visible
  const handleTransitionComplete = () => {
    if (nextLevel) {
      setLevel(nextLevel);
      setNextLevel(null);
      // Close transition after fade-out animation completes
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const renderLevel = () => {
    switch (level) {
      case GameLevel.HERO:
        return <Hero onStart={() => transitionToLevel(GameLevel.MEETING)} />;
      case GameLevel.MEETING:
        return <MeetingScene onComplete={() => transitionToLevel(GameLevel.TIMELINE)} />;
      case GameLevel.TIMELINE:
        return <Timeline onComplete={() => transitionToLevel(GameLevel.MEMORY)} />;
      case GameLevel.MEMORY:
        return <MemoryGame onComplete={() => transitionToLevel(GameLevel.QUIZ)} />;
      case GameLevel.QUIZ:
        return <Quiz onComplete={() => transitionToLevel(GameLevel.BOSS)} />;
      case GameLevel.BOSS:
        return <BossFight onComplete={() => transitionToLevel(GameLevel.LETTER)} />;
      case GameLevel.LETTER:
        return <Letter />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="antialiased text-gray-900 select-none">
      {/* Coffee Break Button (Available everywhere except Hero, Meeting and Letter) */}
      {level !== GameLevel.HERO && level !== GameLevel.MEETING && level !== GameLevel.LETTER && (
        <button 
          onClick={() => setIsCoffeeBreakOpen(true)}
          className="fixed top-4 right-4 z-40 bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-md flex items-center gap-2 font-pixel text-[10px]"
        >
          <Coffee className="w-4 h-4" />
          PAUZĂ
        </button>
      )}

      {renderLevel()}

      <CoffeeBreak
        isOpen={isCoffeeBreakOpen}
        onClose={() => setIsCoffeeBreakOpen(false)}
      />

      {/* Level transition overlay */}
      {isTransitioning && nextLevel && (
        <LevelTransition
          targetLevel={nextLevel}
          onComplete={handleTransitionComplete}
        />
      )}
    </div>
  );
};

export default App;