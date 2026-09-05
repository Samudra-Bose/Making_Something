import React, { useEffect } from 'react';
import AppShell from './experience/AppShell';
import ExperienceController from './experience/ExperienceController';
import ReactiveField from './reactive/ReactiveField';
import ForkManager from './fork/ForkManager';
import { useExperienceStore, World } from './experience/store';
import Entry from './experience/Entry';
import Journey from './worlds/Journey';
import GlobalNavigation from './experience/GlobalNavigation';
import Cart from './experience/Cart';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const hasEntered = useExperienceStore((state) => state.hasEntered);
  const activeFork = useExperienceStore((state) => state.activeFork);
  const setActiveWorld = useExperienceStore((state) => state.setActiveWorld);

  // CRITICAL: Keep activeWorld in sync with activeFork so ReactiveField
  // uses the correct physics for the currently focused world.
  useEffect(() => {
    if (activeFork) {
      setActiveWorld(activeFork);
    }
  }, [activeFork, setActiveWorld]);

  return (
    <AppShell>
      <ExperienceController />
      
      {/* The Unified Background Environment */}
      <ReactiveField />

      {/* Cinematic Entry Experience */}
      <AnimatePresence>
        {!hasEntered && <Entry key="entry" />}
      </AnimatePresence>

      {/* Global Navigation Shell */}
      <GlobalNavigation />
      
      {/* Cart Drawer */}
      <Cart />
      
      {/* The Window System */}
      <div className="relative z-10 w-full min-h-screen pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          {hasEntered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {openForks.length === 1 && openForks[0] === 'journey' ? (
                <Journey />
              ) : (
                <ForkManager />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

