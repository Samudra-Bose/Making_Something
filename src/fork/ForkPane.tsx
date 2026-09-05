import React from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useExperienceStore, World } from '../experience/store';
import { SpatialState } from './ForkLayoutEngine';

interface ForkPaneProps {
  world: string;
  isActive: boolean;
  isExpanded: boolean;
  layoutState: SpatialState;
  children: React.ReactNode;
  key?: React.Key;
}

export default function ForkPane({ world, isActive, isExpanded, layoutState, children }: ForkPaneProps) {
  const setActiveWorld = useExperienceStore((state) => state.setActiveWorld);
  const focusFork = useExperienceStore((state) => state.focusFork);
  const closeFork = useExperienceStore((state) => state.closeFork);
  const expandFork = useExperienceStore((state) => state.expandFork);
  const collapseFork = useExperienceStore((state) => state.collapseFork);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // When dragging, we can optionally map position to environmental physics.
  // For now we rely on Framer Motion's internal drag elastic behavior to snap back.

  const handlePointerDown = () => {
    if (!isActive) {
      focusFork(world as World);
      setActiveWorld(world as World);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpanded) {
      collapseFork();
    } else {
      expandFork(world as World);
      setActiveWorld(world as World);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{
        x: layoutState.x,
        y: layoutState.y,
        width: layoutState.width,
        height: layoutState.height,
        zIndex: layoutState.zIndex,
        scale: layoutState.scale,
        opacity: layoutState.opacity
      }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ 
        type: 'spring', 
        stiffness: 150, 
        damping: 20, 
        mass: 1.5,
        opacity: { duration: 0.4 }
      }}
      drag={!isExpanded}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.15}
      dragMomentum={false}
      onPointerDown={handlePointerDown}
      style={{ x, y }}
      className={`absolute flex flex-col pointer-events-auto overflow-hidden transition-shadow ${
        isActive 
          ? 'shadow-2xl ring-1 ring-drift-foreground/15' 
          : 'shadow-md ring-1 ring-drift-border/40 hover:ring-drift-foreground/20'
      }`}
    >
      {/* Minimal World Header Strip — not a full window chrome */}
      <div 
        className="w-full px-4 py-2 flex justify-between items-center z-50 select-none cursor-grab active:cursor-grabbing border-b border-drift-border/30 shrink-0"
        style={{ background: 'transparent' }}
        onPointerDown={() => handlePointerDown()}
      >
        <span className={`text-[9px] font-sans tracking-[0.35em] uppercase transition-colors duration-300 ${
          isActive ? 'text-drift-foreground' : 'text-drift-foreground-muted'
        }`}>
          {world}
        </span>
        
        <div className="flex items-center gap-3">
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground focus-visible:outline-none transition-colors p-1"
            onClick={toggleExpand}
            title={isExpanded ? 'Collapse' : 'Expand'}
            aria-label={isExpanded ? `Collapse ${world}` : `Expand ${world}`}
          >
            {isExpanded ? (
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground focus-visible:outline-none transition-colors p-1"
            onClick={(e) => { e.stopPropagation(); closeFork(world as World); }}
            title="Close"
            aria-label={`Close ${world}`}
          >
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content Area - NOT Scrollable (Children handle scroll) */}
      <div 
        className="flex-1 w-full relative overflow-hidden"
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag when interacting with content
      >
        {/* We can conditionally dim inactive forks content */}
        <motion.div 
          animate={{ opacity: isActive ? 1 : 0.6 }} 
          className="h-full"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
