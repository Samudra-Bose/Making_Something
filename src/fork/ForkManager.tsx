import { useState, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import { AnimatePresence } from 'motion/react';
import ForkPane from './ForkPane';
import Origin from '../worlds/Origin';
import Roast from '../worlds/Roast';
import Brew from '../worlds/Brew';
import Shop from '../worlds/Shop';
import { computeForkLayout } from './ForkLayoutEngine';

export default function ForkManager() {
  const openForks = useExperienceStore((state) => state.openForks);
  const activeFork = useExperienceStore((state) => state.activeFork);
  const expandedFork = useExperienceStore((state) => state.expandedFork);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const renderWorld = (world: string) => {
    switch (world) {
      case 'origin': return <Origin />;
      case 'roast': return <Roast />;
      case 'brew': return <Brew />;
      case 'shop': return <Shop />;
      default: return null;
    }
  };

  if (openForks.length === 0 || dimensions.width === 0) return null;

  const layouts = computeForkLayout({
    openForks,
    activeFork,
    expandedFork,
    viewportWidth: dimensions.width,
    viewportHeight: dimensions.height
  });

  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {openForks.map((world) => {
          const layout = layouts[world];
          if (!layout) return null;
          
          return (
            <ForkPane 
              key={world} 
              world={world} 
              isActive={activeFork === world}
              isExpanded={expandedFork === world}
              layoutState={layout}
            >
              {renderWorld(world)}
            </ForkPane>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
