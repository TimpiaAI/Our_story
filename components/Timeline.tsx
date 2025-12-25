import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { calculateDaysTogether, TIMELINE_EVENTS } from '../constants';
import { playButtonSound, playSpecificSound } from '../utils/sounds';

// Sprite configurations for different moments
const SPRITE_STATES = [
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/1.png' },
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/2.png' },
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/2.png' },
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/1.png' },
];

// Seeded random for stable positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

interface TimelineProps {
  onComplete: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ onComplete }) => {
  const days = calculateDaysTogether();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);

  const currentEvent = TIMELINE_EVENTS[currentStep];
  const currentSprites = SPRITE_STATES[currentStep % SPRITE_STATES.length];
  const progress = ((currentStep + 1) / TIMELINE_EVENTS.length) * 100;

  // Generate stable random positions for decorative elements
  const snowflakes = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      left: seededRandom(i + 1) * 100,
      delay: seededRandom(i + 100) * 5,
      duration: 5 + seededRandom(i + 200) * 5,
      size: 10 + seededRandom(i + 300) * 10
    })), []);

  const stars = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: seededRandom(i + 1000) * 100,
      top: seededRandom(i + 1100) * 40,
      size: 2 + seededRandom(i + 1200) * 2,
      delay: seededRandom(i + 1300) * 3
    })), []);

  // Auto-show photo after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowPhoto(true), 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Play music when pause event appears (for 10 seconds)
  useEffect(() => {
    if (currentEvent?.isPause && currentEvent?.pauseMusic) {
      playSpecificSound(currentEvent.pauseMusic, 0.8, 10000);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < TIMELINE_EVENTS.length - 1) {
      setShowPhoto(false);
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden">

      {/* --- Snowflakes --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute text-white animate-snowfall"
            style={{
              left: `${flake.left}%`,
              top: `-20px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              fontSize: `${flake.size}px`,
              opacity: 0.7
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* --- Stars Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* --- HUD --- */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 bg-white/90 backdrop-blur border-2 border-black p-1 sm:p-2 font-pixel text-[8px] sm:text-xs shadow-md flex items-center gap-1 sm:gap-2 rounded">
        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
        Zile: <span className="text-red-500 font-bold">{days}</span>
      </div>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex items-center gap-2">
        <span className="font-pixel text-[8px] sm:text-xs text-white/80">
          {currentStep + 1}/{TIMELINE_EVENTS.length}
        </span>
        <div className="w-16 sm:w-24 h-2 sm:h-3 bg-gray-200/80 border border-black rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* --- Christmas Lights on top --- */}
      <div className="absolute top-0 w-full h-6 flex justify-around items-center z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-3 rounded-full animate-pulse shadow-lg"
            style={{
              backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 5],
              boxShadow: `0 0 8px ${['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 5]}`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-36 pt-16">

        {/* Memory Photo Card */}
        <div className={`transition-all duration-500 ${showPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-white p-3 sm:p-4 shadow-2xl rotate-1 max-w-[280px] sm:max-w-[340px] border-4 border-white relative rounded-lg">
            {/* Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-gradient-to-r from-red-500 via-green-500 to-red-500 transform -rotate-1 rounded opacity-80"></div>

            {/* Photo */}
            <div className="bg-gray-100 w-full aspect-square overflow-hidden mb-3 border-2 border-gray-200 rounded shadow-inner">
              <img
                src={currentEvent.image}
                alt="Memory"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/imagini/personal/timeline/prima_poza_28mai2024.png';
                }}
              />
            </div>

            {/* Date */}
            <h3 className="font-handwriting text-xl sm:text-2xl text-center text-gray-800 mb-1">
              {currentEvent.date}
            </h3>

            {/* Title */}
            <p className="font-pixel text-[10px] sm:text-xs text-center text-pink-600 font-bold mb-1">
              {currentEvent.title}
            </p>

            {/* Description */}
            <p className="font-pixel text-[8px] sm:text-[10px] text-center text-gray-500 leading-relaxed">
              {currentEvent.desc}
            </p>

            {/* Corner Hearts */}
            <Heart className="absolute -top-2 -left-2 w-5 h-5 text-red-500 fill-red-500 rotate-[-15deg]" />
            <Heart className="absolute -top-2 -right-2 w-5 h-5 text-pink-500 fill-pink-500 rotate-[15deg]" />

            {/* Icon sticker */}
            <div className="absolute -bottom-3 -right-3 text-4xl filter drop-shadow-lg">
              {currentEvent.icon}
            </div>
          </div>
        </div>
      </div>

      {/* --- GROUND with Trees and Characters --- */}
      <div className="absolute bottom-16 w-full h-28 pointer-events-none">
        {/* Snow layer */}
        <div className="absolute top-0 w-full h-4 bg-gradient-to-b from-white/80 to-transparent"></div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-800 to-green-700 border-t-4 border-white">
          {/* Snow patches */}
          <div className="absolute top-0 left-[10%] w-16 h-2 bg-white/60 rounded-full"></div>
          <div className="absolute top-0 left-[50%] w-12 h-2 bg-white/50 rounded-full"></div>
          <div className="absolute top-0 right-[15%] w-20 h-2 bg-white/60 rounded-full"></div>
        </div>

        {/* Trees and decorations */}
        <img src="/imagini/elements/tree.png" alt="Tree" className="absolute bottom-20 left-[3%] w-14 h-18 object-contain" style={{ imageRendering: 'pixelated' }} />
        <img src="/imagini/elements/present.png" alt="Present" className="absolute bottom-20 left-[18%] w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />

        {/* CHARACTER SPRITES */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1 z-20">
          {/* Ovidiu */}
          <div className="animate-idle">
            <img
              src={currentSprites.ovidiu}
              alt="Ovidiu"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Heart between them */}
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-heartbeat mb-6" />

          {/* Antonia */}
          <div className="animate-idle" style={{ animationDelay: '0.3s' }}>
            <img
              src={currentSprites.antonia}
              alt="Antonia"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        <img src="/imagini/elements/snowman.png" alt="Snowman" className="absolute bottom-20 right-[20%] w-12 h-14 object-contain" style={{ imageRendering: 'pixelated' }} />
        <img src="/imagini/elements/present.png" alt="Present" className="absolute bottom-20 right-[35%] w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
        <img src="/imagini/elements/tree.png" alt="Tree" className="absolute bottom-20 right-[3%] w-14 h-18 object-contain" style={{ imageRendering: 'pixelated' }} />
      </div>

      {/* --- CONTROLS --- */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-black/50 backdrop-blur-sm">
        <button
          onClick={handleNext}
          className="w-full max-w-sm mx-auto bg-gradient-to-r from-red-500 to-pink-500 text-white font-pixel text-xs sm:text-sm py-3 px-6 border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 rounded-lg"
        >
          {currentStep < TIMELINE_EVENTS.length - 1 ? (
            <>MERGI MAI DEPARTE <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>URMĂTORUL NIVEL <Star className="w-4 h-4 fill-current" /></>
          )}
        </button>
      </div>

      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-idle {
          animation: idle 2s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
