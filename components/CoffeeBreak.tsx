import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface CoffeeBreakProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeBreak: React.FC<CoffeeBreakProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.volume = 1.0;
      videoRef.current.play().catch(() => {});
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-black max-w-3xl w-full border-4 border-white relative">
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full border-4 border-black hover:bg-red-700 z-10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="font-pixel text-white text-center py-2 bg-pixel-red border-b-2 border-white">
          ☕ PAUZĂ DE CAFEA ☕
        </div>

        <video
          ref={videoRef}
          src="/sfx/vfx/pauza.mp4"
          className="w-full"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
};