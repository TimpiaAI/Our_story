import React, { useState } from 'react';
import { HeartCrack, Heart, Star } from 'lucide-react';
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
  const [feedback, setFeedback] = useState<{type: 'success'|'error'|'hidden', msg: string} | null>(null);
  const [showCatPopup, setShowCatPopup] = useState<'happy' | 'angry' | null>(null);
  const [catImage, setCatImage] = useState('');
  const [fallingCats, setFallingCats] = useState<FallingCat[]>([]);

  // Drag and drop state for question 3
  const [droppedWords, setDroppedWords] = useState<string[]>([]);
  const [shakeWord, setShakeWord] = useState<string | null>(null);

  const currentQ = QUIZ_QUESTIONS[qIndex];

  const handleAnswer = (optionIndex: number) => {
    // Question 1: Hidden answer - any choice reveals the real answer (no cat popup)
    if (currentQ.correctAnswer === -1) {
      playCorrectSound();
      setFeedback({ type: 'hidden', msg: currentQ.hiddenAnswer || "Să stau cu tine! 💕" });

      setTimeout(() => {
        setFeedback(null);
        if (qIndex < QUIZ_QUESTIONS.length - 1) {
          setQIndex(prev => prev + 1);
        } else {
          onComplete();
        }
      }, 3000);
      return;
    }

    // Regular question
    if (optionIndex === currentQ.correctAnswer) {
      playCorrectSound();
      playAwwSound();
      setFeedback({ type: 'success', msg: "Ești un geniu! Te iubesc!" });
      setCatImage(HAPPY_CAT_IMAGES[Math.floor(Math.random() * HAPPY_CAT_IMAGES.length)]);
      setShowCatPopup('happy');
      setTimeout(() => setShowCatPopup(null), 2000);

      spawnFallingCats();

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

  const spawnFallingCats = () => {
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
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', word);
  };

  // Handle drop on the answer box
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');

    // Check if it's a bad word
    if (currentQ.badWords?.includes(word)) {
      playAngrySound();
      setShakeWord(word);
      setTimeout(() => setShakeWord(null), 500);
      return;
    }

    // Add good word if not already dropped
    if (currentQ.goodWords?.includes(word) && !droppedWords.includes(word)) {
      playCorrectSound();
      setDroppedWords(prev => [...prev, word]);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Check if all good words are dropped
  const checkDragDropComplete = () => {
    if (droppedWords.length === currentQ.goodWords?.length) {
      playAwwSound();
      setFeedback({ type: 'success', msg: "Perfect! Așa mă vezi tu! 🥰" });
      setCatImage(HAPPY_CAT_IMAGES[Math.floor(Math.random() * HAPPY_CAT_IMAGES.length)]);
      setShowCatPopup('happy');
      setTimeout(() => setShowCatPopup(null), 2000);

      spawnFallingCats();

      setTimeout(() => {
        setFeedback(null);
        onComplete();
      }, 2500);
    }
  };

  // Render drag and drop question
  const renderDragDropQuestion = () => {
    const allWords = [...(currentQ.goodWords || []), ...(currentQ.badWords || [])];
    // Shuffle words
    const shuffledWords = allWords.sort(() => 0.5 - Math.random());

    return (
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="min-h-[80px] sm:min-h-[100px] border-4 border-dashed border-pink-400 rounded-lg p-3 sm:p-4 bg-pink-50 flex flex-wrap gap-2 items-center justify-center"
        >
          {droppedWords.length === 0 ? (
            <span className="font-pixel text-[10px] sm:text-xs text-gray-400">Trage cuvintele aici...</span>
          ) : (
            droppedWords.map((word, idx) => (
              <span
                key={idx}
                className="bg-green-500 text-white font-pixel text-xs sm:text-sm px-3 py-1 rounded-full animate-bounce-in"
              >
                {word} ✓
              </span>
            ))
          )}
        </div>

        {/* Draggable words */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {shuffledWords.map((word, idx) => {
            const isGood = currentQ.goodWords?.includes(word);
            const isDropped = droppedWords.includes(word);
            const isShaking = shakeWord === word;

            return (
              <div
                key={idx}
                draggable={!isDropped}
                onDragStart={(e) => handleDragStart(e, word)}
                className={`
                  font-pixel text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border-2 cursor-grab active:cursor-grabbing
                  transition-all select-none
                  ${isDropped ? 'opacity-30 cursor-not-allowed' : ''}
                  ${isGood ? 'bg-white border-green-400 hover:bg-green-50' : 'bg-white border-red-400 hover:bg-red-50'}
                  ${isShaking ? 'animate-shake-no' : ''}
                `}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* Complete button */}
        {droppedWords.length === currentQ.goodWords?.length && (
          <button
            onClick={checkDragDropComplete}
            className="w-full mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-pixel text-sm py-3 rounded-lg animate-pulse"
          >
            Gata! Așa sunt eu! 💕
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-2 sm:p-4 relative">
       <div className="bg-black text-white font-pixel p-2 text-center mb-4 sm:mb-8 border-2 border-white w-full max-w-lg text-[10px] sm:text-sm mx-2">
          NIVELUL 3: LOVE QUIZ
          <div className="flex justify-center gap-1 mt-2">
            {QUIZ_QUESTIONS.map((_, i) => (
              <Heart key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i <= qIndex ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            ))}
          </div>
        </div>

      <PixelCard className="max-w-lg w-full mx-2">
        {feedback ? (
           <div className={`text-center py-4 sm:py-8 ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
             {feedback.type === 'error' ? (
               <HeartCrack className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4" />
             ) : feedback.type === 'hidden' ? (
               <Star className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 fill-yellow-400 text-yellow-400" />
             ) : (
               <Heart className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 fill-current" />
             )}

             <h3 className="font-pixel text-base sm:text-xl mb-2 sm:mb-4">
               {feedback.type === 'error' ? 'GREȘIT!' : feedback.type === 'hidden' ? 'TE-AM PĂCĂLIT!' : 'CORECT!'}
             </h3>

             <p className="font-pixel text-xs sm:text-sm">{feedback.msg}</p>

             {feedback.type === 'hidden' && (
               <p className="font-pixel text-lg sm:text-2xl mt-4 text-pink-500 animate-pulse">
                 Răspunsul era: {currentQ.hiddenAnswer}
               </p>
             )}

             {feedback.type === 'error' && (
               <button
                 onClick={() => setFeedback(null)}
                 className="mt-4 sm:mt-6 bg-gray-200 font-pixel px-3 sm:px-4 py-2 border-2 border-black text-[10px] sm:text-xs hover:bg-gray-300"
               >
                 Am plătit pedeapsa (Încearcă iar)
               </button>
             )}
           </div>
        ) : (
          <>
            <h2 className="font-pixel text-xs sm:text-sm md:text-base leading-5 sm:leading-6 mb-4 sm:mb-8 text-center min-h-[40px] sm:min-h-[60px]">
              {qIndex + 1}. {currentQ.question}
            </h2>

            {/* Drag and drop question */}
            {currentQ.isDragDrop ? (
              renderDragDropQuestion()
            ) : (
              /* Regular multiple choice */
              <div className="space-y-2 sm:space-y-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => { playButtonSound(); handleAnswer(idx); }}
                    className="w-full text-left font-pixel text-[10px] sm:text-xs md:text-sm p-2 sm:p-4 border-2 border-black hover:bg-pixel-pink hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-black text-white text-[8px] sm:text-[10px] flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}
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

        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.3s ease-out; }

        @keyframes shake-no {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        .animate-shake-no { animation: shake-no 0.4s ease-out; }
      `}</style>
    </div>
  );
};
