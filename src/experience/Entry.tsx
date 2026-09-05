import React, { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import { useShockwave } from '../reactive/useShockwave';

export default function Entry() {
  const setHasEntered = useExperienceStore((state) => state.setHasEntered);
  const hasEntered = useExperienceStore((state) => state.hasEntered);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const triggerShockwave = useShockwave();

  useEffect(() => {
    // Advance timeline automatically
    const t1 = setTimeout(() => setStep(1), 2000); // Small movement / anticipation
    const t2 = setTimeout(() => setStep(2), 3500); // Typography emerges
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (step < 2) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        // Trigger transition
        triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 2);
        setHasEntered(true);
        useExperienceStore.getState().openFork('origin');
        useExperienceStore.getState().expandFork('origin');
      }
    };

    window.addEventListener('wheel', handleWheel, { once: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [step, setHasEntered, triggerShockwave]);

  const handleEnterClick = () => {
    triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 2);
    setHasEntered(true);
    useExperienceStore.getState().openFork('origin');
    useExperienceStore.getState().expandFork('origin');
  };

  if (hasEntered) return null;

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-drift-bg pointer-events-auto overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div 
          className="w-[1px] h-0 bg-drift-foreground"
          animate={{ h: step >= 1 ? '50vh' : '0vh', opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex flex-col items-center gap-16 text-center pointer-events-none relative z-10">
        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.p 
              key="text"
              className="text-sm md:text-base font-sans text-drift-foreground tracking-[0.3em] uppercase max-w-sm"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              Coffee changes<br/>the pace of a room.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute bottom-20 flex flex-col items-center gap-4 cursor-pointer pointer-events-auto group"
            onClick={handleEnterClick}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-drift-foreground-muted group-hover:text-drift-foreground transition-colors">
              Begin Journey
            </span>
            <motion.div 
              className="w-[1px] h-12 bg-drift-foreground-muted group-hover:bg-drift-foreground transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
