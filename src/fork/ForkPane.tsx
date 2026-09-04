import { motion, useMotionValue, useTransform } from 'motion/react';
import { useExperienceStore, World } from '../experience/store';
import { SpatialState } from './ForkLayoutEngine';

interface ForkPaneProps {
  world: string;
  isActive: boolean;
  isExpanded: boolean;
  layoutState: SpatialState;
  children: React.ReactNode;
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
      style={{ x, y }} // Used for drag offset, which snaps back because of dragConstraints
      className={`absolute overflow-hidden flex flex-col pointer-events-auto bg-drift-surface/30 backdrop-blur-md border ${
        isActive 
          ? 'border-drift-accent/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'border-drift-border/30 hover:border-drift-border/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
      }`}
      // Use subtle rounding, architectural feel
      style={{ borderRadius: '4px' }}
    >
      {/* Window Chrome / Header - Draggable Area */}
      <div 
        className="w-full px-4 py-3 flex justify-between items-center z-50 select-none cursor-grab active:cursor-grabbing bg-black/10 backdrop-blur-sm border-b border-white/5"
        onPointerDown={(e) => {
          // ensure focus happens when clicking header too
          handlePointerDown();
        }}
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-drift-accent/60 block" />
          <h3 className="text-xs font-sans tracking-[0.2em] uppercase text-drift-foreground/90 font-medium">{world}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground transition-colors p-1"
            onClick={toggleExpand}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground transition-colors p-1"
            onClick={(e) => {
              e.stopPropagation();
              closeFork(world as World);
            }}
            title="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content Area - Scrollable but NOT draggable */}
      <div 
        className="flex-1 w-full relative overflow-y-auto custom-scrollbar"
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
