import React, { useEffect } from 'react';
import AppShell from './experience/AppShell';
import ExperienceController from './experience/ExperienceController';
import ReactiveField from './reactive/ReactiveField';
import ForkManager from './fork/ForkManager';
import { useExperienceStore, World } from './experience/store';

export default function App() {
  const openForks = useExperienceStore((state) => state.openForks);
  const openFork = useExperienceStore((state) => state.openFork);
  
  // Initial setup for the demo
  useEffect(() => {
    if (openForks.length === 0) {
      openFork('origin');
    }
  }, [openForks.length, openFork]);

  return (
    <AppShell>
      <ExperienceController />
      
      {/* The Unified Background Environment */}
      <ReactiveField />

      {/* Development Navigation / Controls (Will be replaced by narrative ScrollTrigger) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-drift-surface/80 backdrop-blur-md rounded-full border border-drift-border">
        {(['origin', 'roast', 'brew', 'shop'] as World[]).map((world) => (
          <button 
            key={world}
            onClick={() => openFork(world)}
            className="px-4 py-2 text-sm uppercase tracking-widest text-drift-foreground-muted hover:text-drift-foreground transition-colors rounded-full hover:bg-white/5"
          >
            {world}
          </button>
        ))}
      </div>
      
      {/* The Window System */}
      <div className="relative z-10 w-full h-full p-4 lg:p-8 pt-24 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <ForkManager />
        </div>
      </div>
      
      {/* Site Header / Brand */}
      <header className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-none mix-blend-difference">
        <h1 className="text-2xl font-display text-white tracking-widest uppercase">Drift</h1>
        <div className="text-xs font-sans tracking-widest uppercase text-white/70">
          Coffee changes the pace of a room
        </div>
      </header>
    </AppShell>
  );
}
