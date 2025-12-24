import React, { useState } from 'react';
import { HeartCrack, Heart } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';
import { PixelCard } from './PixelCard';

// Sound effects
const playCorrectSound = () => {
  const audio = new Audio('/sfx/correct.mp3');
  audio.volume = 0.6;
  audio.play().catch(() => {});
};

const playWrongSound = () => {
  const audio = new Audio('/sfx/wrong.mp3');
  audio.volume = 0.6;
  audio.play().catch(() => {});
};

interface QuizProps {
  onComplete: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);

  const currentQ = QUIZ_QUESTIONS[qIndex];

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === currentQ.correctAnswer) {
      playCorrectSound();
      setFeedback({ type: 'success', msg: "Ești un geniu! Te iubesc!" });
      window.confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });

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
      setFeedback({ type: 'error', msg: currentQ.wrongMessage });
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
                  onClick={() => handleAnswer(idx)}
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
    </div>
  );
};