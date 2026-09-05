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

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger on resize only — do NOT kill all triggers on unmount
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      // Do NOT call ScrollTrigger.getAll().forEach(t => t.kill()) here —
      // that would destroy all child world ScrollTriggers prematurely.
    };
  }, []);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-drift-bg text-drift-foreground font-sans selection:bg-drift-accent/30 selection:text-drift-highlight">
      {children}
    </div>
  );
}
