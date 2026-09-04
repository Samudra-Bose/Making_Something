import { motion } from 'motion/react';
import { useExperienceStore, World } from '../experience/store';

interface ForkPaneProps {
  world: string;
  isActive: boolean;
  isFullWidth?: boolean;
  children: React.ReactNode;
}

export default function ForkPane({ world, isActive, isFullWidth, children }: ForkPaneProps) {
  const setActiveWorld = useExperienceStore((state) => state.setActiveWorld);
  const closeFork = useExperienceStore((state) => state.closeFork);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border ${
        isActive ? 'border-drift-accent/50 shadow-2xl z-20' : 'border-drift-border/30 hover:border-drift-border z-10'
      } bg-drift-surface/30 backdrop-blur-md flex flex-col ${isFullWidth ? 'col-span-2' : ''}`}
      onClick={() => setActiveWorld(world as World)}
    >
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
        <h3 className="text-xs font-sans tracking-widest uppercase text-drift-foreground-muted">{world}</h3>
        <button 
          className="pointer-events-auto text-drift-foreground-muted hover:text-drift-foreground transition-colors p-2"
          onClick={(e) => {
            e.stopPropagation();
            closeFork(world as World);
          }}
        >
          <span className="sr-only">Close</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 w-full h-full relative overflow-y-auto pointer-events-auto custom-scrollbar">
        {children}
      </div>
    </motion.div>
  );
}
