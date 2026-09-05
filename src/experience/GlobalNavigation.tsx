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
      className="fixed top-0 left-0 w-full p-6 lg:p-12 z-50 flex justify-between items-start pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        <h1 className="text-xl md:text-2xl font-display text-drift-foreground tracking-[0.2em] uppercase">
          Drift
        </h1>
        <div className="flex gap-2 text-[10px] font-sans text-drift-foreground-muted tracking-widest uppercase">
          {openForks.length > 0 ? `${openForks.length} active` : 'Environment'}
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 lg:gap-12 pointer-events-auto">
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
              className="group relative flex flex-col items-end gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground p-1"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              aria-label={isOpen ? (isActive ? `Close ${world.label}` : `Focus ${world.label}`) : `Open ${world.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <span className={`text-[10px] tracking-widest transition-colors duration-500 ${isOpen ? 'text-drift-foreground' : 'text-drift-foreground-muted/50 group-hover:text-drift-foreground/70'}`}>
                  {world.number}
                </span>
                <span className={`hidden md:inline text-[10px] tracking-[0.15em] uppercase transition-colors duration-500 ${isOpen ? 'text-drift-foreground' : 'text-drift-foreground-muted group-hover:text-drift-foreground/80'}`}>
                  {world.label}
                </span>
              </div>
              
              {/* Active Indicator Line */}
              <div className="relative w-full h-[1px] bg-drift-border overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-drift-foreground"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : isOpen ? 0.3 : 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
        <span className="hidden md:inline text-[10px] tracking-[0.15em] uppercase text-drift-foreground-muted group-hover:text-drift-foreground/80 transition-colors duration-500">
          Cart
        </span>
        <span className="md:hidden text-[10px] tracking-[0.15em] uppercase text-drift-foreground-muted group-hover:text-drift-foreground/80 transition-colors duration-500">
          C
        </span>
        {count > 0 && (
          <span className="text-[10px] tabular-nums tracking-widest text-drift-bg bg-drift-foreground px-2 py-0.5 rounded-sm">
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
