import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// Global configuration for GSAP
gsap.config({
  autoSleep: 60,
  force3D: true
});

// CRITICAL: Do NOT set ScrollTrigger.defaults({ scroller: window }) here.
// Each world uses its own local container ref as scroller.
// Setting a global default would conflict with all child ScrollTriggers.

import { useExperienceStore } from './store';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const openForks = useExperienceStore(s => s.openForks);
  const isJourney = openForks.length === 1 && openForks[0] === 'journey';

  useEffect(() => {
    // Refresh ScrollTrigger on resize only — do NOT kill all triggers on unmount
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative w-full min-h-[100dvh] bg-drift-bg text-drift-foreground font-sans selection:bg-drift-accent/30 selection:text-drift-highlight ${isJourney ? '' : 'overflow-hidden max-h-[100dvh]'}`}>
      {children}
    </div>
  );
}
