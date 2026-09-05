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
  const scroll = useExperienceStore((state) => state.scroll);
  
  // Helper to interpolate between two numbers
  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  const coffeeAltitude = useExperienceStore((state) => state.coffeeAltitude);

  const openForks = useExperienceStore((state) => state.openForks);

  // Theme logic based on world
  const getGradient = (world: string) => {
    switch (world) {
      case 'origin': return 'radial-gradient(circle at 50% 50%, var(--color-world-origin) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'roast': return 'radial-gradient(circle at 50% 50%, var(--color-world-roast) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'brew': return 'radial-gradient(circle at 50% 50%, var(--color-world-brew) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      case 'shop': return 'radial-gradient(circle at 50% 50%, var(--color-world-shop) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
      default: return 'radial-gradient(circle at 50% 50%, var(--color-drift-surface-hover) 0%, var(--color-drift-surface) 50%, var(--color-drift-bg) 100%)';
    }
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

  // Origin physics based on Altitude (Terrain / Wind / Elevation)
  const getOriginPhysics = () => {
    // higher altitude = wider spacing (thinner air), more wind (waveAmp)
    return {
      xGap: 8 + coffeeAltitude * 12, // 8 to 20
      yGap: 24 + coffeeAltitude * 24, // 24 to 48
      waveAmpX: 30 + coffeeAltitude * 40,
      waveAmpY: 10 + coffeeAltitude * 20,
      waveSpeedX: 0.01 + coffeeAltitude * 0.02,
      waveSpeedY: 0.005 + coffeeAltitude * 0.01,
      tension: 0.01,
      friction: 0.94,
      maxCursorMove: 100
    };
  };

  // Roast specific physics based on Development (Heat / Expansion / Pressure)
  const getRoastPhysics = () => {
    // defaults
    let p = {
      xGap: 12, yGap: 36,
      waveAmpX: 40, waveAmpY: 20,
      waveSpeedX: 0.02, waveSpeedY: 0.01,
      tension: 0.01, friction: 0.9, maxCursorMove: 120
    };
    
    // GREEN: 0 to 0.15 (granular, quiet)
    if (roastDevelopment < 0.15) {
      const stageP = roastDevelopment / 0.15;
      p.xGap = lerp(4, 6, stageP);
      p.yGap = lerp(4, 6, stageP);
      p.waveAmpX = lerp(5, 15, stageP);
      p.waveAmpY = lerp(5, 10, stageP);
      p.waveSpeedX = 0.002;
      p.waveSpeedY = 0.002;
      p.friction = 0.8;
      p.tension = 0.05;
    }
    // HEAT: 0.15 to 0.35 (increasing turbulence)
    else if (roastDevelopment < 0.35) {
      const stageP = (roastDevelopment - 0.15) / 0.20;
      p.xGap = lerp(6, 12, stageP);
      p.yGap = lerp(6, 16, stageP);
      p.waveAmpX = lerp(15, 60, stageP);
      p.waveAmpY = lerp(10, 30, stageP);
      p.waveSpeedX = lerp(0.002, 0.04, stageP);
      p.waveSpeedY = lerp(0.002, 0.02, stageP);
      p.tension = lerp(0.05, 0.015, stageP);
    }
    // YELLOW: 0.35 to 0.50 (more directional)
    else if (roastDevelopment < 0.50) {
      const stageP = (roastDevelopment - 0.35) / 0.15;
      p.xGap = lerp(12, 8, stageP);
      p.yGap = lerp(16, 40, stageP); // Stretch Y
      p.waveAmpX = lerp(60, 30, stageP);
      p.waveAmpY = lerp(30, 80, stageP);
      p.waveSpeedX = 0.01;
      p.waveSpeedY = lerp(0.02, 0.08, stageP);
      p.tension = 0.01;
    }
    // FIRST CRACK: 0.50 to 0.65 (brief spatial disturbance)
    else if (roastDevelopment < 0.65) {
      const stageP = (roastDevelopment - 0.50) / 0.15;
      const crackIntensity = Math.sin(stageP * Math.PI); // Peaks at middle of first crack
      p.xGap = lerp(8, 20, stageP) - crackIntensity * 4;
      p.yGap = lerp(40, 20, stageP) - crackIntensity * 4;
      p.waveAmpX = 30 + crackIntensity * 100;
      p.waveAmpY = 30 + crackIntensity * 100;
      p.waveSpeedX = 0.02 + crackIntensity * 0.1;
      p.waveSpeedY = 0.02 + crackIntensity * 0.1;
      p.tension = 0.01 + crackIntensity * 0.05;
      p.friction = 0.9 - crackIntensity * 0.1;
    }
    // DEVELOPMENT: 0.65 to 0.88 (deeper, denser)
    else if (roastDevelopment < 0.88) {
      const stageP = (roastDevelopment - 0.65) / 0.23;
      p.xGap = lerp(20, 10, stageP);
      p.yGap = lerp(20, 10, stageP);
      p.waveAmpX = lerp(30, 50, stageP);
      p.waveAmpY = lerp(30, 20, stageP);
      p.waveSpeedX = lerp(0.02, 0.005, stageP);
      p.waveSpeedY = lerp(0.02, 0.005, stageP);
      p.friction = lerp(0.9, 0.95, stageP);
      p.tension = 0.01;
    }
    // CHARACTER: 0.88 to 1.0 (slow settling)
    else {
      const stageP = (roastDevelopment - 0.88) / 0.12;
      p.xGap = lerp(10, 16, stageP);
      p.yGap = lerp(10, 16, stageP);
      p.waveAmpX = lerp(50, 15, stageP);
      p.waveAmpY = lerp(20, 15, stageP);
      p.waveSpeedX = lerp(0.005, 0.001, stageP);
      p.waveSpeedY = lerp(0.005, 0.001, stageP);
      p.friction = 0.95;
      p.tension = lerp(0.01, 0.002, stageP);
    }
    
    // Roast level affects late-stage density and tension
    if (roastDevelopment > 0.65) {
      if (roastLevel === 'light') {
        p.waveAmpX *= 1.2;
        p.tension *= 1.5;
      } else if (roastLevel === 'dark') {
        p.xGap *= 0.8;
        p.yGap *= 0.8;
        p.friction *= 1.02; // More sluggish/heavy
      }
    }
    
    return p;
  };

  // Brew specific physics (Water / Flow / Vortex)
  const getBrewPhysics = () => {
    let p = {
      xGap: 16, yGap: 16,
      waveAmpX: 30, waveAmpY: 15,
      waveSpeedX: 0.02, waveSpeedY: 0.005,
      tension: 0.005, friction: 0.96, maxCursorMove: 120
    };
    
    // Grind: 0 to 0.15
    if (brewProgress < 0.15) {
      const stageP = brewProgress / 0.15;
      p.xGap = lerp(8, 4, stageP);
      p.yGap = lerp(8, 4, stageP);
      p.friction = 0.85; // granular
      p.tension = 0.02;
    } 
    // Water: 0.15 to 0.3
    else if (brewProgress < 0.3) {
      const stageP = (brewProgress - 0.15) / 0.15;
      p.xGap = lerp(4, 20, stageP);
      p.yGap = lerp(4, 20, stageP);
      p.waveAmpX = lerp(10, 60, stageP);
      p.waveAmpY = lerp(10, 30, stageP);
      p.waveSpeedX = 0.04; // smooth wave
    }
    // Bloom: 0.3 to 0.45
    else if (brewProgress < 0.45) {
      const stageP = (brewProgress - 0.3) / 0.15;
      p.xGap = lerp(20, 30, stageP); // expansion
      p.yGap = lerp(20, 30, stageP);
      p.tension = lerp(0.005, 0.03, stageP); // pressure-like
      p.waveAmpX = lerp(60, 20, stageP);
    }
    // Pour: 0.45 to 0.65
    else if (brewProgress < 0.65) {
      p.waveSpeedY = 0.05; // vertical/directional flow
      p.waveAmpY = 50;
      p.xGap = 16;
      p.yGap = 24;
      p.tension = 0.01;
    }
    // Extraction: 0.65 to 0.85
    else if (brewProgress < 0.85) {
      p.xGap = 16;
      p.yGap = 16;
      p.waveAmpX = 20;
      p.waveAmpY = 10;
      p.waveSpeedX = 0.02;
      p.waveSpeedY = 0.01; // calmer flowing
    }
    // Cup: 0.85 to 1.0
    else {
      p.xGap = 24;
      p.yGap = 24;
      p.waveAmpX = 10;
      p.waveAmpY = 5;
      p.waveSpeedX = 0.005; // slower atmospheric
      p.waveSpeedY = 0.002;
    }

    if (brewMethod === 'espresso') {
      p.xGap = Math.max(2, p.xGap * 0.5);
      p.yGap = Math.max(2, p.yGap * 0.5);
      p.tension *= 2;
    } else if (brewMethod === 'french-press') {
      p.xGap *= 1.5;
      p.yGap *= 1.5;
      p.waveSpeedX *= 0.5;
    }

    return p;
  };

  // Shop physics (Restrained)
  const getShopPhysics = () => ({
    xGap: 32, yGap: 32,
    waveAmpX: 10, waveAmpY: 5,
    waveSpeedX: 0.002, waveSpeedY: 0.001,
    tension: 0.002, friction: 0.85, maxCursorMove: 60
  });

  // Apply physics based on active world (driving it by coffee state)
  if (activeWorld === 'origin') {
    const p = getOriginPhysics();
    ({ xGap, yGap, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, tension, friction, maxCursorMove } = p);
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

  // Scroll-driven deformation
  // A subtle breathing or distortion based on scroll velocity/position
  const scrollFactor = Math.min(1, scroll / 2000);
  waveAmpY += scrollFactor * 30;
  tension -= scrollFactor * 0.005;

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
