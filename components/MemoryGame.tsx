import React, { useState, useEffect } from 'react';
import { MEMORY_CARDS } from '../constants';
import { PixelCard } from './PixelCard';
import { Brain, Star } from 'lucide-react';

interface MemoryGameProps {
  onComplete: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<typeof MEMORY_CARDS>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // Shuffle cards on mount
    const shuffled = [...MEMORY_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleClick = (id: number) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

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
               return (
                 <button
                   key={card.id}
                   onClick={() => handleClick(card.id)}
                   className={`
                     aspect-square border-2 border-black font-pixel text-2xl flex items-center justify-center transition-all duration-300
                     ${isFlipped ? 'bg-white rotate-y-180' : 'bg-pixel-red pattern-zigzag'}
                     ${solved.includes(card.id) ? 'opacity-50' : ''}
                   `}
                   disabled={isFlipped || disabled}
                 >
                   {isFlipped ? card.content : '?'}
                 </button>
               );
             })}
           </div>
        </PixelCard>

        {isGameComplete && (
          <button 
            onClick={onComplete}
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
      `}</style>
    </div>
  );
};