import React from 'react';
import { Theme } from '../types';

interface CyberCardProps {
  children: React.ReactNode;
  theme: Theme;
  className?: string;
}

const CyberCard: React.FC<CyberCardProps> = ({ children, theme, className = '' }) => {
  const isDark = theme === Theme.DARK;

  return (
    <div className={`relative p-[2px] rounded-2xl overflow-hidden group ${className}`}>
      {/* Animated Gradient Border - Softer for Light Mode */}
      <div className={`absolute inset-0 bg-gradient-to-r animate-[spin_4s_linear_infinite] opacity-70
        ${isDark 
          ? 'from-cyan-500 via-purple-500 to-cyan-500' 
          : 'from-sky-200 via-pink-200 to-sky-200'}`} 
      />
      
      {/* Inner Content Mask */}
      <div className={`relative h-full w-full rounded-2xl p-6 transition-colors duration-300
        ${isDark 
          ? 'bg-slate-900/90 backdrop-blur-xl text-slate-200' 
          : 'bg-white/80 backdrop-blur-xl text-slate-600 shadow-sm'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default CyberCard;