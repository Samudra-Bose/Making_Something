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

  const expandedFork = useExperienceStore((state) => state.expandedFork);

  // Layout calculations depending on number of forks open
  const getForkLayoutClass = (count: number, expanded: boolean) => {
    if (expanded) return 'grid-cols-1 grid-rows-1';
    switch (count) {
      case 1: return 'grid-cols-1 grid-rows-1';
      case 2: return 'grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:grid-rows-1';
      case 3: return 'grid-cols-1 lg:grid-cols-2 grid-rows-3 lg:grid-rows-2'; // 3rd can span 2 cols or be empty space
      case 4: return 'grid-cols-1 lg:grid-cols-2 grid-rows-4 lg:grid-rows-2';
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

  const isExpanded = !!expandedFork;

  return (
    <div className={`relative z-10 w-full h-full grid gap-4 p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getForkLayoutClass(openForks.length, isExpanded)}`}>
      <AnimatePresence mode="popLayout">
        {openForks.map((world, index) => {
          // If a fork is expanded and it's not this one, hide it completely
          if (isExpanded && expandedFork !== world) return null;

          const isActive = activeFork === world;

          return (
            <ForkPane 
              key={world} 
              world={world} 
              isActive={isActive}
              isFullWidth={!isExpanded && openForks.length === 3 && index === 2} // Make 3rd fork full width at bottom if not expanded
              // on mobile (max-lg), hide non-active forks
              className={!isExpanded && !isActive ? 'hidden lg:flex' : 'flex'}
            >
              {renderWorld(world)}
            </ForkPane>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
