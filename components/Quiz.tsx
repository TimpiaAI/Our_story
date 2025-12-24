import React, { useState } from 'react';
import { HeartCrack, Heart } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';
import { PixelCard } from './PixelCard';
import { playCorrectSound, playWrongSound, playButtonSound, playAngrySound, playAwwSound } from '../utils/sounds';

interface QuizProps {
  onComplete: () => void;
}

const HAPPY_CAT_IMAGES = [
  '/imagini/cat_love/cat-cat-love.png',
  '/imagini/cat_love/8948d8ff510160d42c81f25312686f78.jpg'
];

const ANGRY_CAT_IMAGES = [
  '/imagini/cat_angry/angry-cat-look-so-cute-v0-ejd1cnVqeXpxMzVkMb8jJq4INQakE2TcNQQ2RDZN0R_STwGaDU6BCN3K78I8.webp',
  '/imagini/cat_angry/images (2).jpeg'
];

interface FallingCat {
  id: number;
  x: number;
  image: string;
  delay: number;
  size: number;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const [showCatPopup, setShowCatPopup] = useState<'happy' | 'angry' | null>(null);
  const [catImage, setCatImage] = useState('');
  const [fallingCats, setFallingCats] = useState<FallingCat[]>([]);

  const currentQ = QUIZ_QUESTIONS[qIndex];

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === currentQ.correctAnswer) {
      playCorrectSound();
      playAwwSound();
      setFeedback({ type: 'success', msg: "Ești un geniu! Te iubesc!" });
      setCatImage(HAPPY_CAT_IMAGES[Math.floor(Math.random() * HAPPY_CAT_IMAGES.length)]);
      setShowCatPopup('happy');
      setTimeout(() => setShowCatPopup(null), 2000);

      // Spawn falling cats instead of confetti
      const newCats: FallingCat[] = [];
      for (let i = 0; i < 15; i++) {
        newCats.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          image: HAPPY_CAT_IMAGES[Math.floor(Math.random() * HAPPY_CAT_IMAGES.length)],
          delay: Math.random() * 0.5,
          size: 40 + Math.random() * 40
        });
      }
      setFallingCats(newCats);
      setTimeout(() => setFallingCats([]), 3000);

      setTimeout(() => {
        setFeedback(null);
        if (qIndex < QUIZ_QUESTIONS.length - 1) {
          setQIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 2000);
    } else {
      playWrongSound();
      playAngrySound();
      setFeedback({ type: 'error', msg: currentQ.wrongMessage });
      setCatImage(ANGRY_CAT_IMAGES[Math.floor(Math.random() * ANGRY_CAT_IMAGES.length)]);
      setShowCatPopup('angry');
      setTimeout(() => setShowCatPopup(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-4 relative">
       <div className="bg-black text-white font-pixel p-2 text-center mb-8 border-2 border-white w-full max-w-lg">
          NIVELUL 2: LOVE QUIZ
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-4 h-4 ${i < 3 - qIndex ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            ))}
          </div>
        </div>

      <PixelCard className="max-w-lg w-full">
        {feedback ? (
           <div className={`text-center py-8 ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
             {feedback.type === 'error' ? <HeartCrack className="w-16 h-16 mx-auto mb-4" /> : <Heart className="w-16 h-16 mx-auto mb-4 fill-current" />}
             <h3 className="font-pixel text-xl mb-4">{feedback.type === 'error' ? 'ERROR!' : 'CORECT!'}</h3>
             <p className="font-pixel text-sm">{feedback.msg}</p>
             {feedback.type === 'error' && (
               <button 
                 onClick={() => setFeedback(null)}
                 className="mt-6 bg-gray-200 font-pixel px-4 py-2 border-2 border-black text-xs hover:bg-gray-300"
               >
                 Am plătit pedeapsa (Încearcă iar)
               </button>
             )}
           </div>
        ) : (
          <>
            <h2 className="font-pixel text-sm md:text-base leading-6 mb-8 text-center min-h-[60px]">
              {qIndex + 1}. {currentQ.question}
            </h2>
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => { playButtonSound(); handleAnswer(idx); }}
                  className="w-full text-left font-pixel text-xs md:text-sm p-4 border-2 border-black hover:bg-pixel-pink hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-black text-white text-[10px]">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </PixelCard>

      {/* Cat popup */}
      {showCatPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-cat-pop">
          <img
            src={catImage}
            alt={showCatPopup === 'happy' ? 'Happy cat' : 'Angry cat'}
            className="w-64 h-auto border-4 border-white shadow-2xl rounded-lg"
          />
        </div>
      )}

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
                top: '-100px',
                width: `${cat.size}px`,
                animationDelay: `${cat.delay}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes cat-pop {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          40% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          60% { transform: scale(0.9) rotate(-5deg); }
          80% { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-cat-pop { animation: cat-pop 0.5s ease-out; }

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
          animation: fall-down 2.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};