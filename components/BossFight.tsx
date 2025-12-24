import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, Shield, Sparkles } from 'lucide-react';
import { BATTLE_MOVES, BATTLE_PHOTOS, PARTNER_NAME } from '../constants';
import { playHitSoundLoud, playKOSound, playButtonSound, playGoofySound, playAwwSound, playAngrySound } from '../utils/sounds';

const HAPPY_CAT_IMAGES = [
  '/imagini/cat_love/cat-cat-love.png',
  '/imagini/cat_love/8948d8ff510160d42c81f25312686f78.jpg'
];

const ANGRY_CAT_IMAGES = [
  '/imagini/cat_angry/angry-cat-look-so-cute-v0-ejd1cnVqeXpxMzVkMb8jJq4INQakE2TcNQQ2RDZN0R_STwGaDU6BCN3K78I8.webp',
  '/imagini/cat_angry/images (2).jpeg'
];

// Sprite paths
const OVIDIU_SPRITES = [
  '/imagini/Sprites/Ovidiu/3.png',
  '/imagini/Sprites/Ovidiu/4.png'
];

const ANTONIA_SPRITES = [
  '/imagini/Sprites/Antonia/1.png',
  '/imagini/Sprites/Antonia/2.png'
];

interface BossFightProps {
  onComplete: () => void;
}

interface FloatingPhoto {
  id: number;
  url: string;
  x: number;
  y: number;
}

interface FallingCat {
  id: number;
  x: number;
  image: string;
  delay: number;
  size: number;
}

