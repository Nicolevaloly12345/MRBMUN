import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Globe, Users, BookOpen, Quote, Shield, Award } from 'lucide-react';

export default function InteractiveEmblem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D effect
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation
  const rotateX = useTransform(springY, [-1, 1], [15, -15]);
  const rotateY = useTransform(springX, [-1, 1], [-15, 15]);

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the card (-1 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    // Reset to center
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  return (
    <div 
      className="w-full aspect-square relative flex items-center justify-center perspective-[1000px] cursor-pointer"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[320px] h-[400px] md:w-[380px] md:h-[480px] rounded-3xl"
      >
        {/* Card Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-gray-900 rounded-3xl shadow-2xl border-2 border-gold/30 overflow-hidden">
          {/* Decorative Pattern inside card */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          {/* Subtle Glow following mouse */}
          <motion.div 
            className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent blur-xl pointer-events-none"
            style={{
              x: useTransform(springX, [-1, 1], ['-20%', '20%']),
              y: useTransform(springY, [-1, 1], ['-20%', '20%']),
            }}
          />
        </div>

        {/* Content Layers (Translated in Z-axis for 3D effect) */}
        
        {/* Layer 1: Background emblem */}
        <motion.div 
          style={{ transform: "translateZ(30px)" }}
          className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
        >
          <Shield size={250} className="text-white" />
        </motion.div>

        {/* Layer 2: Main Content */}
        <motion.div 
          style={{ transform: "translateZ(60px)" }}
          className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none"
        >
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40 backdrop-blur-md">
              <Globe className="text-gold" size={28} />
            </div>
            <div className="text-right">
              <div className="text-gold text-sm font-bold tracking-widest uppercase">MRBMUN</div>
              <div className="text-white/60 text-xs">2026 Edition</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-serif text-white font-bold leading-tight">
              Liderazgo &<br/>Diplomacia
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Descubre tu potencial debatiendo resoluciones que pueden cambiar el rumbo de nuestro futuro colectivo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner">
              <Users size={18} className="text-gold mb-2" />
              <div className="text-white font-bold">120+</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider">Delegados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-inner">
              <BookOpen size={18} className="text-gold mb-2" />
              <div className="text-white font-bold">7</div>
              <div className="text-white/50 text-[10px] uppercase tracking-wider">Comités</div>
            </div>
          </div>
        </motion.div>

        {/* Layer 3: Floating Badge */}
        <motion.div
           style={{ transform: "translateZ(100px)" }}
           className="absolute -bottom-6 -right-6 pointer-events-none"
        >
          <div className="w-24 h-24 rounded-full bg-gold text-burgundy flex items-center justify-center shadow-xl border-4 border-snow flex-col">
             <Award size={28} />
             <span className="text-[10px] font-bold uppercase mt-1">Oficial</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
