import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { PARTNER_NAME } from '../constants';
import { PixelCard } from './PixelCard';
import { playButtonSound } from '../utils/sounds';

// Sprite paths
const OVIDIU_SPRITES = [
  '/imagini/Sprites/Ovidiu/3.png',
  '/imagini/Sprites/Ovidiu/4.png'
];

const ANTONIA_SPRITES = [
  '/imagini/Sprites/Antonia/1.png',
  '/imagini/Sprites/Antonia/2.png'
];

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [spriteFrame, setSpriteFrame] = useState(0);

  // Cycle sprite frames every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSpriteFrame(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    playButtonSound();
    // Trigger confetti
    window.confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0044', '#ffd700', '#ffffff']
    });

    // Slight delay before state change
    setTimeout(onStart, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pixel-pink text-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-4 md:left-10 animate-bounce-slow text-2xl md:text-4xl">☁️</div>
      <div className="absolute top-20 right-4 md:right-20 animate-bounce-slow text-3xl md:text-5xl" style={{ animationDelay: '1s' }}>☁️</div>

      <PixelCard className="max-w-md w-full z-10 mx-4">
        <h1 className="font-pixel text-lg sm:text-2xl md:text-3xl text-pixel-red mb-4 md:mb-6 leading-relaxed">
          Povestea Noastră<br/>
          <span className="text-xs sm:text-sm text-black mt-2 block">{PARTNER_NAME} Edition</span>
        </h1>

        <div className="flex justify-center items-end gap-2 sm:gap-4 my-6 sm:my-8 h-32 sm:h-40">
           {/* Ovidiu */}
           <div className="flex flex-col items-center">
             <img
               src={OVIDIU_SPRITES[spriteFrame % 2]}
               alt="Ovidiu"
               className="w-14 h-14 sm:w-20 sm:h-20 object-cover object-top"
             />
             <div className="w-8 h-10 sm:w-10 sm:h-12 bg-gray-700 border-2 border-black -mt-1"></div>
             <div className="text-[8px] sm:text-[10px] font-pixel mt-2">Eu</div>
           </div>

           <div className="flex flex-col items-center">
              <div className="bg-amber-800 text-white p-1 sm:p-2 border-2 border-black font-pixel text-[8px] sm:text-xs transform -rotate-12">
                25 Mai<br/>2024
              </div>
              <div className="w-2 h-12 sm:h-16 bg-amber-900 border-2 border-black"></div>
           </div>

           {/* Antonia */}
           <div className="flex flex-col items-center">
             <img
               src={ANTONIA_SPRITES[spriteFrame % 2]}
               alt="Antonia"
               className="w-14 h-14 sm:w-20 sm:h-20 object-cover object-top"
             />
             <div className="w-8 h-10 sm:w-10 sm:h-12 bg-pink-500 border-2 border-black -mt-1"></div>
             <div className="text-[8px] sm:text-[10px] font-pixel mt-2">Tu</div>
           </div>
        </div>

        <button
          onClick={handleClick}
          className="bg-pixel-red text-white font-pixel py-3 sm:py-4 px-6 sm:px-8 text-xs sm:text-sm border-b-4 border-r-4 border-black hover:bg-red-600 active:border-b-0 active:border-r-0 active:mt-1 pixel-btn transition-all flex items-center justify-center gap-2 mx-auto w-full"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          START AVENTURĂ
        </button>
      </PixelCard>
    </div>
  );
};