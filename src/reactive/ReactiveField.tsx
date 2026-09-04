import { useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import DotGrid from './DotGrid';
import Waves from './Waves';
import { motion, AnimatePresence } from 'motion/react';

export default function ReactiveField() {
  const activeWorld = useExperienceStore((state) => state.activeWorld);
  const roastDevelopment = useExperienceStore((state) => state.roastDevelopment);
  
  // Theme logic based on world
  const getGradient = (world: string) => {
    switch (world) {
      case 'origin': return 'radial-gradient(circle at 50% 50%, var(--color-world-origin) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'roast': 
        // When roasting, we intensify the heat (orange/red) based on development. 
        // Max heat around 0.5 (first crack), then it darkens.
        const heat = Math.sin(roastDevelopment * Math.PI) * 0.5; 
        const r = Math.floor(42 + heat * 150);
        const g = Math.floor(28 + heat * 50);
        const b = Math.floor(22 + heat * 10);
        return `radial-gradient(circle at 50% 50%, rgba(${r},${g},${b},1) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)`;
      case 'brew': return 'radial-gradient(circle at 50% 50%, var(--color-world-brew) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'shop': return 'radial-gradient(circle at 50% 50%, var(--color-world-shop) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      default: return 'radial-gradient(circle at 50% 50%, #11171B 0%, #0B0F12 50%, #050708 100%)';
    }
  };

  // Compute physics based on world and development
  let waveAmpX = 40;
  let waveAmpY = 20;
  let waveSpeedX = 0.02;
  let waveSpeedY = 0.01;
  let tension = 0.01;
  let friction = 0.9;
  let maxCursorMove = 120;
  let xGap = 12;
  let yGap = 36;
  
  if (activeWorld === 'roast') {
    // Denser
    xGap = 8;
    yGap = 24;
    // More energetic during transformation
    const energy = Math.sin(roastDevelopment * Math.PI); // 0 at start, 1 at peak, 0 at end
    waveAmpX = 40 + energy * 80;
    waveAmpY = 20 + energy * 60;
    waveSpeedX = 0.02 + energy * 0.06;
    waveSpeedY = 0.01 + energy * 0.04;
    tension = 0.01 + energy * 0.02; // snappier
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeWorld}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          style={{ background: getGradient(activeWorld) }}
        />
      </AnimatePresence>
      
      {/* 
        We render DotGrid and Waves once. 
        They internally listen to props which triggers re-render or effect updates.
      */}
      <DotGrid />
      <Waves
        backgroundColor="transparent"
        waveSpeedX={waveSpeedX}
        waveSpeedY={waveSpeedY}
        waveAmpX={waveAmpX}
        waveAmpY={waveAmpY}
        friction={friction}
        tension={tension}
        maxCursorMove={maxCursorMove}
        xGap={xGap}
        yGap={yGap}
      />
    </div>
  );
}
