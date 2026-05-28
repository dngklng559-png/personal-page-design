import React from 'react';
import { Theme } from '../types';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  theme: Theme;
  variant?: 'primary' | 'secondary';
  isActive?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  theme, 
  variant = 'primary', 
  isActive = false,
  className = '',
  ...props 
}) => {
  const isDark = theme === Theme.DARK;

  // Dynamic classes based on theme and variant
  const baseClasses = "relative px-6 py-3 font-cyber font-bold tracking-wider uppercase transition-all duration-300 transform active:scale-95 group overflow-hidden clip-path-cyber";
  
  let themeClasses = "";
  
  if (isDark) {
    if (variant === 'primary') {
      themeClasses = isActive 
        ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.6)]" 
        : "bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]";
    } else {
      themeClasses = "bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700";
    }
  } else {
    // Light Mode - Softer colors
    if (variant === 'primary') {
      themeClasses = isActive 
        ? "bg-sky-400 text-white shadow-lg shadow-sky-100" 
        : "bg-white border border-sky-200 text-sky-500 hover:bg-sky-50 hover:shadow-md hover:border-sky-300";
    } else {
      themeClasses = "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50";
    }
  }

  return (
    <button 
      className={`${baseClasses} ${themeClasses} ${className}`}
      style={{
        clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)'
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      
      {/* Glint Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
    </button>
  );
};

export default CyberButton;