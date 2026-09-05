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

// ScrollTrigger defaults for the physical/narrative feel
ScrollTrigger.defaults({
  scroller: window,
  markers: false,
  toggleActions: 'play none none reverse'
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger on mount/resize to ensure calculations are correct
    ScrollTrigger.refresh();
    
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-drift-bg text-drift-foreground font-sans selection:bg-drift-accent/30 selection:text-drift-highlight">
      {children}
    </div>
  );
}
