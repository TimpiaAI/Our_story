import React, { useEffect, useState } from 'react';
import { Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { GameLevel } from '../types';
import { playButtonSound } from '../utils/sounds';

// Funny Romanian messages for each level transition
const TRANSITION_MESSAGES: Record<GameLevel, { title: string; message: string; emoji: string }> = {
  [GameLevel.HERO]: {
    title: "Să începem!",
    message: "Ține-te bine, că vine dragostea!",
    emoji: "🚀"
  },
  [GameLevel.MEETING]: {
    title: "Prima întâlnire",
    message: "Aici a început totul... pe o bancă, probabil fără WiFi.",
    emoji: "🪑"
  },
  [GameLevel.TIMELINE]: {
    title: "Călătorie în timp",
    message: "Nu-ți face griji, nu trebuie să ții minte toate datele... sau poate da?",
    emoji: "⏰"
  },
  [GameLevel.LOVE_SLIDER]: {
    title: "Test de iubire",
    message: "Cât de mult mă iubești? Hai să vedem...",
    emoji: "💕"
  },
  [GameLevel.MEMORY]: {
    title: "Joc de memorie",
    message: "Hai să vedem dacă ai memorie de elefant sau de pește auriu!",
    emoji: "🧠"
  },
  [GameLevel.QUIZ]: {
    title: "Quiz time!",
    message: "Întrebări despre noi... nu căuta pe Google, nu căuta pe ChatGPT!",
    emoji: "📝"
  },
  [GameLevel.LOVE_REASONS]: {
    title: "De ce te iubesc?",
    message: "Pregătește-te să descoperi toate motivele...",
    emoji: "💕"
  },
  [GameLevel.BOSS]: {
    title: "BOSS FIGHT!",
    message: "Trebuie să învingi cel mai mare boss: BABA!",
    emoji: "👹"
  },
  [GameLevel.LETTER]: {
    title: "Mesaj special",
    message: "Pregătește șervețelele... sau nu, fii tare!",
    emoji: "💌"
  }
};

interface LevelTransitionProps {
  targetLevel: GameLevel;
  onComplete: () => void;
}

export const LevelTransition: React.FC<LevelTransitionProps> = ({ targetLevel, onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const [isExiting, setIsExiting] = useState(false);
  const transitionData = TRANSITION_MESSAGES[targetLevel];

  useEffect(() => {
    // Only animate in, wait for button press to continue
    const enterTimer = setTimeout(() => setPhase('show'), 100);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleContinue = () => {
    if (isExiting) return; // Prevent double clicks
    setIsExiting(true);
    playButtonSound();

    // First change the level while transition is still visible
    onComplete();

    // Then fade out after a short delay to let new level render
    setTimeout(() => setPhase('exit'), 100);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
      phase === 'enter' ? 'opacity-0' : phase === 'exit' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 opacity-60" />
            ) : i % 3 === 1 ? (
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 opacity-60" />
            ) : (
              <Sparkles className="w-4 h-4 text-white opacity-40" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center transform transition-all duration-500 px-4 ${
        phase === 'show' ? 'scale-100 translate-y-0' : 'scale-75 translate-y-10'
      }`}>
        {/* Big emoji */}
        <div className="text-5xl sm:text-8xl mb-4 sm:mb-6 animate-bounce-slow">
          {transitionData.emoji}
        </div>

        {/* Title */}
        <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl text-white mb-2 sm:mb-4 drop-shadow-lg animate-pulse-slow">
          {transitionData.title}
        </h1>

        {/* Funny message */}
        <p className="font-pixel text-[10px] sm:text-sm md:text-base text-pink-200 max-w-md mx-auto px-4 leading-relaxed">
          {transitionData.message}
        </p>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="mt-6 sm:mt-8 mx-auto bg-gradient-to-r from-pink-500 to-red-500 text-white font-pixel text-xs sm:text-sm py-3 sm:py-4 px-6 sm:px-8 border-4 border-white/30 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 sm:gap-3 hover:from-pink-600 hover:to-red-600 rounded-lg animate-pulse-slow"
        >
          CONTINUĂ <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-float-particle {
          animation: float-particle ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
