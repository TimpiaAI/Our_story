import React, { useState, useEffect, useRef } from 'react';
import { GameLevel } from './types';
import { Hero } from './components/Hero';
import { MeetingScene } from './components/MeetingScene';
import { Timeline } from './components/Timeline';
import { MemoryGame } from './components/MemoryGame';
import { Quiz } from './components/Quiz';
import { BossFight } from './components/BossFight';
import { Letter } from './components/Letter';
import { LoveSlider } from './components/LoveSlider';
import { LoveReasons } from './components/LoveReasons';
import { CoffeeBreak } from './components/CoffeeBreak';
import { LevelTransition } from './components/LevelTransition';
import { Coffee, Volume2, VolumeX } from 'lucide-react';
import { playButtonSound } from './utils/sounds';

const App: React.FC = () => {
  const [level, setLevel] = useState<GameLevel>(GameLevel.HERO);
  const [isCoffeeBreakOpen, setIsCoffeeBreakOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLevel, setNextLevel] = useState<GameLevel | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and autoplay background music - plays entire game at 20% volume
  useEffect(() => {
    bgMusicRef.current = new Audio('/sfx/cover/cover.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.05; // 5% volume

    // Try to autoplay immediately
    bgMusicRef.current.play().catch(() => {
      // If autoplay is blocked, we'll start on first interaction
    });

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, []);

  // Start the experience (also tries to play music if autoplay was blocked)
  const startExperience = () => {
    playButtonSound();
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play().catch(() => {});
    }
    setShowIntro(false);
  };

  // Toggle mute
  const toggleMute = () => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
        return <Timeline onComplete={() => transitionToLevel(GameLevel.LOVE_SLIDER)} />;
      case GameLevel.LOVE_SLIDER:
        return <LoveSlider onComplete={() => transitionToLevel(GameLevel.MEMORY)} />;
      case GameLevel.MEMORY:
        return <MemoryGame onComplete={() => transitionToLevel(GameLevel.QUIZ)} />;
      case GameLevel.QUIZ:
        return <Quiz onComplete={() => transitionToLevel(GameLevel.LOVE_REASONS)} />;
      case GameLevel.LOVE_REASONS:
        return <LoveReasons onComplete={() => transitionToLevel(GameLevel.BOSS)} />;
      case GameLevel.BOSS:
        return <BossFight onComplete={() => transitionToLevel(GameLevel.LETTER)} />;
      case GameLevel.LETTER:
        return <Letter />;
      default:
        return <div>Error</div>;
    }
  };

  // Intro splash screen
  if (showIntro) {
    return (
      <div
        onClick={startExperience}
        className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-100 to-white flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
      >
        {/* Floating hearts background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300 animate-float-slow"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                fontSize: `${20 + (i % 3) * 10}px`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.5
              }}
            >
              ❤
            </div>
          ))}
        </div>

        <div className="text-center z-10 animate-landing">
          <h1 className="font-pixel text-3xl md:text-6xl text-pixel-red mb-8 drop-shadow-lg px-4">
            Povestea Noastră
          </h1>
          <div className="animate-pulse">
            <p className="font-pixel text-xs text-gray-500">✨ Atinge pentru a începe ✨</p>
          </div>
        </div>

        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          .animate-float-slow {
            animation: float-slow 4s ease-in-out infinite;
          }
          @keyframes landing {
            0% { transform: scale(2) translateY(-50px); opacity: 0; }
            60% { transform: scale(1.1) translateY(10px); opacity: 1; }
            80% { transform: scale(0.95) translateY(-5px); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-landing {
            animation: landing 1.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="antialiased text-gray-900 select-none">
      {/* Music control button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed bottom-4 left-4 z-40 bg-white border-2 border-black p-2 hover:bg-gray-100 shadow-md"
        title={isMuted ? "Activează sunetul" : "Dezactivează sunetul"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

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

      {/* Main content with landing animation */}
      <div className="animate-content-landing">
        {renderLevel()}
      </div>

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

      <style>{`
        @keyframes content-landing {
          0% { transform: scale(1.5); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.98); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-content-landing {
          animation: content-landing 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;