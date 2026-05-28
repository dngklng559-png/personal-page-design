import React, { useState, useRef, useEffect } from 'react';
import { Theme, Project } from '../types';
import { Move } from 'lucide-react';

interface Project3DProps {
  items: Project[];
  theme: Theme;
}

const Project3D: React.FC<Project3DProps> = ({ items, theme }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [radius, setRadius] = useState(340);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());

  const anglePerItem = 360 / items.length;
  const isDark = theme === Theme.DARK;

  // Responsive Radius Calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(180); // Mobile radius
      } else if (window.innerWidth < 1024) {
        setRadius(240); // Tablet radius
      } else {
        setRadius(340); // Desktop radius
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setStartRotation(rotation);
    lastInteractionTimeRef.current = Date.now();

    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    const newRotation = startRotation + diff * 0.3; 
    setRotation(newRotation);
    lastInteractionTimeRef.current = Date.now();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleMouseUp();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Auto Rotation Logic
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      const now = Date.now();
      // Resume auto-rotation if user hasn't interacted for 2 seconds and isn't currently dragging
      if (!isDragging && now - lastInteractionTimeRef.current > 2000) {
        setRotation(prev => prev + 0.05); // Slow constant rotation
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging]);

  return (
    <div className="w-full h-[600px] flex flex-col items-center justify-center perspective-1000 relative py-10 overflow-visible touch-pan-y">
       <div className={`mb-12 flex items-center gap-2 text-sm font-cyber animate-pulse select-none ${isDark ? 'text-cyan-400' : 'text-sky-400 font-bold'}`}>
          <Move size={16} />
          <span>左右拖动以旋转视图</span>
          <Move size={16} />
       </div>

      <div 
        // Mobile: Reduced width/height to 210px/280px to increase gap between cards
        className="h-[280px] w-[210px] md:h-[400px] md:w-[300px] relative preserve-3d transition-transform duration-75 ease-linear cursor-grab"
        ref={carouselRef}
        style={{ transform: `rotateY(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {items.map((item, index) => {
          const itemAngle = anglePerItem * index;
          
          return (
            <div
              key={item.id}
              className={`absolute inset-0 w-full h-full rounded-2xl border flex flex-col gap-2 md:gap-4 select-none transition-all duration-500 group
                ${isDark 
                  ? 'bg-slate-900/20 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:bg-slate-900/60 hover:border-cyan-400' 
                  : 'bg-white/40 border-white/60 shadow-xl hover:bg-white/70 hover:border-white'} 
                backdrop-blur-md p-3 md:p-5`}
              style={{
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                // We keep visible to see "through" the carousel for that cyber feel
                backfaceVisibility: 'visible', 
                WebkitBackfaceVisibility: 'visible'
              }}
            >
              <div className="relative w-full h-28 md:h-48 rounded-xl overflow-hidden bg-gray-800/50 flex-shrink-0 border border-white/10">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                  draggable={false}
                />
                <div className={`absolute inset-0 transition-colors ${isDark ? 'bg-black/20 group-hover:bg-transparent' : 'bg-white/10 group-hover:bg-transparent'}`} />
              </div>
              
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                    <h3 className={`text-base md:text-2xl font-cyber font-bold mb-1 md:mb-2 truncate ${isDark ? 'text-white drop-shadow-md' : 'text-slate-700'}`}>
                    {item.title}
                    </h3>
                    
                    <p className={`text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed font-medium ${isDark ? 'text-cyan-100/80' : 'text-slate-600/80'}`}>
                    {item.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-4">
                    {item.tags.slice(0, 3).map(tag => (
                    <span 
                        key={tag} 
                        className={`text-[9px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-bold tracking-wide border backdrop-blur-sm
                        ${isDark 
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30' 
                            : 'bg-white/50 text-sky-600 border-sky-100'}`}
                    >
                        #{tag}
                    </span>
                    ))}
                </div>
              </div>
              
              {/* Decorative Corner Accents */}
              <div className={`absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 rounded-tl-lg ${isDark ? 'border-cyan-400' : 'border-sky-300'} opacity-50`} />
              <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 rounded-br-lg ${isDark ? 'border-cyan-400' : 'border-sky-300'} opacity-50`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Project3D;