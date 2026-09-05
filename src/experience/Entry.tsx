import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import { useShockwave } from '../reactive/useShockwave';

gsap.registerPlugin(ScrollTrigger);

export default function Entry() {
  const setHasEntered = useExperienceStore((state) => state.setHasEntered);
  const hasEntered = useExperienceStore((state) => state.hasEntered);
  const containerRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLHeadingElement>(null);
  const triggerShockwave = useShockwave();

  // Animate DRIFT wordmark on mount
  useEffect(() => {
    if (!driftRef.current) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      driftRef.current,
      { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.8, ease: 'power4.inOut' }
    );
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        handleEnterClick();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleEnterClick();
    };

    // Listen after a short delay to avoid accidental scroll-through
    const timer = setTimeout(() => {
      window.addEventListener('wheel', handleWheel, { once: true });
      window.addEventListener('keydown', handleKey, { once: true });
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleEnterClick = () => {
    triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 2);
    setHasEntered(true);
    useExperienceStore.getState().openFork('journey');
    useExperienceStore.getState().expandFork('journey');
  };

  // Remove `if (hasEntered) return null;` so AnimatePresence can run exit animation

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-drift-bg pointer-events-auto overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(30px)', scale: 1.04 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Thin vertical structural line */}
      <motion.div
        className="absolute left-1/2 top-0 w-[1px] bg-drift-border/40"
        initial={{ height: 0 }}
        animate={{ height: '100vh' }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        style={{ translateX: '-50%' }}
      />

      {/* Thin horizontal structural line */}
      <motion.div
        className="absolute top-1/2 left-0 h-[1px] bg-drift-border/25"
        initial={{ width: 0 }}
        animate={{ width: '100vw' }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
        style={{ translateY: '-50%' }}
      />

      {/* Corner labels */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="text-[9px] tracking-[0.4em] uppercase text-drift-foreground-muted">
          Single Origin
        </p>
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 md:top-12 md:right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <p className="text-[9px] tracking-[0.4em] uppercase text-drift-foreground-muted text-right">
          Specialty Coffee
        </p>
      </motion.div>

      {/* Main composition */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        
        {/* Geographic subtitle */}
        <motion.p
          className="text-[10px] md:text-xs tracking-[0.5em] uppercase text-drift-accent mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2 }}
        >
          Ethiopia · Guji Zone · 2,100M
        </motion.p>
        
        {/* DRIFT wordmark — clip revealed left-to-right */}
        <div className="overflow-hidden">
          <h1
            ref={driftRef}
            className="text-[22vw] md:text-[18vw] font-display uppercase tracking-[-0.04em] leading-none text-drift-foreground select-none"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            DRIFT
          </h1>
        </div>

        {/* Divider + tagline */}
        <motion.div
          className="flex items-center gap-6 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.2 }}
        >
          <div className="h-[1px] w-12 bg-drift-border" />
          <p className="text-xs md:text-sm font-sans text-drift-foreground-muted tracking-[0.2em] uppercase">
            Coffee changes the pace of a room.
          </p>
          <div className="h-[1px] w-12 bg-drift-border" />
        </motion.div>
      </div>

      {/* Bottom left — process details */}
      <motion.div
        className="absolute bottom-8 left-8 md:bottom-12 md:left-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <p className="text-[9px] tracking-[0.3em] uppercase text-drift-foreground-muted">
          Natural Process · Heirloom Varietal
        </p>
      </motion.div>

      {/* Bottom right — Enter CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.5 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col items-end gap-3 cursor-pointer pointer-events-auto group"
        onClick={handleEnterClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleEnterClick(); }}
        aria-label="Enter the DRIFT experience"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-drift-foreground-muted group-hover:text-drift-foreground transition-colors duration-500">
          Scroll to begin
        </span>
        <motion.div 
          className="w-[1px] h-8 bg-drift-foreground-muted group-hover:bg-drift-foreground transition-colors duration-500 origin-top"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}
