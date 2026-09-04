import { create } from 'zustand';

export type World = 'origin' | 'roast' | 'brew' | 'shop';
export type VisualMode = 'default' | 'cinematic' | 'focus';

export type RoastLevel = 'light' | 'medium' | 'medium-dark' | 'dark';

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
  
  // Shared Coffee State
  coffeeOrigin: string;
  roastLevel: RoastLevel;
  roastDevelopment: number; // 0 to 1, maps to progression of roasting
  
  // Shared Brew State
  brewMethod: 'v60' | 'espresso' | 'french-press';
  brewTemperature: number;
  brewRatio: number;
  brewProgress: number; // 0 to 1
  
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
  setCoffeeOrigin: (origin: string) => void;
  setRoastLevel: (level: RoastLevel) => void;
  setRoastDevelopment: (dev: number) => void;
  setBrewMethod: (method: 'v60' | 'espresso' | 'french-press') => void;
  setBrewTemperature: (temp: number) => void;
  setBrewRatio: (ratio: number) => void;
  setBrewProgress: (prog: number) => void;
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
  
  coffeeOrigin: 'Ethiopia / Guji',
  roastLevel: 'light',
  roastDevelopment: 0,
  
  brewMethod: 'v60',
  brewTemperature: 94,
  brewRatio: 15,
  brewProgress: 0,
  
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
  
  setCoffeeOrigin: (origin) => set({ coffeeOrigin: origin }),
  setRoastLevel: (level) => {
    window.dispatchEvent(new CustomEvent('drift:roastLevelChange', { detail: { level } }));
    set({ roastLevel: level });
  },
  setRoastDevelopment: (dev) => set({ roastDevelopment: dev }),
  setBrewMethod: (method) => {
    window.dispatchEvent(new CustomEvent('drift:brewMethodChange', { detail: { method } }));
    set({ brewMethod: method });
  },
  setBrewTemperature: (temp) => set({ brewTemperature: temp }),
  setBrewRatio: (ratio) => set({ brewRatio: ratio }),
  setBrewProgress: (prog) => set({ brewProgress: prog }),
}));
