import React from 'react';
import { useExperienceStore, World } from './store';
import { motion, AnimatePresence } from 'motion/react';

const worlds: { id: World; label: string; number: string }[] = [
  { id: 'origin', label: 'Origin', number: '01' },
  { id: 'roast', label: 'Roast', number: '02' },
  { id: 'brew', label: 'Brew', number: '03' },
  { id: 'shop', label: 'Shop', number: '04' }
];

export default function GlobalNavigation() {
  const openForks = useExperienceStore((state) => state.openForks);
  const activeFork = useExperienceStore((state) => state.activeFork);
  const openFork = useExperienceStore((state) => state.openFork);
  const closeFork = useExperienceStore((state) => state.closeFork);
  const focusFork = useExperienceStore((state) => state.focusFork);
  const hasEntered = useExperienceStore((state) => state.hasEntered);

  if (!hasEntered) return null;

  return (
    <motion.div 
      className="fixed top-0 left-0 w-full p-6 lg:p-12 z-50 flex justify-between items-start pointer-events-none mix-blend-difference"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        <h1 className="text-xl md:text-2xl font-display text-white tracking-[0.2em] uppercase">
          Drift
        </h1>
        <div className="flex gap-2 text-xs font-sans text-white/50 tracking-widest uppercase">
          {openForks.length > 0 ? `${openForks.length} active` : 'Environment'}
        </div>
      </div>

      <div className="flex gap-6 lg:gap-12 pointer-events-auto">
        {worlds.map((world) => {
          const isOpen = openForks.includes(world.id);
          const isActive = activeFork === world.id;

          return (
            <motion.button
              key={world.id}
              onClick={() => {
                if (isOpen) {
                  if (isActive) {
                    closeFork(world.id);
                  } else {
                    focusFork(world.id);
                  }
                } else {
                  openFork(world.id);
                }
              }}
              className="group relative flex flex-col items-end gap-2"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[10px] tracking-widest transition-colors duration-500 ${isOpen ? 'text-white' : 'text-white/30 group-hover:text-white/70'}`}>
                  {world.number}
                </span>
                <span className={`text-xs tracking-[0.15em] uppercase transition-colors duration-500 ${isOpen ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                  {world.label}
                </span>
              </div>
              
              {/* Active Indicator Line */}
              <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : isOpen ? 0.3 : 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'right' }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
