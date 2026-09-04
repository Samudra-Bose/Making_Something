import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from './store';
import { motion } from 'motion/react';
import gsap from 'gsap';

export default function Entry() {
  const setHasEntered = useExperienceStore((state) => state.setHasEntered);
  const hasEntered = useExperienceStore((state) => state.hasEntered);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    // Generate a strong ripple/shockwave on the reactive field when entering
    // This will be picked up by ReactiveField via window click event (it's already implemented there)
    
    // Trigger transition
    setHasEntered(true);
  };

  if (hasEntered) return null;

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-drift-bg pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-12 text-center pointer-events-none">
        <motion.h1 
          className="text-6xl md:text-8xl font-display font-medium text-drift-foreground tracking-widest uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        >
          Drift
        </motion.h1>

        <motion.p 
          className="text-sm md:text-base font-sans text-drift-foreground-muted tracking-[0.2em] uppercase max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          Coffee changes<br/>the pace of a room.
        </motion.p>
      </div>

      <motion.button
        onClick={handleEnter}
        className="mt-24 px-8 py-4 text-xs tracking-[0.3em] text-drift-foreground uppercase border border-drift-border rounded-sm hover:bg-drift-foreground/5 hover:border-drift-foreground/20 transition-all duration-500 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Enter
      </motion.button>
    </motion.div>
  );
}
