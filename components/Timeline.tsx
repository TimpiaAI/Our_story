import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { calculateDaysTogether, TIMELINE_EVENTS } from '../constants';

interface TimelineProps {
  onComplete: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({ onComplete }) => {
  const days = calculateDaysTogether();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);

  // Auto-show photo after movement delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPhoto(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < TIMELINE_EVENTS.length - 1) {
      setShowPhoto(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 200); // Wait for close animation
    } else {
      onComplete();
    }
  };

  const currentEvent = TIMELINE_EVENTS[currentStep];
  const progress = ((currentStep + 1) / TIMELINE_EVENTS.length) * 100;

  return (
    <div className="min-h-screen bg-[#87CEEB] flex flex-col relative overflow-hidden">
      
      {/* --- HUD --- */}
      <div className="absolute top-4 left-4 z-20 bg-white border-2 border-black p-2 font-pixel text-xs shadow-md">
         Zile împreună: <span className="text-red-500">{days}</span>
      </div>
      <div className="absolute top-4 right-4 z-20 w-32 h-4 bg-gray-200 border-2 border-black">
        <div 
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* --- SKY DECORATION --- */}
      <div className="absolute top-10 w-full animate-slide-clouds opacity-80">
         <div className="absolute left-[10%] text-6xl">☁️</div>
         <div className="absolute left-[40%] top-12 text-4xl">☁️</div>
         <div className="absolute left-[80%] text-5xl">☁️</div>
      </div>

      {/* --- MAIN GAME VIEW --- */}
      <div className="flex-1 flex flex-col items-center justify-end pb-32 relative">
        
        {/* Memory "Bubble" / Popup */}
        <div className={`transition-all duration-500 ease-out transform ${showPhoto ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'} z-10 mb-8`}>
            <div className="bg-white p-3 pb-8 shadow-2xl rotate-2 max-w-[280px] md:max-w-sm border-4 border-white relative">
               {/* Tape */}
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-200/50 transform -rotate-2"></div>
               
               <div className="bg-gray-100 w-full aspect-square overflow-hidden mb-3 border border-gray-200">
                  <img src={currentEvent.image} alt="Memory" className="w-full h-full object-cover" />
               </div>
               
               <h3 className="font-handwriting text-2xl text-center text-gray-800 mb-1">
                 {currentEvent.date}
               </h3>
               <p className="font-pixel text-[10px] text-center text-gray-500 leading-tight px-2">
                 {currentEvent.desc}
               </p>

               {/* Sticker */}
               <div className="absolute -bottom-3 -right-3 text-4xl filter drop-shadow-md">
                 {currentEvent.icon}
               </div>
            </div>
        </div>

        {/* --- GROUND TRACK --- */}
        <div className="absolute bottom-0 w-full h-24 bg-[#5C4033] border-t-8 border-[#4A3728] relative">
           {/* Grass Top */}
           <div className="absolute -top-4 w-full h-4 bg-green-500 border-t-4 border-black"></div>
           
           {/* Moving Background Elements based on step */}
           <div 
             className="absolute bottom-full left-0 w-[200%] h-32 flex items-end transition-transform duration-700 ease-in-out"
             style={{ transform: `translateX(-${currentStep * 20}%)` }}
           >
              {TIMELINE_EVENTS.map((_, i) => (
                <div key={i} className="flex-1 flex justify-center items-end h-full relative border-l-2 border-white/20">
                   {/* Scenery items */}
                   <div className="text-4xl absolute bottom-6 left-10">🌲</div>
                   <div className="text-2xl absolute bottom-4 right-20">🍄</div>
                   <div className="text-3xl absolute bottom-6 right-10">🌸</div>
                </div>
              ))}
           </div>
        </div>

        {/* --- CHARACTER --- */}
        {/* Changed bottom-20 to bottom-24 to sit ON TOP of the h-24 ground */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
           <div className="flex flex-col items-center animate-bounce-slow">
              <div className="bg-white border-2 border-black px-2 py-1 text-[8px] font-pixel mb-1 rounded-full whitespace-nowrap">
                {currentEvent.title}
              </div>
              <div className="w-12 h-12 bg-pixel-red border-4 border-black relative">
                 {/* Eyes */}
                 <div className="absolute top-3 left-2 w-2 h-2 bg-white"></div>
                 <div className="absolute top-3 right-2 w-2 h-2 bg-white"></div>
                 {/* Legs (Animated with CSS) */}
                 <div className="absolute -bottom-3 left-1 w-3 h-4 bg-black animate-pulse"></div>
                 <div className="absolute -bottom-3 right-1 w-3 h-4 bg-black animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              </div>
           </div>
        </div>

      </div>

      {/* --- CONTROLS --- */}
      <div className="absolute bottom-4 w-full px-4 flex justify-center z-30">
        <button 
          onClick={handleNext}
          className="bg-pixel-gold font-pixel text-sm md:text-base py-4 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2 hover:bg-yellow-400 w-full max-w-sm justify-center"
        >
          {currentStep < TIMELINE_EVENTS.length - 1 ? (
            <>MERGI MAI DEPARTE <ArrowRight /></>
          ) : (
            <>URMĂTORUL NIVEL <Star className="fill-current" /></>
          )}
        </button>
      </div>
      
      <style>{`
        @keyframes slide-clouds {
          from { transform: translateX(-10%); }
          to { transform: translateX(10%); }
        }
        .animate-slide-clouds {
          animation: slide-clouds 20s infinite alternate linear;
        }
      `}</style>
    </div>
  );
};