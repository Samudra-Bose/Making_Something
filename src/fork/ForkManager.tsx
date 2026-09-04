import { useExperienceStore } from '../experience/store';
import { motion, AnimatePresence } from 'motion/react';
import ForkPane from './ForkPane';
import Origin from '../worlds/Origin';
import Roast from '../worlds/Roast';
import Brew from '../worlds/Brew';
import Shop from '../worlds/Shop';

export default function ForkManager() {
  const openForks = useExperienceStore((state) => state.openForks);
  const activeFork = useExperienceStore((state) => state.activeFork);

  // Layout calculations depending on number of forks open
  const getForkLayoutClass = (count: number) => {
    switch (count) {
      case 1: return 'grid-cols-1 grid-rows-1';
      case 2: return 'grid-cols-2 grid-rows-1';
      case 3: return 'grid-cols-2 grid-rows-2'; // 3rd can span 2 cols or be empty space
      case 4: return 'grid-cols-2 grid-rows-2';
      default: return 'grid-cols-1 grid-rows-1';
    }
  };

  const renderWorld = (world: string) => {
    switch (world) {
      case 'origin': return <Origin />;
      case 'roast': return <Roast />;
      case 'brew': return <Brew />;
      case 'shop': return <Shop />;
      default: return null;
    }
  };

  if (openForks.length === 0) return null;

  return (
    <div className={`relative z-10 w-full h-full grid gap-4 p-4 ${getForkLayoutClass(openForks.length)}`}>
      <AnimatePresence>
        {openForks.map((world, index) => (
          <ForkPane 
            key={world} 
            world={world} 
            isActive={activeFork === world}
            isFullWidth={openForks.length === 3 && index === 2} // Make 3rd fork full width at bottom
          >
            {renderWorld(world)}
          </ForkPane>
        ))}
      </AnimatePresence>
    </div>
  );
}
