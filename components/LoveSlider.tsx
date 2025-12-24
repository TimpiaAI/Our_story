import React, { useState, useRef } from 'react';
import { PixelCard } from './PixelCard';
import { playButtonSound, playAngrySound } from '../utils/sounds';

const ANGRY_CAT_IMAGES = [
  '/imagini/cat_angry/angry-cat-look-so-cute-v0-ejd1cnVqeXpxMzVkMb8jJq4INQakE2TcNQQ2RDZN0R_STwGaDU6BCN3K78I8.webp',
  '/imagini/cat_angry/images (2).jpeg'
];

const OVIDIU_SPRITES = [
  '/imagini/Sprites/Ovidiu/3.png',
  '/imagini/Sprites/Ovidiu/4.png'
];

const ANTONIA_SPRITES = [
  '/imagini/Sprites/Antonia/1.png',
  '/imagini/Sprites/Antonia/2.png'
];

interface LoveSliderProps {
  onComplete: () => void;
}

export const LoveSlider: React.FC<LoveSliderProps> = ({ onComplete }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<'sliding' | 'angry' | 'rocket' | 'popup'>('sliding');
  const [rocketValue, setRocketValue] = useState(100);
  const [showPopup, setShowPopup] = useState(false);
  const [spriteFrame, setSpriteFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spriteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);

    if (value < 30) {
      setMessage('Atât de puțin?! 😢');
    } else if (value < 60) {
      setMessage('Credeam că mai mult... 🥺');
    } else if (value < 90) {
      setMessage('Mai încearcă! 💪');
    } else if (value < 100) {
      setMessage('Aproape! Mai sus! 💕');
    } else {
      setMessage('');
    }
  };

  const handleConfirm = () => {
    playButtonSound();

    if (sliderValue < 100) {
      playAngrySound();
      setMessage('NU! Trebuie să fie 100%! 😤');
      return;
    }

    // Value is 100 - trigger the angry cat takeover
    playAngrySound();
    setPhase('angry');

    setTimeout(() => {
      setPhase('rocket');
      // Animate the slider going up
      let currentValue = 100;
      const interval = setInterval(() => {
        currentValue += 20;
        setRocketValue(currentValue);
        if (currentValue >= 1000) {
          clearInterval(interval);
          // Show the popup with dancing characters
          setPhase('popup');
          setShowPopup(true);

          // Start sprite animation
          spriteIntervalRef.current = setInterval(() => {
            setSpriteFrame(prev => prev + 1);
          }, 300);

          // Play video
          if (videoRef.current) {
            videoRef.current.volume = 1.0;
            videoRef.current.play().catch(() => {});
          }
        }
      }, 80);
    }, 2500);
  };

  const closePopup = () => {
    // Stop video and music
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    // Stop sprite animation
    if (spriteIntervalRef.current) {
      clearInterval(spriteIntervalRef.current);
    }
    setShowPopup(false);
    // Complete the level
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      <div className="bg-black text-white font-pixel p-2 text-center mb-8 border-2 border-white w-full max-w-lg z-10">
        NIVELUL SPECIAL: CÂT DE MULT TE IUBESC?
      </div>

      {phase === 'sliding' && (
        <PixelCard className="max-w-lg w-full z-10">
          <div className="text-center">
            <h2 className="font-pixel text-lg mb-6">
              Cât de mult te iubesc? 💕
            </h2>

            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-love"
              />
              <div className="flex justify-between text-xs font-pixel mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="text-6xl font-pixel text-pixel-red mb-4">
              {sliderValue}%
            </div>

            {message && (
              <p className="font-pixel text-sm text-red-500 mb-4 animate-bounce">
                {message}
              </p>
            )}

            <button
              onClick={handleConfirm}
              className="bg-pixel-pink text-white font-pixel py-3 px-8 border-b-4 border-r-4 border-black hover:bg-pink-600 active:border-b-0 active:border-r-0"
            >
              CONFIRMĂ 💖
            </button>
          </div>
        </PixelCard>
      )}

      {phase === 'angry' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/90">
          <img
            src={ANGRY_CAT_IMAGES[Math.floor(Math.random() * ANGRY_CAT_IMAGES.length)]}
            alt="Angry cat"
            className="w-48 h-auto border-4 border-white rounded-lg mb-6 animate-shake"
          />
          <p className="font-pixel text-xl text-white text-center px-4">
            100%?! DOAR 100%?!
          </p>
          <p className="font-pixel text-lg text-pink-400 mt-4 animate-pulse">
            Lasă că ajustez eu... 😼
          </p>
        </div>
      )}

      {phase === 'rocket' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-b from-pink-400 to-pink-600">
          <p className="font-pixel text-white text-lg mb-8">
            Cât te iubesc de fapt:
          </p>
          <div className="text-7xl font-pixel text-white drop-shadow-lg">
            {rocketValue}%
          </div>
          <div className="mt-8 text-6xl animate-bounce">
            🚀
          </div>
        </div>
      )}

      {/* Popup with dancing characters and video */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/80 p-4">
          <div className="bg-white border-4 border-black rounded-lg p-6 max-w-md w-full relative animate-popup-in">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 rounded-full border-4 border-black font-pixel text-xl hover:bg-red-600 z-10"
            >
              X
            </button>

            {/* Title */}
            <h2 className="font-pixel text-center text-lg text-pixel-red mb-4">
              TE IUBESC 1000%! 💕
            </h2>

            {/* Video */}
            <div className="mb-4 border-2 border-black">
              <video
                ref={videoRef}
                src="/sfx/vfx/meniato.mp4"
                className="w-full"
                autoPlay
                loop
                playsInline
              />
            </div>

            {/* Dancing characters */}
            <div className="flex justify-center items-end gap-8">
              {/* Ovidiu dancing */}
              <div className="flex flex-col items-center animate-dance-left">
                <img
                  src={OVIDIU_SPRITES[spriteFrame % 2]}
                  alt="Ovidiu"
                  className="w-20 h-20 object-cover object-top"
                />
                <div className="w-12 h-14 bg-gray-700 border-2 border-black -mt-1"></div>
              </div>

              {/* Hearts between them */}
              <div className="flex flex-col items-center gap-1 animate-pulse">
                <span className="text-2xl">💕</span>
                <span className="text-xl">💖</span>
                <span className="text-2xl">💕</span>
              </div>

              {/* Antonia dancing */}
              <div className="flex flex-col items-center animate-dance-right">
                <img
                  src={ANTONIA_SPRITES[spriteFrame % 2]}
                  alt="Antonia"
                  className="w-20 h-20 object-cover object-top"
                />
                <div className="w-12 h-14 bg-pink-500 border-2 border-black -mt-1"></div>
              </div>
            </div>

            <p className="font-pixel text-xs text-center mt-4 text-gray-600">
              Click X pentru a continua 💝
            </p>
          </div>
        </div>
      )}

      <style>{`
        .slider-love::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 30px;
          height: 30px;
          background: #ff0044;
          border: 3px solid black;
          cursor: pointer;
        }
        .slider-love::-moz-range-thumb {
          width: 30px;
          height: 30px;
          background: #ff0044;
          border: 3px solid black;
          cursor: pointer;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        @keyframes popup-in {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-popup-in {
          animation: popup-in 0.5s ease-out;
        }
        @keyframes dance-left {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-dance-left {
          animation: dance-left 0.4s ease-in-out infinite;
        }
        @keyframes dance-right {
          0%, 100% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(0) rotate(-5deg); }
        }
        .animate-dance-right {
          animation: dance-right 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
