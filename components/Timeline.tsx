import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { calculateDaysTogether, TIMELINE_EVENTS } from '../constants';

// Sprite configurations for different moments
// Each event gets a specific pose - no frame switching to avoid stuttering
const SPRITE_STATES = [
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/1.png' }, // Începutul - casual pose
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/2.png' }, // Revelion - celebratory pose
  { ovidiu: '/imagini/Sprites/Ovidiu/3.png', antonia: '/imagini/Sprites/Antonia/2.png' }, // Crăciun - mixed poses
  { ovidiu: '/imagini/Sprites/Ovidiu/4.png', antonia: '/imagini/Sprites/Antonia/1.png' }, // Viitor - mixed poses
];

interface TimelineProps {
  onComplete: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ onComplete }) => {
  const days = calculateDaysTogether();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);

  // Get the sprite state for current timeline moment
  const currentSprites = SPRITE_STATES[currentStep] || SPRITE_STATES[0];

  // Auto-show photo after movement delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhoto(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 flex flex-col relative overflow-hidden">

      {/* --- Snowflakes --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${8 + Math.random() * 12}px`,
              opacity: 0.6 + Math.random() * 0.4
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* --- Floating Hearts --- */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-red-500 fill-red-500 animate-float-heart"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `-30px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              width: `${16 + Math.random() * 20}px`,
              height: `${16 + Math.random() * 20}px`,
              opacity: 0.4 + Math.random() * 0.4
            }}
          />
        ))}
      </div>

      {/* --- Stars Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* --- HUD --- */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur border-2 border-black p-2 font-pixel text-xs shadow-md flex items-center gap-2">
         <Heart className="w-4 h-4 text-red-500 fill-red-500" />
         Zile împreună: <span className="text-red-500 font-bold">{days}</span>
      </div>
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="w-32 h-4 bg-gray-200/80 border-2 border-black rounded-full overflow-hidden">
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
        <div className={`transition-all duration-500 ease-out transform ${showPhoto ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'} z-10 mb-8`}>
            <div className="bg-white p-4 pb-10 shadow-2xl rotate-1 max-w-[300px] md:max-w-sm border-4 border-white relative rounded-lg">
               {/* Tape with Christmas pattern */}
               <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-28 h-10 bg-gradient-to-r from-red-500 via-green-500 to-red-500 transform -rotate-1 rounded opacity-80"></div>

               <div className="bg-gray-100 w-full aspect-square overflow-hidden mb-4 border-2 border-gray-200 rounded shadow-inner">
                  <img src={currentEvent.image} alt="Memory" className="w-full h-full object-cover" />
               </div>

               <h3 className="font-handwriting text-3xl text-center text-gray-800 mb-2">
                 {currentEvent.date}
               </h3>
               <p className="font-pixel text-[10px] text-center text-gray-600 leading-relaxed px-2">
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