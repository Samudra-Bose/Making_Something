import { useEffect, useState } from 'react';
import { useExperienceStore } from '../experience/store';
import DotGrid from './DotGrid';
import Waves from './Waves';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollVelocity } from './useScrollVelocity';

export default function ReactiveField() {
  const globalProgress = useExperienceStore((state) => state.globalProgress);
  const scroll = useExperienceStore((state) => state.scroll);
  
  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  // 19. REACTIVE FIELD intensity curve
  const getIntensity = (p: number) => {
    if (p <= 0.15) return lerp(0.20, 0.30, p / 0.15);
    if (p <= 0.35) return lerp(0.30, 0.55, (p - 0.15) / 0.20);
    if (p <= 0.50) return lerp(0.55, 0.80, (p - 0.35) / 0.15);
    if (p <= 0.55) return lerp(0.80, 0.65, (p - 0.50) / 0.05);
    if (p <= 0.65) return lerp(0.65, 0.90, (p - 0.55) / 0.10);
    if (p <= 0.75) return lerp(0.90, 0.65, (p - 0.65) / 0.10);
    if (p <= 0.90) return lerp(0.65, 0.35, (p - 0.75) / 0.15);
    return lerp(0.35, 0.20, (p - 0.90) / 0.10);
  };

  const intensity = getIntensity(globalProgress);

  // Scroll velocity multiplier
  const rawVelocity = useScrollVelocity(scroll);
  const velocityMultiplier = 1.0 + Math.min(0.35, Math.abs(rawVelocity) * 0.05); 
  
  // 19. MULTI-WINDOW MODE Intensity Scaling
  const openForks = useExperienceStore((state) => state.openForks);
  let modeMultiplier = 1.0;
  if (openForks.length === 2) {
    modeMultiplier = 0.6; // average
  } else if (openForks.length > 2) {
    modeMultiplier = 0.3; // grid view
  }

  const finalIntensity = intensity * velocityMultiplier * modeMultiplier;

  // Map intensity to properties
  const xGap = lerp(40, 8, finalIntensity);
  const yGap = lerp(40, 8, finalIntensity);
  const waveAmpX = lerp(10, 80, finalIntensity);
  const waveAmpY = lerp(10, 80, finalIntensity);
  const waveSpeedX = lerp(0.002, 0.04, finalIntensity);
  const waveSpeedY = lerp(0.002, 0.04, finalIntensity);
  const tension = lerp(0.002, 0.05, finalIntensity);
  const friction = lerp(0.95, 0.80, finalIntensity);
  const maxCursorMove = lerp(60, 200, finalIntensity);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none mix-blend-multiply opacity-20">
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
