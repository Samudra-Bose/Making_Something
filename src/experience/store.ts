import { create } from 'zustand';

export type World = 'journey' | 'origin' | 'roast' | 'brew' | 'shop';
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
  globalProgress: number; // 0.0 to 1.0 story timeline
  
  // Shared Coffee State
  coffeeOrigin: string;
  coffeeAltitude: number; // 0 to 1, maps to elevation (e.g. 1000m - 2500m)
  roastLevel: RoastLevel;
  roastDevelopment: number; // 0 to 1, maps to progression of roasting
  
  // Shared Brew State
  brewMethod: 'v60' | 'espresso' | 'french-press';
  brewTemperature: number;
  brewRatio: number;
  brewProgress: number; // 0 to 1
  
  // Shared Shop State
  selectedProductId: string | null;
  selectedVariant: string | null; // e.g. '250g', '500g', '1kg'
  cart: { id: string; productId: string; variant: string; quantity: number; price: number }[];
  isCartOpen: boolean;
  
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
  setGlobalProgress: (p: number) => void;
  setCoffeeOrigin: (origin: string) => void;
  setCoffeeAltitude: (alt: number) => void;
  setRoastLevel: (level: RoastLevel) => void;
  setRoastDevelopment: (dev: number) => void;
  setBrewMethod: (method: 'v60' | 'espresso' | 'french-press') => void;
  setBrewTemperature: (temp: number) => void;
  setBrewRatio: (ratio: number) => void;
  setBrewProgress: (prog: number) => void;
  
  setSelectedProduct: (id: string | null) => void;
  setSelectedVariant: (variant: string | null) => void;
  addToCart: (item: { productId: string; variant: string; quantity: number; price: number }) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  hasEntered: false,
  activeWorld: 'journey',
  activeFork: 'journey',
  expandedFork: null,
  openForks: [],
  interactionMode: 'narrative',
  visualMode: 'cinematic',
  motionIntensity: 1,
  pointer: { x: -1000, y: -1000 },
  pointerVelocity: { x: 0, y: 0 },
  scroll: 0,
  globalProgress: 0,
  
  coffeeOrigin: 'Ethiopia / Guji',
  coffeeAltitude: 0.8, // default high altitude
  roastLevel: 'light',
  roastDevelopment: 0,
  
  brewMethod: 'v60',
  brewTemperature: 94,
  brewRatio: 15,
  brewProgress: 0,
  
  selectedProductId: null,
  selectedVariant: '250g',
  cart: [],
  isCartOpen: false,
  
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
  setGlobalProgress: (p) => set({ globalProgress: p }),
  
  setCoffeeOrigin: (origin) => set({ coffeeOrigin: origin }),
  setCoffeeAltitude: (alt) => set({ coffeeAltitude: alt }),
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
  
  setSelectedProduct: (id) => set({ selectedProductId: id }),
  setSelectedVariant: (variant) => set({ selectedVariant: variant }),
  addToCart: (item) => set((state) => {
    window.dispatchEvent(new CustomEvent('drift:cartAdd', { detail: { item } }));
    const existing = state.cart.find(c => c.productId === item.productId && c.variant === item.variant);
    if (existing) {
      return {
        cart: state.cart.map(c => 
          c.id === existing.id ? { ...c, quantity: c.quantity + item.quantity } : c
        )
      };
    }
    return { cart: [...state.cart, { ...item, id: crypto.randomUUID() }] };
  }),
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(c => c.id !== cartId)
  })),
  updateCartQuantity: (cartId, quantity) => set((state) => ({
    cart: state.cart.map(c => c.id === cartId ? { ...c, quantity } : c)
  })),
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
}));
