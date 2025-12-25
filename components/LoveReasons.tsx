import React, { useState, useEffect, useRef } from 'react';
import { PixelCard } from './PixelCard';
import { playButtonSound, playGoofySound } from '../utils/sounds';
import { ArrowRight } from 'lucide-react';

// Words to cycle through rapidly
const LOVE_WORDS = [
  'frumoasă',
  'deșteaptă',
  'amuzantă',
  'dulce',
  'perfectă',
  'specială',
  'minunată',
  'drăguță',
  'talentată',
  'creativă',
  'iubitoare',
  'înțelegătoare',
  'răbdătoare',
  'genială',
  'unică',
  'magică',
  'incredibilă',
  'superbă',
  'adorabilă',
  'fermecătoare',
  'strălucitoare',
  'extraordinară',
  'irezistibilă',
  'scumpa mea',
  'totul pentru mine',
  'sufletul meu pereche',
  'inima mea',
  'viața mea',
  'soarele meu',
  'luna mea'
];

interface LoveReasonsProps {
  onComplete: () => void;
}

export const LoveReasons: React.FC<LoveReasonsProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'initial' | 'wait' | 'spinning' | 'reveal'>('initial');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleFirstContinue = () => {
    playButtonSound();
    setPhase('wait');
  };

  const handleSecondContinue = () => {
    playButtonSound();
    playGoofySound(0.5);
    setPhase('spinning');

    // Start rapid word cycling - 10 words per second (100ms each)
    let count = 0;
    intervalRef.current = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 1) % LOVE_WORDS.length);
      count++;
      setSpinCount(count);

      // After about 50 cycles (5 seconds), slow down and stop
      if (count >= 50) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        // Slow down phase
        let slowCount = 0;
        const slowInterval = setInterval(() => {
          setCurrentWordIndex(prev => (prev + 1) % LOVE_WORDS.length);
          slowCount++;
          if (slowCount >= 10) {
            clearInterval(slowInterval);
            setPhase('reveal');
          }
        }, 200 + slowCount * 50); // Gradually slower
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleComplete = () => {
    playButtonSound();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 animate-float-heart"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              fontSize: `${16 + (i % 3) * 8}px`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.4
            }}
          >
            💕
          </div>
        ))}
      </div>

      <div className="bg-black text-white font-pixel p-2 text-center mb-4 sm:mb-8 border-2 border-white w-full max-w-lg z-10 text-[10px] sm:text-sm mx-2">
        NIVELUL SPECIAL: DE CE TE IUBESC?
      </div>

      {phase === 'initial' && (
        <PixelCard className="max-w-lg w-full z-10 mx-2">
          <div className="text-center py-4 sm:py-8">
            <h2 className="font-pixel text-base sm:text-xl mb-4 sm:mb-6 text-pixel-red">
              Te iubesc pentru că...
            </h2>
            <p className="font-pixel text-2xl sm:text-4xl mb-6 sm:mb-8">
              ...
            </p>
            <button
              onClick={handleFirstContinue}
              className="bg-pixel-pink text-white font-pixel py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm border-b-4 border-r-4 border-black hover:bg-pink-600 active:border-b-0 active:border-r-0 flex items-center gap-2 mx-auto"
            >
              CONTINUĂ <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </PixelCard>
      )}

      {phase === 'wait' && (
        <PixelCard className="max-w-lg w-full z-10 mx-2">
          <div className="text-center py-4 sm:py-8">
            <h2 className="font-pixel text-sm sm:text-lg mb-4 sm:mb-6 text-pixel-red animate-bounce">
              Stai! 🛑
            </h2>
            <p className="font-pixel text-xs sm:text-sm mb-6 sm:mb-8">
              Nu vrei să afli de ce te iubesc? 🥺
            </p>
            <button
              onClick={handleSecondContinue}
              className="bg-pixel-pink text-white font-pixel py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm border-b-4 border-r-4 border-black hover:bg-pink-600 active:border-b-0 active:border-r-0 flex items-center gap-2 mx-auto animate-pulse-fast"
            >
              DA, VREAU! 💖 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </PixelCard>
      )}

      {phase === 'spinning' && (
        <PixelCard className="max-w-lg w-full z-10 mx-2">
          <div className="text-center py-4 sm:py-8">
            <h2 className="font-pixel text-sm sm:text-lg mb-2 sm:mb-4 text-pixel-red">
              Te iubesc pentru că ești...
            </h2>

            {/* Slot machine style word display */}
            <div className="relative h-16 sm:h-24 overflow-hidden border-4 border-black bg-gradient-to-b from-gray-100 to-white mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-pixel text-lg sm:text-2xl text-pixel-pink animate-spin-word"
                  key={currentWordIndex}
                >
                  {LOVE_WORDS[currentWordIndex]}
                </span>
              </div>
              {/* Blur effect at edges */}
              <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 bg-gradient-to-b from-white to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-6 bg-gradient-to-t from-white to-transparent z-10"></div>
            </div>

            <p className="font-pixel text-[10px] sm:text-xs text-gray-500">
              Se încarcă motivele... {Math.min(100, spinCount * 2)}%
            </p>
          </div>
        </PixelCard>
      )}

      {phase === 'reveal' && (
        <PixelCard className="max-w-lg w-full z-10 animate-reveal-pop mx-2">
          <div className="text-center py-4 sm:py-6">
            <h2 className="font-pixel text-sm sm:text-lg mb-2 sm:mb-4 text-pixel-red">
              Te iubesc pentru că ești...
            </h2>

            <div className="font-pixel text-2xl sm:text-3xl text-pixel-pink mb-4 sm:mb-6 animate-pulse">
              TOTUL! 💕
            </div>

            <div className="text-[10px] sm:text-sm font-pixel text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              <p className="mb-1 sm:mb-2">Ești frumoasă, deșteaptă, amuzantă...</p>
              <p className="mb-1 sm:mb-2">Ești perfectă, specială, minunată...</p>
              <p className="mb-1 sm:mb-2">Ești iubitoare, înțelegătoare, răbdătoare...</p>
              <p className="text-pixel-red font-bold">Ești TOT ce îmi doresc! 💖</p>
            </div>

            <button
              onClick={handleComplete}
              className="bg-green-500 text-white font-pixel py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm border-b-4 border-r-4 border-black hover:bg-green-600 active:border-b-0 active:border-r-0 flex items-center gap-2 mx-auto animate-bounce"
            >
              CONTINUĂ 💕 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </PixelCard>
      )}

      <style>{`
        @keyframes float-heart {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        .animate-float-heart {
          animation: float-heart 3s ease-in-out infinite;
        }

        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 0, 68, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255, 0, 68, 0.3); }
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.8s ease-in-out infinite;
        }

        @keyframes spin-word {
          0% { transform: translateY(30px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-30px); opacity: 0; }
        }
        .animate-spin-word {
          animation: spin-word 0.1s ease-out;
        }

        @keyframes reveal-pop {
          0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-reveal-pop {
          animation: reveal-pop 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
