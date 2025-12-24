import React, { useState, useEffect, useMemo } from 'react';
import { MEMORY_CARDS } from '../constants';
import { PixelCard } from './PixelCard';
import { Brain, Star } from 'lucide-react';
import { playButtonSound, playGoofySound } from '../utils/sounds';

// Funny Romanian messages for silly cards
const FUNNY_MESSAGES = [
  "Hihiii, te iubesc!",
  "Pupici! 💋",
  "Tu ești preferata mea!",
  "Îmi place de tine!",
  "Ești frumoasă! 💕",
  "Te pup dulce!",
  "Hehehe, m-ai prins!",
  "Vreau îmbrățișări!",
  "Ești cea mai drăguță!",
  "💖 Iubi! 💖",
  "Mă topesc pentru tine!",
  "Ești minunată, Antonia!",
];

interface MemoryGameProps {
  onComplete: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<typeof MEMORY_CARDS>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [sillyCard, setSillyCard] = useState<number | null>(null);
  const [sillyAnimation, setSillyAnimation] = useState<string>('');
  const [funnyMessage, setFunnyMessage] = useState<string | null>(null);
  const [jumpingCard, setJumpingCard] = useState<number | null>(null);
  const [dizzyCard, setDizzyCard] = useState<number | null>(null);

  // Assign random silly behaviors to some cards (stable across renders)
  const sillyCards = useMemo(() => {
    const behaviors = ['jumpy', 'sleepy', 'shy', 'dizzy', 'dancer', 'scared'];
    const assigned: Record<number, string> = {};
    // Randomly assign 3-4 cards to have silly behaviors
    const cardIds = MEMORY_CARDS.map(c => c.id);
    for (let i = 0; i < 4; i++) {
      const randomId = cardIds[Math.floor(Math.random() * cardIds.length)];
      assigned[randomId] = behaviors[i % behaviors.length];
    }
    return assigned;
  }, []);

