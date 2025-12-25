import React, { useState, useEffect, useRef } from 'react';
import { Heart, Dumbbell } from 'lucide-react';
import { playKissSound, playButtonSound, playGoofySound, playDaSauNuSound, playDaSound } from '../utils/sounds';

interface MeetingSceneProps {
  onComplete: () => void;
}

// Sprite paths
const OVIDIU_SPRITES = [
  '/imagini/Sprites/Ovidiu/3.png',
  '/imagini/Sprites/Ovidiu/4.png'
];

const ANTONIA_SPRITES = [
  '/imagini/Sprites/Antonia/1.png',
  '/imagini/Sprites/Antonia/2.png'
];

// Pixel character component with sprite head
const PixelCharacter: React.FC<{
  bodyColor: string;
  isHe?: boolean;
  showHeart?: boolean;
  isNodding?: boolean;
  spriteFrame: number;
}> = ({ bodyColor, isHe, showHeart, isNodding, spriteFrame }) => {
  const sprites = isHe ? OVIDIU_SPRITES : ANTONIA_SPRITES;
  const currentSprite = sprites[spriteFrame % sprites.length];

  return (
    <div className="flex flex-col items-center relative">
      {showHeart && (
        <div className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2">
          <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 fill-red-500 animate-float" />
        </div>
      )}

      {/* Head with sprite */}
      <div className={`relative ${isNodding ? 'animate-nod' : ''}`}>
        <img
          src={currentSprite}
          alt={isHe ? "Ovidiu" : "Antonia"}
          className="w-16 h-16 sm:w-24 sm:h-24 object-cover object-top"
        />
      </div>

      {/* Body */}
      <div className={`w-10 h-10 sm:w-16 sm:h-16 ${bodyColor} border-2 border-black relative -mt-2`}>
        {isHe && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[6px] sm:text-[8px] font-pixel text-white/50 tracking-tighter">GYM</span>
          </div>
        )}
        {/* Arms */}
        <div className={`absolute -left-2 sm:-left-3 top-1 sm:top-2 w-2 h-6 sm:w-3 sm:h-10 ${isHe ? 'bg-amber-200' : 'bg-pink-200'} border-2 border-black`}></div>
        <div className={`absolute -right-2 sm:-right-3 top-1 sm:top-2 w-2 h-6 sm:w-3 sm:h-10 ${isHe ? 'bg-amber-200' : 'bg-pink-200'} border-2 border-black`}></div>
      </div>

      {/* Legs */}
      <div className="flex">
        <div className="w-4 h-6 sm:w-6 sm:h-10 bg-gray-900 border-2 border-black border-t-0"></div>
        <div className="w-4 h-6 sm:w-6 sm:h-10 bg-gray-900 border-2 border-black border-t-0 border-l-0"></div>
      </div>

      {/* Shoes */}
      <div className="flex">
        <div className="w-5 h-2 sm:w-7 sm:h-3 bg-white border-2 border-black -ml-1"></div>
        <div className="w-5 h-2 sm:w-7 sm:h-3 bg-white border-2 border-black -mr-1"></div>
      </div>
    </div>
  );
};

