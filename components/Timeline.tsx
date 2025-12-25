import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { calculateDaysTogether, TIMELINE_EVENTS } from '../constants';
import { playButtonSound } from '../utils/sounds';

// Sprite configurations for different moments
// Each event gets a specific pose - no frame switching to avoid stuttering
const SPRITE_STATES = [
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/1.png' }, // Începutul - casual pose
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/2.png' }, // Revelion - celebratory pose
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/2.png' }, // Crăciun - mixed poses
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/1.png' }, // Viitor - mixed poses
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
  const [isReady, setIsReady] = useState(false);

  // Get the sprite state for current timeline moment
  const currentSprites = SPRITE_STATES[currentStep] || SPRITE_STATES[0];

  // Generate stable random positions for decorative elements (only once)
  const snowflakes = useMemo(() =>
    [...Array(50)].map((_, i) => ({
      left: seededRandom(i + 1) * 100,
      delay: seededRandom(i + 100) * 5,
      duration: 5 + seededRandom(i + 200) * 5,
      size: 8 + seededRandom(i + 300) * 12,
      opacity: 0.6 + seededRandom(i + 400) * 0.4
    })), []);

  const floatingHearts = useMemo(() =>
    [...Array(15)].map((_, i) => ({
      left: seededRandom(i + 500) * 100,
      delay: seededRandom(i + 600) * 8,
      duration: 8 + seededRandom(i + 700) * 6,
      size: 16 + seededRandom(i + 800) * 20,
      opacity: 0.4 + seededRandom(i + 900) * 0.4
    })), []);

  const stars = useMemo(() =>
    [...Array(30)].map((_, i) => ({
      left: seededRandom(i + 1000) * 100,
      top: seededRandom(i + 1100) * 50,
      size: 2 + seededRandom(i + 1200) * 2,
      delay: seededRandom(i + 1300) * 3
    })), []);

  // Delay initial render to let animations settle
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-show photo after movement delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhoto(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    playButtonSound();
    if (currentStep < TIMELINE_EVENTS.length - 1) {
      setShowPhoto(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 200); // Wait for close animation
    } else {
      onComplete();
    }
  };

  const currentEvent = TIMELINE_EVENTS[currentStep];
  const progress = ((currentStep + 1) / TIMELINE_EVENTS.length) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>

      {/* --- Snowflakes --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute text-white animate-snowfall will-change-transform"
            style={{
              left: `${flake.left}%`,
              top: `-20px`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* --- Floating Hearts --- */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {floatingHearts.map((heart, i) => (
          <Heart
            key={i}
            className="absolute text-red-500 fill-red-500 animate-float-heart will-change-transform"
            style={{
              left: `${heart.left}%`,
              bottom: `-30px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              opacity: heart.opacity
            }}
          />
        ))}
      </div>

      {/* --- Stars Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle will-change-opacity"
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
      <div className="absolute top-12 sm:top-4 left-2 sm:left-4 z-20 bg-white/90 backdrop-blur border-2 border-black p-1 sm:p-2 font-pixel text-[8px] sm:text-xs shadow-md flex items-center gap-1 sm:gap-2">
         <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
         Zile: <span className="text-red-500 font-bold">{days}</span>
      </div>
      <div className="absolute top-12 sm:top-4 right-2 sm:right-4 z-20 flex items-center gap-2">
        <div className="w-20 sm:w-32 h-3 sm:h-4 bg-gray-200/80 border-2 border-black rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* --- Christmas Lights on top --- */}
      <div className="absolute top-0 w-full h-8 flex justify-around items-center z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-4 rounded-full animate-pulse shadow-lg"
            style={{
              backgroundColor: ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 5],
              boxShadow: `0 0 10px ${['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i % 5]}`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* --- MAIN GAME VIEW --- */}
      <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">

        {/* Memory "Bubble" / Popup */}
        <div className={`transition-all duration-500 ease-out transform ${showPhoto ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'} z-10 mb-4 sm:mb-8`}>
            <div className="bg-white p-2 sm:p-4 pb-6 sm:pb-10 shadow-2xl rotate-1 max-w-[200px] sm:max-w-[300px] md:max-w-sm border-4 border-white relative rounded-lg">
               {/* Tape with Christmas pattern */}
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-28 h-10 bg-gradient-to-r from-red-500 via-green-500 to-red-500 transform -rotate-1 rounded opacity-80"></div>

               <div className="bg-gray-100 w-full aspect-square overflow-hidden mb-4 border-2 border-gray-200 rounded shadow-inner">
                  <img src={currentEvent.image} alt="Memory" className="w-full h-full object-cover" />
               </div>

               <h3 className="font-handwriting text-xl sm:text-3xl text-center text-gray-800 mb-1 sm:mb-2">
                 {currentEvent.date}
               </h3>
               <p className="font-pixel text-[8px] sm:text-[10px] text-center text-gray-600 leading-relaxed px-1 sm:px-2">
                 {currentEvent.desc}
               </p>

               {/* Corner Hearts */}
               <Heart className="absolute -top-2 -left-2 w-6 h-6 text-red-500 fill-red-500 rotate-[-15deg]" />
               <Heart className="absolute -top-2 -right-2 w-6 h-6 text-pink-500 fill-pink-500 rotate-[15deg]" />

               {/* Sticker */}
               <div className="absolute -bottom-4 -right-4 text-5xl filter drop-shadow-lg">
                 {currentEvent.icon}
               </div>
            </div>
        </div>

        {/* --- GROUND --- */}
        <div className="absolute bottom-0 w-full h-28 relative">
           {/* Snow layer */}
           <div className="absolute top-0 w-full h-6 bg-gradient-to-b from-white to-blue-100 rounded-t-full"></div>
           {/* Ground */}
           <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-green-800 to-green-900 border-t-4 border-green-700">
              {/* Snow patches on ground */}
              <div className="absolute top-0 left-[10%] w-20 h-3 bg-white/60 rounded-full"></div>
              <div className="absolute top-1 left-[50%] w-16 h-2 bg-white/50 rounded-full"></div>
              <div className="absolute top-0 right-[15%] w-24 h-3 bg-white/60 rounded-full"></div>
           </div>

           {/* Christmas trees and decorations */}
           <div
             className="absolute bottom-24 left-0 w-[200%] h-48 flex items-end transition-transform duration-700 ease-in-out"
             style={{ transform: `translateX(-${currentStep * 20}%)` }}
           >
              {TIMELINE_EVENTS.map((_, i) => (
                <div key={i} className="flex-1 flex justify-center items-end h-full relative">
                   {/* Christmas Tree - left */}
                   <img
                     src="/imagini/elements/tree.png"
                     alt="Christmas Tree"
                     className="absolute bottom-0 w-28 h-36 object-contain drop-shadow-lg"
                     style={{
                       imageRendering: 'pixelated',
                       left: `${3 + (i * 7) % 12}%`
                     }}
                   />
                   {/* Present 1 */}
                   <img
                     src="/imagini/elements/present.png"
                     alt="Present"
                     className="absolute bottom-0 w-20 h-20 object-contain drop-shadow-lg"
                     style={{
                       imageRendering: 'pixelated',
                       left: `${20 + (i * 11) % 15}%`
                     }}
                   />
                   {/* Snowman */}
                   <img
                     src="/imagini/elements/snowman.png"
                     alt="Snowman"
                     className="absolute bottom-0 w-24 h-28 object-contain drop-shadow-lg"
                     style={{
                       imageRendering: 'pixelated',
                       left: `${38 + (i * 9) % 10}%`
                     }}
                   />
                   {/* Heart */}
                   <Heart
                     className="absolute w-5 h-5 text-red-500 fill-red-500 animate-pulse"
                     style={{
                       bottom: `${20 + (i * 13) % 30}px`,
                       left: `${55 + (i * 7) % 12}%`
                     }}
                   />
                   {/* Present 2 */}
                   <img
                     src="/imagini/elements/present.png"
                     alt="Present"
                     className="absolute bottom-0 w-16 h-16 object-contain drop-shadow-lg"
                     style={{
                       imageRendering: 'pixelated',
                       right: `${25 + (i * 8) % 12}%`
                     }}
                   />
                   {/* Christmas Tree - right */}
                   <img
                     src="/imagini/elements/tree.png"
                     alt="Christmas Tree"
                     className="absolute bottom-0 w-28 h-36 object-contain drop-shadow-lg"
                     style={{
                       imageRendering: 'pixelated',
                       right: `${2 + (i * 5) % 10}%`
                     }}
                   />
                </div>
              ))}
           </div>
        </div>

        {/* --- CHARACTERS (Both together, positioned on grass) --- */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
           <div className="flex flex-col items-center">
              {/* Event title */}
              <div className="bg-white/90 backdrop-blur border-2 border-black px-3 py-1 text-[10px] font-pixel mb-2 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1">
                <span>{currentEvent.icon}</span> {currentEvent.title}
              </div>

              {/* Both characters standing together on the grass */}
              <div className="flex items-end gap-2">
                {/* Ovidiu - smooth idle animation */}
                <div className="animate-idle">
                  <img
                    src={currentSprites.ovidiu}
                    alt="Ovidiu"
                    className="w-20 h-20 object-contain drop-shadow-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* Heart between them */}
                <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-heartbeat mb-8" />

                {/* Antonia - smooth idle animation with slight delay */}
                <div className="animate-idle" style={{ animationDelay: '0.3s' }}>
                  <img
                    src={currentSprites.antonia}
                    alt="Antonia"
                    className="w-20 h-20 object-contain drop-shadow-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* --- CONTROLS --- */}
      <div className="absolute bottom-4 w-full px-4 flex justify-center z-30">
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-pixel text-sm md:text-base py-4 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 hover:from-red-600 hover:to-pink-600 w-full max-w-sm justify-center rounded-lg"
        >
          {currentStep < TIMELINE_EVENTS.length - 1 ? (
            <>MERGI MAI DEPARTE <ArrowRight /></>
          ) : (
            <>URMĂTORUL NIVEL <Star className="fill-current" /></>
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
        @keyframes float-heart {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(20px) scale(1.2); opacity: 0; }
        }
        .animate-float-heart {
          animation: float-heart ease-in-out infinite;
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