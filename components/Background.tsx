import React, { useEffect, useRef } from 'react';
import { Theme } from '../types';

interface BackgroundProps {
  theme: Theme;
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Aurora Effect (Dark Mode)
  useEffect(() => {
    if (theme !== Theme.DARK) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawAurora = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Deep dark background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#050510');
      bgGradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aurora bands
      const colors = ['#00ff9d', '#00d2ff', '#7000ff', '#ff0055'];
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `${colors[i]}00`);
        gradient.addColorStop(0.5, `${colors[i]}40`); // Low opacity for "Gentle" feel
        gradient.addColorStop(1, `${colors[i]}00`);
        
        ctx.fillStyle = gradient;
        
        // Sine wave calculation for organic movement
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 20) {
          const y = canvas.height / 2 + 
                    Math.sin(x * 0.002 + t + i) * 100 + 
                    Math.cos(x * 0.005 - t) * 50;
          ctx.lineTo(x, y + (i * 100));
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();
      }

      t += 0.005;
      animationFrameId = requestAnimationFrame(drawAurora);
    };

    drawAurora();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  if (theme === Theme.DARK) {
    return (
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-50 transition-opacity duration-1000"
      />
    );
  }

  // Cloud Effect (Light Mode) - Updated for Lighter/Shallower Colors
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 bg-sky-50 overflow-hidden transition-colors duration-1000">
      {/* Sky Gradient - Much lighter now */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-50 to-white opacity-60" />
      
      {/* Sun Glow - Softer */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* Cloud Layer 1 (Back - Slow) */}
      <div className="absolute top-[10%] opacity-40" style={{ animation: 'drift 60s linear infinite' }}>
         <CloudShape scale={0.8} />
      </div>
      <div className="absolute top-[20%] left-[40%] opacity-30" style={{ animation: 'drift 80s linear infinite', animationDelay: '-20s' }}>
         <CloudShape scale={0.6} />
      </div>

      {/* Cloud Layer 2 (Middle) */}
      <div className="absolute top-[15%] -left-[20%] opacity-60" style={{ animation: 'drift 40s linear infinite', animationDelay: '-5s' }}>
         <CloudShape scale={1.2} />
      </div>
       <div className="absolute top-[60%] left-[10%] opacity-50" style={{ animation: 'drift 55s linear infinite', animationDelay: '-15s' }}>
         <CloudShape scale={0.9} />
      </div>

      {/* Cloud Layer 3 (Front - Fast & Large) */}
      <div className="absolute top-[40%] -left-[40%] opacity-70 z-0" style={{ animation: 'drift 30s linear infinite', animationDelay: '-10s' }}>
         <CloudShape scale={1.5} />
      </div>
    </div>
  );
};

// Helper component to draw a CSS Cloud
const CloudShape = ({ scale = 1 }) => (
  <div style={{ transform: `scale(${scale})` }} className="relative">
    <div className="w-32 h-32 bg-white rounded-full absolute top-0 left-0 blur-md"></div>
    <div className="w-40 h-40 bg-white rounded-full absolute top-[-20px] left-[50px] blur-md"></div>
    <div className="w-32 h-32 bg-white rounded-full absolute top-[10px] left-[120px] blur-md"></div>
    <div className="w-56 h-20 bg-white rounded-full absolute top-[60px] left-[10px] blur-md"></div>
  </div>
);

export default Background;