export const MeetingScene: React.FC<MeetingSceneProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [noBtnPos, setNoBtnPos] = useState<React.CSSProperties>({ position: 'relative' as const });
  const [stars, setStars] = useState<Array<{top: number, left: number, delay: number, size: number}>>([]);
  const [spriteFrame, setSpriteFrame] = useState(0);

  // Cycle sprite frames every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSpriteFrame(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate stars once on mount
    const generatedStars = [...Array(40)].map(() => ({
      top: Math.random() * 60,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() > 0.8 ? 2 : 1
    }));
    setStars(generatedStars);
  }, []);

  const moveNoButton = () => {
    // Play goofy sound when NO button runs away
    playGoofySound(0.4);

    const randomX = Math.random() * 150 - 75;
    const randomY = Math.random() * 100 - 50;
    setNoBtnPos({
      position: 'relative' as const,
      top: `${randomY}px`,
      left: `${randomX}px`,
      transition: 'all 0.15s ease-out'
    });
  };

  const handleYes = () => {
    playButtonSound();
    playDaSound();
    setStep(2);
    setTimeout(() => {
      setStep(3);
      // Play kiss sound when they kiss
      playKissSound();
      window.confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff0044', '#ffcccc', '#ff69b4', '#ffd700']
      });
      setTimeout(onComplete, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-indigo-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Stars Background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              width: `${star.size * 2}px`,
              height: `${star.size * 2}px`,
              boxShadow: star.size > 1 ? '0 0 6px 2px rgba(255,255,255,0.3)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Moon with crater details */}
      <div className="absolute top-4 sm:top-8 right-4 sm:right-12 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-[0_0_60px_20px_rgba(255,255,200,0.3)] overflow-hidden">
        <div className="absolute top-2 sm:top-3 left-2 sm:left-4 w-2 h-2 sm:w-4 sm:h-4 bg-yellow-300/40 rounded-full"></div>
        <div className="absolute top-4 sm:top-8 right-2 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300/30 rounded-full"></div>
        <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-6 w-1 h-1 sm:w-2 sm:h-2 bg-yellow-300/30 rounded-full"></div>
      </div>

      {/* Main Scene Container */}
      <div className="relative w-full max-w-2xl h-64 sm:h-96 flex items-end justify-center mb-4 sm:mb-8">

        {/* Lamp Post */}
        <div className="absolute left-8 sm:left-16 bottom-8 flex flex-col items-center z-20">
          {/* Light glow */}
          <div className="absolute -top-2 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl"></div>
          <div className="absolute top-0 w-16 h-16 bg-yellow-300/40 rounded-full blur-xl"></div>

          {/* Lamp head */}
          <div className="relative z-10">
            <div className="w-10 h-3 bg-gray-800 border-2 border-black rounded-t-sm"></div>
            <div className="w-8 h-6 bg-yellow-200 border-2 border-black mx-auto shadow-[0_0_20px_5px_rgba(255,255,150,0.5)]"></div>
          </div>

          {/* Lamp arm */}
          <div className="w-12 h-2 bg-gray-700 border-2 border-black -mt-1"></div>

          {/* Lamp post */}
          <div className="w-3 h-48 bg-gradient-to-b from-gray-700 to-gray-800 border-2 border-black"></div>

          {/* Base */}
          <div className="w-8 h-3 bg-gray-800 border-2 border-black rounded-sm"></div>
        </div>

        {/* Park/Scene area */}
        <div className="relative z-10 mb-12">

          {/* The Bench - improved design */}
          <div className="relative scale-75 sm:scale-100">
            {/* Bench seat */}
            <div className="w-72 h-5 bg-gradient-to-b from-amber-700 to-amber-800 border-2 border-black rounded-sm shadow-lg"></div>
            {/* Bench back */}
            <div className="absolute -top-10 left-2 right-2 h-8 bg-gradient-to-b from-amber-600 to-amber-700 border-2 border-black rounded-t-sm">
              {/* Wood grain lines */}
              <div className="absolute top-2 left-4 right-4 h-[2px] bg-amber-900/30"></div>
              <div className="absolute top-5 left-4 right-4 h-[2px] bg-amber-900/30"></div>
            </div>
            {/* Bench legs */}
            <div className="absolute -bottom-10 left-6 w-5 h-10 bg-gray-700 border-2 border-black"></div>
            <div className="absolute -bottom-10 right-6 w-5 h-10 bg-gray-700 border-2 border-black"></div>
            {/* Leg supports */}
            <div className="absolute -bottom-6 left-4 w-9 h-2 bg-gray-600 border-2 border-black"></div>
            <div className="absolute -bottom-6 right-4 w-9 h-2 bg-gray-600 border-2 border-black"></div>
          </div>

          {/* Gym bags */}
          <div className="absolute -bottom-6 -right-16 z-0">
            <div className="w-10 h-8 bg-blue-800 border-2 border-black rounded-sm rotate-6">
              <div className="w-6 h-1 bg-blue-600 border border-black mx-auto mt-1"></div>
            </div>
          </div>

          {/* Characters on bench */}
          <div className={`flex items-end absolute -top-[140px] transition-all duration-1000 ease-in-out ${step === 3 ? 'gap-0 left-12' : 'gap-4 left-8'}`}>

            {/* Speech bubble */}
            {step === 1 && (
              <div className="absolute -top-20 left-0 bg-white border-3 border-black px-4 py-2 rounded-xl shadow-lg z-30 animate-bounce-slow">
                <span className="font-pixel text-[10px] text-black">DA sau NU?</span>
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r-2 border-b-2 border-black transform rotate-45"></div>
              </div>
            )}

            {/* HE - Ovidiu */}
            <PixelCharacter
              bodyColor="bg-gray-700"
              isHe={true}
              showHeart={step === 3}
              spriteFrame={spriteFrame}
            />

            {/* SHE - Antonia */}
            <PixelCharacter
              bodyColor="bg-pink-500"
              isNodding={step === 2}
              showHeart={step === 3}
              spriteFrame={spriteFrame}
            />
          </div>
        </div>

        {/* Ground with grass texture */}
        <div className="absolute bottom-0 w-[130%] -left-[15%]">
          {/* Grass layer */}
          <div className="h-10 bg-gradient-to-b from-green-700 to-green-800 border-t-4 border-green-900 relative overflow-hidden">
            {/* Grass blades */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 w-1 bg-green-600"
                style={{
                  left: `${i * 3.5}%`,
                  height: `${4 + Math.random() * 6}px`,
                  transform: `rotate(${Math.random() * 20 - 10}deg)`
                }}
              />
            ))}
          </div>
          {/* Path */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-full bg-gradient-to-b from-stone-600 to-stone-700 rounded-t-full opacity-60"></div>
        </div>
      </div>

      {/* UI Controls - improved dialog box */}
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-4 border-white rounded-lg p-5 font-pixel text-white text-center z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 text-[8px] border-2 border-black">
          CAPITOLUL 1
        </div>

        {step === 0 && (
          <div className="space-y-5 pt-2">
            <p className="text-sm md:text-base leading-relaxed">
              Ne întorceam de la sală...<br/>
              <span className="text-purple-400 text-xs mt-2 block">Era momentul decisiv.</span>
            </p>
            <button
              onClick={() => { playButtonSound(); setStep(1); playDaSauNuSound(); }}
              className="bg-gradient-to-b from-white to-gray-200 text-black px-6 py-3 hover:from-gray-100 hover:to-gray-300 border-b-4 border-gray-500 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto rounded-sm"
            >
              <span>Întreab-o</span>
              <Dumbbell className="w-4 h-4"/>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 pt-2">
            <p className="text-yellow-300 text-sm">Ce răspunde ea?</p>
            <div className="flex justify-center gap-6 relative min-h-[60px] items-center">
              <button
                onClick={handleYes}
                className="bg-gradient-to-b from-green-400 to-green-600 text-white px-8 py-3 border-b-4 border-green-800 hover:from-green-500 hover:to-green-700 active:border-b-0 active:translate-y-1 transition-all rounded-sm font-bold shadow-lg"
              >
                DA 💕
              </button>

              <button
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton}
                style={noBtnPos}
                className="bg-gradient-to-b from-red-400 to-red-600 text-white px-8 py-3 border-b-4 border-red-800 cursor-not-allowed transition-all rounded-sm opacity-70"
              >
                NU
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-4">
            <p className="text-lg text-pink-400 animate-pulse">*Ea dă din cap fericit*</p>
            <div className="flex justify-center gap-1 mt-3">
              <span className="animate-bounce" style={{animationDelay: '0ms'}}>💕</span>
              <span className="animate-bounce" style={{animationDelay: '100ms'}}>💕</span>
              <span className="animate-bounce" style={{animationDelay: '200ms'}}>💕</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4 space-y-3">
            <h2 className="text-xl text-pink-400">Și apoi ne-am sărutat...</h2>
            <p className="text-xs text-gray-400 animate-pulse">Se încarcă restul poveștii...</p>
            <div className="flex justify-center gap-2 text-2xl">
              <span className="animate-float">💑</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        @keyframes nod {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-nod {
          animation: nod 0.3s ease-in-out 3;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};