export const BossFight: React.FC<BossFightProps> = ({ onComplete }) => {
  const [enemyHp, setEnemyHp] = useState(100); // Represents "Supărare" (Upset level)
  const [playerHp, setPlayerHp] = useState(100); // Represents "Patience"
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [message, setMessage] = useState("A început cearta! Cucerește-o!");
  const [floatingPhotos, setFloatingPhotos] = useState<FloatingPhoto[]>([]);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [isKo, setIsKo] = useState(false);

  // Animation states for characters
  const [playerAction, setPlayerAction] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [enemyAction, setEnemyAction] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [spriteFrame, setSpriteFrame] = useState(0);
  const [fallingCats, setFallingCats] = useState<FallingCat[]>([]);

  // Cycle sprite frames every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSpriteFrame(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAttack = (move: typeof BATTLE_MOVES[0]) => {
    if (turn !== 'player' || isKo) return;

    playButtonSound();

    // 1. Player Attacks
    setMessage(`Ai folosit ${move.name}!`);
    setPlayerAction('attack');
    
    setTimeout(() => {
      // 2. Impact
      playHitSoundLoud(); // Play hit sound on impact
      playAwwSound(); // Happy sound when you attack

      // Spawn falling happy cats
      const newCats: FallingCat[] = [];
      for (let i = 0; i < 10; i++) {
        newCats.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          image: HAPPY_CAT_IMAGES[Math.floor(Math.random() * HAPPY_CAT_IMAGES.length)],
          delay: Math.random() * 0.3,
          size: 30 + Math.random() * 30
        });
      }
      setFallingCats(newCats);
      setTimeout(() => setFallingCats([]), 2000);

      setShakeScreen(true);
      setEnemyAction('hit');
      const dmg = move.dmg + Math.floor(Math.random() * 5);
      const newHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(newHp);
      
      // Spawn Floating Photo
      const randomPhoto = BATTLE_PHOTOS[Math.floor(Math.random() * BATTLE_PHOTOS.length)];
      const newPhoto: FloatingPhoto = {
        id: Date.now(),
        url: randomPhoto,
        x: Math.random() * 60 + 20, // Random X position 20-80%
        y: 50
      };
      setFloatingPhotos(prev => [...prev, newPhoto]);

      // Cleanup photo after animation
      setTimeout(() => {
        setFloatingPhotos(prev => prev.filter(p => p.id !== newPhoto.id));
      }, 2000);
      
      setTimeout(() => setShakeScreen(false), 300);

      if (newHp === 0) {
        handleWin();
      } else {
        setTurn('enemy');
        setPlayerAction('idle');
        setTimeout(() => setEnemyAction('idle'), 500);
        
        // Enemy counter-attack logic
        setTimeout(() => handleEnemyTurn(), 1500);
      }
    }, 400);
  };

  const handleEnemyTurn = () => {
    if (isKo) return;
    
    setEnemyAction('attack');
    setMessage(`${PARTNER_NAME} se face că e supărată...`);

    setTimeout(() => {
      playHitSoundLoud(); // Play hit sound when enemy attacks
      playAngrySound(); // Angry sound when enemy attacks

      // Spawn falling angry cats
      const newCats: FallingCat[] = [];
      for (let i = 0; i < 10; i++) {
        newCats.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          image: ANGRY_CAT_IMAGES[Math.floor(Math.random() * ANGRY_CAT_IMAGES.length)],
          delay: Math.random() * 0.3,
          size: 30 + Math.random() * 30
        });
      }
      setFallingCats(newCats);
      setTimeout(() => setFallingCats([]), 2000);

      setPlayerAction('hit');
      setShakeScreen(true);
      setPlayerHp(prev => Math.max(0, prev - 10));
      setTimeout(() => setShakeScreen(false), 300);

      setTimeout(() => {
        setPlayerAction('idle');
        setEnemyAction('idle');
        setTurn('player');
        setMessage("E rândul tău! Fă-o să zâmbească!");
      }, 1000);
    }, 400);
  };

  const handleWin = () => {
    setIsKo(true);
    playKOSound(); // Play KO sound effect
    setMessage("K.O. (KISS OUT)! AI CÂȘTIGAT INIMA EI!");
    window.confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    setTimeout(onComplete, 4000);
  };

  return (
    <div className={`min-h-screen bg-slate-900 flex flex-col items-center justify-between p-4 relative overflow-hidden ${shakeScreen ? 'animate-shake' : ''}`}>
      
      {/* Background Pixel Art Vibe */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>

      {/* --- HUD (Heads Up Display) --- */}
      <div className="w-full max-w-2xl z-20 flex justify-between items-start pt-4 gap-4">
        {/* Player Health */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 border-2 border-white overflow-hidden">
                <img src={OVIDIU_SPRITES[spriteFrame % 2]} alt="Ovidiu" className="w-full h-full object-cover object-top" />
            </div>
            <span className="font-pixel text-yellow-400 text-xs shadow-black drop-shadow-md">RĂBDARE</span>
          </div>
          <div className="h-6 w-full bg-gray-700 border-2 border-white relative skew-x-[-10deg]">
             <div 
               className="h-full bg-yellow-400 transition-all duration-300" 
               style={{ width: `${playerHp}%` }}
             ></div>
          </div>
        </div>

        {/* VS Badge */}
        <div className="font-pixel text-2xl text-red-500 animate-pulse italic mt-2">VS</div>

        {/* Enemy Health */}
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 mb-1 justify-end">
             <span className="font-pixel text-pink-500 text-xs shadow-black drop-shadow-md">SUPĂRARE</span>
             <div className="w-10 h-10 border-2 border-white overflow-hidden">
                <img src={ANTONIA_SPRITES[spriteFrame % 2]} alt="Antonia" className="w-full h-full object-cover object-top" />
             </div>
          </div>
          <div className="h-6 w-full bg-gray-700 border-2 border-white relative skew-x-[10deg]">
             <div 
               className="h-full bg-pink-500 transition-all duration-300 ml-auto" 
               style={{ width: `${enemyHp}%` }}
             ></div>
          </div>
        </div>
      </div>

      {/* --- BATTLE ARENA --- */}
      <div className="flex-1 w-full max-w-3xl flex justify-between items-end relative z-10 px-4 md:px-20 pb-20">
        
        {/* Floating Photos Overlay */}
        {floatingPhotos.map(photo => (
           <div 
             key={photo.id}
             className="absolute w-24 h-24 border-4 border-white bg-white shadow-xl rotate-6 animate-float-up z-30"
             style={{ left: `${photo.x}%`, bottom: '20%' }}
           >
             <img src={photo.url} className="w-full h-full object-cover" alt="Memory" />
           </div>
        ))}

        {/* Player Sprite */}
        <div className={`transition-transform duration-200 ${playerAction === 'attack' ? 'translate-x-20' : ''} ${playerAction === 'hit' ? '-translate-x-10 opacity-50' : ''}`}>
           <div className="flex flex-col items-center animate-bounce-slow">
              {/* Head */}
              <img
                src={OVIDIU_SPRITES[spriteFrame % 2]}
                alt="Ovidiu"
                className="w-24 h-24 md:w-32 md:h-32 object-cover object-top"
              />
              {/* Body */}
              <div className="w-20 h-24 md:w-24 md:h-28 bg-gray-700 border-4 border-black relative -mt-2">
                {/* Arms */}
                <div className="absolute -left-4 top-2 w-4 h-12 bg-amber-200 border-2 border-black"></div>
                <div className={`absolute -right-4 top-2 w-4 h-12 bg-amber-200 border-2 border-black ${playerAction === 'attack' ? 'rotate-[-45deg] origin-top' : ''}`}></div>
              </div>
              {/* Effect when attacking */}
              {playerAction === 'attack' && (
                <div className="absolute -right-8 top-12 text-4xl">👊</div>
              )}
           </div>
           <div className="w-32 h-4 bg-black/30 rounded-full blur-md mt-2 mx-auto"></div>
        </div>

        {/* Enemy Sprite */}
        <div className={`transition-transform duration-200 ${enemyAction === 'attack' ? '-translate-x-20' : ''} ${enemyAction === 'hit' ? 'translate-x-10 opacity-50 filter grayscale' : ''}`}>
           <div className="flex flex-col items-center animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
              {/* Head */}
              <img
                src={ANTONIA_SPRITES[spriteFrame % 2]}
                alt="Antonia"
                className="w-24 h-24 md:w-32 md:h-32 object-cover object-top"
              />
              {/* Body */}
              <div className="w-20 h-24 md:w-24 md:h-28 bg-pink-500 border-4 border-black relative -mt-2">
                {/* Arms */}
                <div className={`absolute -left-4 top-2 w-4 h-12 bg-pink-200 border-2 border-black ${enemyAction === 'attack' ? 'rotate-[45deg] origin-top' : ''}`}></div>
                <div className="absolute -right-4 top-2 w-4 h-12 bg-pink-200 border-2 border-black"></div>
              </div>
           </div>
           <div className="w-32 h-4 bg-black/30 rounded-full blur-md mt-2 mx-auto"></div>
        </div>

        {/* KO Overlay */}
        {isKo && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
             <h1 className="text-8xl md:text-9xl font-pixel text-yellow-400 drop-shadow-[0_10px_0_rgba(0,0,0,1)] animate-pulse scale-150">
               K.O.
             </h1>
          </div>
        )}
      </div>

      {/* --- COMMAND CENTER --- */}
      <div className="w-full max-w-2xl bg-black border-t-4 border-l-4 border-r-4 border-white p-4 z-20 rounded-t-xl">
        <div className="mb-4 text-center">
          <p className="text-white font-pixel text-sm md:text-base animate-pulse">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
           {BATTLE_MOVES.map((move, idx) => (
             <button
               key={idx}
               disabled={turn !== 'player' || isKo}
               onClick={() => handleAttack(move)}
               className={`${move.color} text-white font-pixel py-3 px-2 border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 text-xs md:text-sm uppercase flex items-center justify-center gap-1`}
             >
                {move.name === 'Ciocolată' && <Sparkles className="w-3 h-3" />}
                {move.name === 'Scuze' && <Shield className="w-3 h-3" />}
                {move.name === 'Pupic Dulce' && <Heart className="w-3 h-3 fill-current" />}
                {move.name === 'Îmbrățișare' && <Zap className="w-3 h-3 fill-current" />}
                {move.name}
             </button>
           ))}
        </div>
      </div>

      {/* Falling cats rain */}
      {fallingCats.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {fallingCats.map(cat => (
            <img
              key={cat.id}
              src={cat.image}
              alt="Falling cat"
              className="absolute animate-fall-down rounded-lg"
              style={{
                left: `${cat.x}%`,
                top: '-80px',
                width: `${cat.size}px`,
                animationDelay: `${cat.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-50px) rotate(5deg) scale(1); }
          80% { opacity: 1; }
          100% { transform: translateY(-200px) rotate(-5deg) scale(1.1); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fall-down {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(120vh) rotate(360deg);
            opacity: 0.8;
          }
        }
        .animate-fall-down {
          animation: fall-down 1.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};