  useEffect(() => {
    // Shuffle cards on mount
    const shuffled = [...MEMORY_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  // Random silly events happening periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (cards.length === 0) return;

      // Pick a random unsolved card for silly behavior
      const unsolvedCards = cards.filter(c => !solved.includes(c.id) && !flipped.includes(c.id));
      if (unsolvedCards.length === 0) return;

      const randomCard = unsolvedCards[Math.floor(Math.random() * unsolvedCards.length)];
      const behavior = sillyCards[randomCard.id];

      if (behavior === 'jumpy') {
        playGoofySound(0.3);
        setJumpingCard(randomCard.id);
        setTimeout(() => setJumpingCard(null), 500);
      } else if (behavior === 'dizzy') {
        playGoofySound(0.3);
        setDizzyCard(randomCard.id);
        setTimeout(() => setDizzyCard(null), 1000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [cards, solved, flipped, sillyCards]);

  // Trigger silly animation when clicking a silly card
  const triggerSillyEvent = (cardId: number) => {
    const behavior = sillyCards[cardId];
    if (!behavior) return;

    // Play a goofy sound for silly cards
    playGoofySound(0.5);

    setSillyCard(cardId);
    setSillyAnimation(behavior);
    setFunnyMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);

    setTimeout(() => {
      setSillyCard(null);
      setSillyAnimation('');
      setFunnyMessage(null);
    }, 1500);
  };

  const handleClick = (id: number) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    // Trigger silly animation if this is a silly card
    triggerSillyEvent(id);

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      setFlipped([flipped[0], id]);
      
      const firstCard = cards.find(c => c.id === flipped[0]);
      const secondCard = cards.find(c => c.id === id);

      if (firstCard?.type === secondCard?.type) {
        setSolved([...solved, flipped[0], id]);
        setFlipped([]);
        setDisabled(false);
        // Mini celebration
        window.confetti({
             particleCount: 20,
             spread: 40,
             origin: { y: 0.6 },
             colors: ['#FFD700']
        });
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isGameComplete = solved.length === MEMORY_CARDS.length;

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-black text-white font-pixel p-2 text-center mb-6 border-2 border-white">
          NIVELUL 2: JOCUL AMINTIRILOR
        </div>

        <PixelCard className="mb-6">
           <p className="font-pixel text-xs text-center mb-4">
             Găsește perechile care ne definesc, Antonia! <br/>
             <span className="text-gray-500 text-[10px]">(Apasă pe cărți pentru a le întoarce)</span>
           </p>

           <div className="grid grid-cols-4 gap-2 sm:gap-4">
             {cards.map((card) => {
               const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
               const isSilly = sillyCard === card.id;
               const isJumping = jumpingCard === card.id;
               const isDizzy = dizzyCard === card.id;
               const behavior = sillyCards[card.id];

               // Build animation class
               let animationClass = '';
               if (isSilly && sillyAnimation === 'jumpy') animationClass = 'animate-jump';
               if (isSilly && sillyAnimation === 'sleepy') animationClass = 'animate-sleepy';
               if (isSilly && sillyAnimation === 'shy') animationClass = 'animate-shy';
               if (isSilly && sillyAnimation === 'dizzy') animationClass = 'animate-dizzy';
               if (isSilly && sillyAnimation === 'dancer') animationClass = 'animate-dance';
               if (isSilly && sillyAnimation === 'scared') animationClass = 'animate-scared';
               if (isJumping) animationClass = 'animate-random-jump';
               if (isDizzy) animationClass = 'animate-random-spin';

               return (
                 <div key={card.id} className="relative">
                   <button
                     onClick={() => handleClick(card.id)}
                     className={`
                       aspect-square border-2 border-black font-pixel text-2xl flex items-center justify-center transition-all duration-300 w-full
                       ${isFlipped ? 'bg-white' : 'bg-pixel-red pattern-zigzag'}
                       ${solved.includes(card.id) ? 'opacity-50 scale-95' : ''}
                       ${animationClass}
                       ${behavior && !isFlipped ? 'hover:animate-wiggle' : ''}
                     `}
                     disabled={isFlipped || disabled}
                   >
                     {isFlipped ? card.content : '?'}
                   </button>

                   {/* Funny message bubble */}
                   {isSilly && funnyMessage && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-2 py-1 rounded-lg text-[8px] font-pixel whitespace-nowrap z-10 animate-bounce-in">
                       {funnyMessage}
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
                     </div>
                   )}
                 </div>
               );
             })}
           </div>
        </PixelCard>

        {isGameComplete && (
          <button
            onClick={() => { playButtonSound(); onComplete(); }}
            className="w-full bg-green-500 text-white font-pixel py-4 border-b-4 border-r-4 border-black hover:bg-green-600 active:border-b-0 active:border-r-0 pixel-btn flex items-center justify-center gap-2 animate-bounce"
          >
            Nivel Complet! Spre Quiz <Star className="fill-current" />
          </button>
        )}
      </div>

      <style>{`
        .pattern-zigzag {
           background-image: repeating-linear-gradient(45deg, #ff0044 0, #ff0044 10px, #cc0033 0, #cc0033 20px);
        }

        /* Silly card animations */
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-20px) rotate(-5deg); }
          50% { transform: translateY(-10px); }
          75% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-jump { animation: jump 0.5s ease-out; }

        @keyframes sleepy {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg) translateY(5px); }
          50% { transform: rotate(5deg) translateY(3px); }
          75% { transform: rotate(-5deg) translateY(4px); }
        }
        .animate-sleepy { animation: sleepy 1.5s ease-in-out; }

        @keyframes shy {
          0% { transform: scale(1); }
          50% { transform: scale(0.8) rotate(-5deg); }
          100% { transform: scale(1); }
        }
        .animate-shy { animation: shy 0.8s ease-in-out; }

        @keyframes dizzy {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
          75% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-dizzy { animation: dizzy 0.6s ease-in-out; }

        @keyframes dance {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-5px) rotate(-10deg); }
          40% { transform: translateX(5px) rotate(10deg); }
          60% { transform: translateX(-3px) rotate(-5deg); }
          80% { transform: translateX(3px) rotate(5deg); }
        }
        .animate-dance { animation: dance 0.8s ease-in-out; }

        @keyframes scared {
          0%, 100% { transform: scale(1); }
          10%, 30%, 50%, 70%, 90% { transform: scale(1.05) translateX(-2px); }
          20%, 40%, 60%, 80% { transform: scale(1.05) translateX(2px); }
        }
        .animate-scared { animation: scared 0.5s ease-in-out; }

        @keyframes random-jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-random-jump { animation: random-jump 0.3s ease-out; }

        @keyframes random-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-random-spin { animation: random-spin 0.8s ease-in-out; }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .hover\\:animate-wiggle:hover { animation: wiggle 0.3s ease-in-out infinite; }

        @keyframes bounce-in {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};