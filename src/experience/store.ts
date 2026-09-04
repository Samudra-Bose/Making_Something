import { create } from 'zustand';

export type World = 'origin' | 'roast' | 'brew' | 'shop';
export type VisualMode = 'default' | 'cinematic' | 'focus';

interface ExperienceState {
  hasEntered: boolean;
  activeWorld: World;
  activeFork: World | null;
  expandedFork: World | null;
  openForks: World[];
  interactionMode: 'explore' | 'commerce' | 'narrative';
  visualMode: VisualMode;
  motionIntensity: number; // 0 to 1
  pointer: { x: number; y: number };
  pointerVelocity: { x: number; y: number };
  scroll: number;
  
  // Actions
  setHasEntered: (entered: boolean) => void;
  setActiveWorld: (world: World) => void;
  openFork: (world: World) => void;
  closeFork: (world: World) => void;
  focusFork: (world: World) => void;
  expandFork: (world: World) => void;
  collapseFork: () => void;
  setPointer: (x: number, y: number) => void;
  setPointerVelocity: (vx: number, vy: number) => void;
  setScroll: (y: number) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  hasEntered: false,
  activeWorld: 'origin',
  activeFork: null,
  expandedFork: null,
  openForks: [],
  interactionMode: 'explore',
  visualMode: 'default',
  motionIntensity: 1,
  pointer: { x: -1000, y: -1000 },
  pointerVelocity: { x: 0, y: 0 },
  scroll: 0,
  
  setHasEntered: (entered) => {
    if (entered) window.dispatchEvent(new CustomEvent('drift:enter'));
    set({ hasEntered: entered });
  },
  setActiveWorld: (world) => {
    window.dispatchEvent(new CustomEvent('drift:worldChange', { detail: { world } }));
    set({ activeWorld: world });
  },
  openFork: (world) => {
    window.dispatchEvent(new CustomEvent('drift:forkOpen', { detail: { world } }));
    set((state) => ({ 
      openForks: state.openForks.includes(world) ? state.openForks : [...state.openForks, world],
      activeFork: world
    }));
  },
  closeFork: (world) => {
    window.dispatchEvent(new CustomEvent('drift:forkClose', { detail: { world } }));
    set((state) => ({
      openForks: state.openForks.filter(w => w !== world),
      activeFork: state.activeFork === world ? null : state.activeFork,
      expandedFork: state.expandedFork === world ? null : state.expandedFork
    }));
  },
  focusFork: (world) => {
    window.dispatchEvent(new CustomEvent('drift:forkFocus', { detail: { world } }));
    set({ activeFork: world });
  },
  expandFork: (world) => {
    window.dispatchEvent(new CustomEvent('drift:forkExpand', { detail: { world } }));
    set({ expandedFork: world, activeFork: world });
  },
  collapseFork: () => {
    window.dispatchEvent(new CustomEvent('drift:forkCollapse'));
    set({ expandedFork: null });
  },
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setPointerVelocity: (vx, vy) => set({ pointerVelocity: { x: vx, y: vy } }),
  setScroll: (y) => set({ scroll: y }),
}));
