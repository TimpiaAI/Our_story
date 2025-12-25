import React, { useState } from 'react';
import { Gift, Video } from 'lucide-react';
import { PARTNER_NAME } from '../constants';

export const Letter: React.FC = () => {
  const [showRealGift, setShowRealGift] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 md:p-8 transition-opacity duration-1000 animate-in fade-in">
      <div className="max-w-2xl w-full bg-parchment p-4 sm:p-8 md:p-12 relative shadow-[0_0_50px_rgba(255,215,0,0.3)] mx-2">
        {/* Decorative Borders */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-l-4 border-t-4 border-pixel-gold opacity-50"></div>
        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-16 sm:h-16 border-r-4 border-b-4 border-pixel-gold opacity-50"></div>

        <div className="text-center mb-4 sm:mb-8">
           <h2 className="font-handwriting text-3xl sm:text-5xl md:text-6xl text-red-800 mb-2">Draga mea,</h2>
           <div className="h-1 w-16 sm:w-24 bg-red-800 mx-auto opacity-30"></div>
        </div>

        <div className="font-handwriting text-lg sm:text-2xl md:text-3xl text-gray-800 leading-relaxed text-center space-y-4 sm:space-y-6">
          <p>
            Am parcurs acest drum de la <strong>25 mai 2024</strong> până azi, <br/>
            <strong>25 decembrie 2025</strong>.
          </p>
          <p>
            Ești cel mai frumos <span className="text-pixel-red font-bold">High Score</span> al vieții mele.
          </p>
          <p>
            Suntem la al doilea nostru Revelion și abia aștept să deblocăm nivelurile din 2026 împreună.
          </p>
          <p className="text-2xl sm:text-4xl mt-4 sm:mt-8 block transform -rotate-2 text-red-600">
            Te iubesc enorm, {PARTNER_NAME}!
          </p>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
           {/* Real Gift Interaction */}
           {!showRealGift ? (
             <button
               onClick={() => {
                 setShowRealGift(true);
                 window.confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.8 },
                    colors: ['#FFD700', '#FF0000']
                 });
               }}
               className="bg-red-800 text-parchment font-serif italic px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded shadow-lg hover:bg-red-900 transition-colors flex items-center gap-2"
             >
               <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
               Apasă aici pentru cadoul real
             </button>
           ) : (
             <div className="text-center animate-pulse bg-white/50 p-3 sm:p-4 rounded-lg border border-red-200">
               <p className="font-sans font-bold text-red-800 text-base sm:text-lg">Caută sub brad cutia cu fundă aurie!</p>
               <p className="text-xs sm:text-sm text-gray-600 italic mt-1">Sper să îți placă ❤️</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};