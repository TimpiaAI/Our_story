import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border-4 border-black p-6 relative pixel-shadow ${className}`}>
      {/* Pixel corners decoration */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-white"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white"></div>
      {children}
    </div>
  );
};