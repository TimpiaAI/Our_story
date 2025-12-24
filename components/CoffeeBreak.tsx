import React from 'react';
import { X, Coffee } from 'lucide-react';

interface CoffeeBreakProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeBreak: React.FC<CoffeeBreakProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full p-2 border-4 border-black relative">
        <button 
          onClick={onClose}
          className="absolute -top-6 -right-6 bg-red-600 text-white p-2 border-2 border-black hover:bg-red-700"
        >
          <X />
        </button>
        
        <div className="bg-black aspect-video flex items-center justify-center text-white font-pixel text-center p-8">
           {/* In a real app, embed YouTube or Video file here */}
           <div>
             <Coffee className="w-16 h-16 mx-auto mb-4 text-pixel-gold" />
             <p className="mb-4">VIDEO MONTAJ</p>
             <p className="text-xs text-gray-400 max-w-md mx-auto">
               Imaginează-ți aici melodia noastră preferată și un colaj cu cele mai frumoase poze ale noastre de anul acesta.
             </p>
             <div className="mt-8 text-[10px] text-gray-500 font-sans">
               (Pentru demo, acest player este simulat)
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};