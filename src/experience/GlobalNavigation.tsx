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
  const globalProgress = useExperienceStore((state) => state.globalProgress);

  if (!hasEntered) return null;

  return (
    <>
      {/* Story progress line at very top */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-drift-border/20 pointer-events-none">
        <motion.div
          className="h-full bg-drift-accent origin-left"
          style={{ scaleX: globalProgress }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      </div>
      
    <motion.div 
      className="fixed top-0 left-0 w-full p-6 lg:p-12 z-50 flex justify-between items-start pointer-events-none max-w-[100vw] overflow-x-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        <h1 className="font-display text-2xl lg:text-3xl text-drift-foreground tracking-[0.2em] uppercase">
          Drift
        </h1>
        <div className="flex gap-2 text-metadata text-drift-foreground-muted">
          {openForks.length > 0 ? `${openForks.length} active` : 'Environment'}
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 lg:gap-12 pointer-events-auto flex-wrap justify-end">
        {worlds.map((world) => {
          const isJourneyMode = openForks.length === 1 && openForks[0] === 'journey';
          const isOpen = isJourneyMode || openForks.includes(world.id);
          const isActive = isJourneyMode ? false : activeFork === world.id;

          return (
            <motion.button
              key={world.id}
              onClick={() => {
                if (isJourneyMode) {
                  const el = document.querySelector(`[data-world="${world.id}"]`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  if (isOpen) {
                    if (isActive) {
                      closeFork(world.id);
                    } else {
                      focusFork(world.id);
                    }
                  } else {
                    openFork(world.id);
                  }
                }
              }}
              className="group relative flex flex-col items-end gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground p-1"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              aria-label={isOpen ? (isActive ? `Close ${world.label}` : `Focus ${world.label}`) : `Open ${world.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <motion.span 
                  animate={{ 
                    y: isActive ? [0, -2, 0] : 0, 
                    opacity: isOpen ? 1 : 0.6 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`text-metadata transition-colors duration-500 ${isOpen ? 'text-drift-foreground' : 'text-drift-foreground-muted group-hover:text-drift-foreground/70'}`}
                >
                  {world.number}
                </motion.span>
                <motion.span 
                  animate={{ 
                    y: isActive ? [0, -2, 0] : 0, 
                    opacity: isOpen ? 1 : 0.6 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`hidden md:inline text-metadata transition-colors duration-500 ${isOpen ? 'text-drift-foreground' : 'text-drift-foreground-muted group-hover:text-drift-foreground/80'}`}
                >
                  {world.label}
                </motion.span>
              </div>
              
              {/* Active Indicator Line */}
              <div className="relative w-full h-[1px] bg-drift-border overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-drift-foreground"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? globalProgress || 1 : isOpen ? 0.3 : 0 }}
                  transition={{ duration: 0.4, ease: "linear" }}
                  style={{ transformOrigin: 'right' }}
                />
              </div>
            </motion.button>
          );
        })}
        
        {/* Cart Toggle */}
        <CartToggle />
      </div>
    </motion.div>
    </>
  );
}

function CartToggle() {
  const cart = useExperienceStore((state) => state.cart);
  const setIsCartOpen = useExperienceStore((state) => state.setIsCartOpen);
  
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <motion.button
      onClick={() => setIsCartOpen(true)}
      className="group relative flex flex-col items-end gap-2 ml-2 md:ml-4 lg:ml-12 pointer-events-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground p-1"
      whileHover={{ y: -2 }}
      aria-label={`Open Cart, ${count} items`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden md:inline text-metadata text-drift-foreground-muted group-hover:text-drift-foreground/80 transition-colors duration-500">
          Cart
        </span>
        <span className="md:hidden text-metadata text-drift-foreground-muted group-hover:text-drift-foreground/80 transition-colors duration-500">
          C
        </span>
        {count > 0 && (
          <span className="text-metadata tabular-nums text-drift-bg bg-drift-foreground px-2 py-0.5 rounded-sm">
            {count}
          </span>
        )}
      </div>
      <div className="relative w-full h-[1px] bg-drift-border overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-drift-foreground"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: count > 0 ? 0.3 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'right' }}
        />
      </div>
    </motion.button>
  );
}
