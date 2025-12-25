import React, { useState, useRef } from 'react';
import { PixelCard } from './PixelCard';
import { playButtonSound, playAngrySound, playSliderSound, playSliderWrongSound } from '../utils/sounds';

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
  const [hasStartedSliding, setHasStartedSliding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spriteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);

    // Play slider sound only once when starting to slide
    if (!hasStartedSliding) {
      setHasStartedSliding(true);
      playSliderSound();
    }

    // Clear any previous message when sliding
    setMessage('');
  };

  const handleConfirm = () => {
    playButtonSound();

    if (sliderValue < 100) {
      playSliderWrongSound();
      // Show different messages based on value
      if (sliderValue < 30) {
        setMessage('Asta crezi despre mine?! 😏');
      } else if (sliderValue < 60) {
        setMessage('Hmmm, sigur doar atât? 🤨');
      } else if (sliderValue < 90) {
        setMessage('Mai gândește-te! 😼');
      } else {
        setMessage('Aproape... dar nu chiar! 😏');
      }
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

      <div className="bg-black text-white font-pixel p-2 text-center mb-4 sm:mb-8 border-2 border-white w-full max-w-lg z-10 text-[10px] sm:text-sm mx-4">
        NIVELUL SPECIAL: CÂT DE MULT TE IUBESC?
      </div>

      {phase === 'sliding' && (
        <PixelCard className="max-w-lg w-full z-10 mx-4">
          <div className="text-center">
            <h2 className="font-pixel text-sm sm:text-lg mb-4 sm:mb-6">
              Cât de mult crezi că te iubesc? 💕
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
              <div className="flex justify-between text-[10px] sm:text-xs font-pixel mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="text-4xl sm:text-6xl font-pixel text-pixel-red mb-4">
              {sliderValue}%
            </div>

            {message && (
              <p className="font-pixel text-xs sm:text-sm text-red-500 mb-4 animate-bounce">
                {message}
              </p>
            )}

            <button
              onClick={handleConfirm}
              className="bg-pixel-pink text-white font-pixel py-2 sm:py-3 px-6 sm:px-8 text-xs sm:text-sm border-b-4 border-r-4 border-black hover:bg-pink-600 active:border-b-0 active:border-r-0"
            >
              CONFIRMĂ 💖
            </button>
          </div>
        </PixelCard>
      )}

      {phase === 'angry' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/90 p-4">
          <img
            src={ANGRY_CAT_IMAGES[Math.floor(Math.random() * ANGRY_CAT_IMAGES.length)]}
            alt="Angry cat"
            className="w-32 sm:w-48 h-auto border-4 border-white rounded-lg mb-4 sm:mb-6 animate-shake"
          />
          <p className="font-pixel text-sm sm:text-xl text-white text-center px-4 w-full">
            Doar 100%?! Atât de puțin crezi?!
          </p>
          <p className="font-pixel text-xs sm:text-lg text-pink-400 mt-2 sm:mt-4 animate-pulse text-center w-full">
            Stai să-ți arăt eu realitatea... 😼
          </p>
        </div>
      )}

      {phase === 'rocket' && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Space background gradient */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: rocketValue < 300
                ? 'linear-gradient(to top, #fce7f3, #f9a8d4, #c084fc, #6366f1)'
                : rocketValue < 600
                ? 'linear-gradient(to top, #c084fc, #6366f1, #1e1b4b, #0f0a1e)'
                : 'linear-gradient(to top, #1e1b4b, #0f0a1e, #000000, #000000)'
            }}
          />

          {/* Stars appearing as we go higher */}
          {rocketValue > 200 && (
            <div className="absolute inset-0">
              {[...Array(Math.min(50, Math.floor((rocketValue - 200) / 10)))].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-twinkle"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() > 0.7 ? 3 : 2}px`,
                    height: `${Math.random() > 0.7 ? 3 : 2}px`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Moon appearing at high values */}
          {rocketValue > 700 && (
            <div
              className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-[0_0_40px_15px_rgba(255,255,200,0.4)] animate-pulse"
              style={{ opacity: Math.min(1, (rocketValue - 700) / 200) }}
            />
          )}

          {/* Main content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {/* Slider track going up */}
            <div className="relative h-48 sm:h-80 w-6 sm:w-8 bg-gray-800 border-4 border-white rounded-full overflow-hidden mb-4">
              {/* Fill that goes up */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 via-red-500 to-yellow-400 transition-all duration-100"
                style={{ height: `${Math.min(100, rocketValue / 10)}%` }}
              />

              {/* Rocket on the slider */}
              <div
                className="absolute left-1/2 -translate-x-1/2 text-3xl transition-all duration-100"
                style={{ bottom: `${Math.min(95, rocketValue / 10)}%` }}
              >
                🚀
              </div>
            </div>

            {/* Percentage display */}
            <div className="text-4xl sm:text-6xl font-pixel text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              {rocketValue >= 1000 ? '∞%' : `${rocketValue}%`}
            </div>

            {/* Messages at different stages */}
            <p className="font-pixel text-xs sm:text-lg mt-2 sm:mt-4 text-center px-4" style={{
              color: rocketValue < 300 ? '#fff' : rocketValue < 600 ? '#f9a8d4' : '#fbbf24'
            }}>
              {rocketValue < 300 && "Uite cât te iubesc de fapt! 🚀"}
              {rocketValue >= 300 && rocketValue < 500 && "Mai mult decât crezi! ✨"}
              {rocketValue >= 500 && rocketValue < 700 && "Mult mai mult! 🌟"}
              {rocketValue >= 700 && rocketValue < 900 && "Până la lună și înapoi! 🌙"}
              {rocketValue >= 900 && "TE IUBESC LA INFINIT! 💕"}
            </p>
          </div>

          {/* Exhaust particles */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-orange-500 rounded-full animate-exhaust"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.6 - i * 0.05
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popup with dancing characters and video */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-gradient-to-b from-pink-400 via-pink-300 to-pink-200 p-2 sm:p-4">
          <div className="bg-white border-4 border-black rounded-lg p-3 sm:p-6 max-w-md w-full relative animate-popup-in shadow-2xl mx-2">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-black font-pixel text-base sm:text-xl hover:bg-red-600 z-10"
            >
              X
            </button>

            {/* Title */}
            <h2 className="font-pixel text-center text-xs sm:text-lg text-pixel-red mb-2 sm:mb-4">
              TE IUBESC LA INFINIT %! 💕
            </h2>

            {/* Video */}
            <div className="mb-2 sm:mb-4 border-2 border-black">
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
            <div className="flex justify-center items-end gap-4 sm:gap-8">
              {/* Ovidiu dancing */}
              <div className="flex flex-col items-center animate-dance-left">
                <img
                  src={OVIDIU_SPRITES[spriteFrame % 2]}
                  alt="Ovidiu"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-cover object-top"
                />
                <div className="w-8 h-10 sm:w-12 sm:h-14 bg-gray-700 border-2 border-black -mt-1"></div>
              </div>

              {/* Hearts between them */}
              <div className="flex flex-col items-center gap-1 animate-pulse">
                <span className="text-lg sm:text-2xl">💕</span>
                <span className="text-base sm:text-xl">💖</span>
                <span className="text-lg sm:text-2xl">💕</span>
              </div>

              {/* Antonia dancing */}
              <div className="flex flex-col items-center animate-dance-right">
                <img
                  src={ANTONIA_SPRITES[spriteFrame % 2]}
                  alt="Antonia"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-cover object-top"
                />
                <div className="w-8 h-10 sm:w-12 sm:h-14 bg-pink-500 border-2 border-black -mt-1"></div>
              </div>
            </div>

            <p className="font-pixel text-[10px] sm:text-xs text-center mt-2 sm:mt-4 text-gray-600">
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
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes exhaust {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(100px) scale(0.2); opacity: 0; }
        }
        .animate-exhaust {
          animation: exhaust 0.8s ease-out infinite;
        }
      `}</style>
    </div>
  );
};
