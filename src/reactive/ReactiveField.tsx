import { useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import DotGrid from './DotGrid';
import Waves from './Waves';
import { motion, AnimatePresence } from 'motion/react';

export default function ReactiveField() {
  const activeWorld = useExperienceStore((state) => state.activeWorld);
  const roastDevelopment = useExperienceStore((state) => state.roastDevelopment);
  const brewMethod = useExperienceStore((state) => state.brewMethod);
  const brewProgress = useExperienceStore((state) => state.brewProgress);
  
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
      case 'brew': 
        // Darkens and deepens as extraction progresses
        const extR = Math.floor(19 - brewProgress * 10);
        const extG = Math.floor(26 - brewProgress * 15);
        const extB = Math.floor(31 - brewProgress * 18);
        return `radial-gradient(circle at 50% 50%, rgba(${extR},${extG},${extB},1) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)`;
      case 'shop': return 'radial-gradient(circle at 50% 50%, var(--color-world-shop) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      default: return 'radial-gradient(circle at 50% 50%, #11171B 0%, #0B0F12 50%, #050708 100%)';
    }
  };

  const openForks = useExperienceStore((state) => state.openForks);

  // Helper to interpolate between two numbers
  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  // Base physics
  let waveAmpX = 40;
  let waveAmpY = 20;
  let waveSpeedX = 0.02;
  let waveSpeedY = 0.01;
  let tension = 0.01;
  let friction = 0.9;
  let maxCursorMove = 120;
  let xGap = 12;
  let yGap = 36;

  // Roast specific physics
  const getRoastPhysics = () => {
    const energy = Math.sin(roastDevelopment * Math.PI);
    return {
      xGap: 8,
      yGap: 24,
      waveAmpX: 40 + energy * 80,
      waveAmpY: 20 + energy * 60,
      waveSpeedX: 0.02 + energy * 0.06,
      waveSpeedY: 0.01 + energy * 0.04,
      tension: 0.01 + energy * 0.02,
      friction: 0.9,
      maxCursorMove: 120
    };
  };

  // Brew specific physics
  const getBrewPhysics = () => {
    let p = {
      xGap: 16, yGap: 16,
      waveAmpX: 60 - brewProgress * 20,
      waveAmpY: 15 + brewProgress * 10,
      waveSpeedX: 0.04 + brewProgress * 0.03,
      waveSpeedY: 0.005,
      tension: 0.005,
      friction: 0.96,
      maxCursorMove: 120
    };
    if (brewMethod === 'espresso') {
      p = { ...p, xGap: 8, yGap: 8, waveAmpX: 40, waveAmpY: 40, waveSpeedX: 0.06, waveSpeedY: 0.04, tension: 0.02, friction: 0.9 };
    } else if (brewMethod === 'french-press') {
      p = { ...p, xGap: 20, yGap: 20, waveSpeedX: 0.01, waveSpeedY: 0.01, waveAmpX: 30, waveAmpY: 30, friction: 0.92 };
    }
    return p;
  };

  const getShopPhysics = () => ({
    xGap: 32, yGap: 32,
    waveAmpX: 10, waveAmpY: 5,
    waveSpeedX: 0.002, waveSpeedY: 0.001,
    tension: 0.002, friction: 0.85, maxCursorMove: 60
  });

  // Composition Rule:
  // If multiple are open, active world has 70% weight, inactive open world has 30% weight
  const hasRoast = openForks.includes('roast');
  const hasBrew = openForks.includes('brew');
  
  if (hasRoast && hasBrew) {
    const roastP = getRoastPhysics();
    const brewP = getBrewPhysics();
    const weightRoast = activeWorld === 'roast' ? 0.7 : 0.3;
    
    xGap = lerp(brewP.xGap, roastP.xGap, weightRoast);
    yGap = lerp(brewP.yGap, roastP.yGap, weightRoast);
    waveAmpX = lerp(brewP.waveAmpX, roastP.waveAmpX, weightRoast);
    waveAmpY = lerp(brewP.waveAmpY, roastP.waveAmpY, weightRoast);
    waveSpeedX = lerp(brewP.waveSpeedX, roastP.waveSpeedX, weightRoast);
    waveSpeedY = lerp(brewP.waveSpeedY, roastP.waveSpeedY, weightRoast);
    tension = lerp(brewP.tension, roastP.tension, weightRoast);
    friction = lerp(brewP.friction, roastP.friction, weightRoast);
  } else if (activeWorld === 'roast') {
    const p = getRoastPhysics();
    ({ xGap, yGap, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, tension, friction, maxCursorMove } = p);
  } else if (activeWorld === 'brew') {
    const p = getBrewPhysics();
    ({ xGap, yGap, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, tension, friction, maxCursorMove } = p);
  } else if (activeWorld === 'shop') {
    const p = getShopPhysics();
    ({ xGap, yGap, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, tension, friction, maxCursorMove } = p);
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
