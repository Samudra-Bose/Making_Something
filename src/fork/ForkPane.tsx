import { motion } from 'motion/react';
import { useExperienceStore, World } from '../experience/store';

interface ForkPaneProps {
  world: string;
  isActive: boolean;
  isFullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function ForkPane({ world, isActive, isFullWidth, className = '', children }: ForkPaneProps) {
  const setActiveWorld = useExperienceStore((state) => state.setActiveWorld);
  const closeFork = useExperienceStore((state) => state.closeFork);
  const focusFork = useExperienceStore((state) => state.focusFork);
  const expandFork = useExperienceStore((state) => state.expandFork);
  const collapseFork = useExperienceStore((state) => state.collapseFork);
  const expandedFork = useExperienceStore((state) => state.expandedFork);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border ${
        isActive ? 'border-drift-accent/50 shadow-2xl z-20' : 'border-drift-border/30 hover:border-drift-border z-10'
      } bg-drift-surface/30 backdrop-blur-md flex-col ${isFullWidth ? 'col-span-2' : ''} ${className}`}
      onClick={() => focusFork(world as World)}
    >
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
        <h3 className={`text-xs font-sans tracking-widest uppercase ${isActive ? 'text-drift-foreground' : 'text-drift-foreground-muted'}`}>{world}</h3>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              if (expandedFork === world) {
                collapseFork();
              } else {
                expandFork(world as World);
              }
            }}
          >
            <span className="sr-only">Expand/Collapse</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              {expandedFork === world ? (
                <path d="M1 4V1H4M11 8V11H8M11 4V1H8M1 8V11H4" stroke="currentColor" strokeWidth="1.2"/>
              ) : (
                <path d="M4 1V4H1M8 11V8H11M8 1V4H11M4 11V8H1" stroke="currentColor" strokeWidth="1.2"/>
              )}
            </svg>
          </button>
          <button 
            className="text-drift-foreground-muted hover:text-drift-foreground transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              closeFork(world as World);
            }}
          >
            <span className="sr-only">Close</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full relative overflow-y-auto pointer-events-auto custom-scrollbar">
        {children}
      </div>
    </motion.div>
  );
}
