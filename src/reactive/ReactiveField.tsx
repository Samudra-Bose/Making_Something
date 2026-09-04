import { useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import DotGrid from './DotGrid';
import Waves from './Waves';
import { motion, AnimatePresence } from 'motion/react';

export default function ReactiveField() {
  const activeWorld = useExperienceStore((state) => state.activeWorld);
  
  // Theme logic based on world
  const getGradient = (world: string) => {
    switch (world) {
      case 'origin': return 'radial-gradient(circle at 50% 50%, var(--color-world-origin) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'roast': return 'radial-gradient(circle at 50% 50%, var(--color-world-roast) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'brew': return 'radial-gradient(circle at 50% 50%, var(--color-world-brew) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'shop': return 'radial-gradient(circle at 50% 50%, var(--color-world-shop) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      default: return 'radial-gradient(circle at 50% 50%, #11171B 0%, #0B0F12 50%, #050708 100%)';
    }
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeWorld}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, background: getGradient(activeWorld) }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
        />
      </AnimatePresence>
      
      {/* 
        We render DotGrid and Waves once. 
        They should internally listen to ExperienceStore if they need to change physics.
      */}
      <DotGrid />
      <Waves
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
    </div>
  );
}
