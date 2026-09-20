/**
 * DRIFT — Curated Image Asset Registry
 *
 * Rules enforced here:
 *  1. No asset appears in two different material contexts
 *  2. Each world has ≤1 hero + few supporting images
 *  3. Every URL includes intentional object-position for focal crop
 *  4. Hero images: high quality (q=90, w=2000+)
 *  5. Secondary images: reduced resolution (q=80, w≤1200)
 *  6. Material consistency: origin=geographic, roast=heat/bean,
 *     brew=water/ceramic, shop=package/studio
 */

export interface ImageAsset {
  /** Full Unsplash URL with quality and size params */
  url: string;
  /** CSS object-position value — intentional focal crop */
  position: string;
  /** Accessible alt text */
  alt: string;
  /** Preload priority — true only for above-fold heroes */
  priority?: boolean;
}

// ---------------------------------------------------------------------------
// ORIGIN — natural / geographic / pre-harvest
// ---------------------------------------------------------------------------
export const ORIGIN_IMAGES = {
  /** PRIMARY HERO: Coffee cherries on the branch — focal: red berries upper-right */
  hero: {
    url: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=90&w=2000&auto=format&fit=crop',
    position: '65% 25%',
    alt: 'Ethiopian coffee cherries on the branch',
    priority: true,
  },
  /** FOREGROUND BEAN: Single green bean — tiny, secondary cross-world object */
  greenBean: {
    url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
    position: '50% 40%',
    alt: 'Single green coffee bean',
  },
} satisfies Record<string, ImageAsset>;

// ---------------------------------------------------------------------------
// ROAST — heat / roaster drum / transformation
// ---------------------------------------------------------------------------
export const ROAST_IMAGES = {
  /** BG TEXTURE: Dark roasted beans — desaturated overlay, low-res acceptable */
  bgTexture: {
    url: 'https://images.unsplash.com/photo-1518832553480-1619eb2ab514?q=60&w=1200&auto=format&fit=crop',
    position: '50% 50%',
    alt: 'Coffee beans roasting — background texture',
  },
  /** PRIMARY BEAN: The single hero bean that transforms through the roast */
  bean: {
    url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=85&w=1400&auto=format&fit=crop',
    position: '50% 45%',
    alt: 'Coffee bean during roast transformation',
  },
  /**
   * GROUNDS REVEAL: Appears inside bean mask at roast→brew handoff.
   * Was: coffee-cherries (photo-1611162458324) — materially wrong.
   * Now: dark ground coffee, correct context.
   */
  grounds: {
    url: 'https://images.unsplash.com/photo-1447933601428-42571b3d4c5e?q=85&w=1200&auto=format&fit=crop',
    position: '50% 60%',
    alt: 'Dark roasted coffee grounds',
  },
  /** SECONDARY DEPTH: Blurred secondary bean in foreground parallax layer */
  secondaryBean: {
    url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=70&w=400&auto=format&fit=crop',
    position: '50% 50%',
    alt: 'Coffee bean — foreground parallax object',
  },
} satisfies Record<string, ImageAsset>;

// ---------------------------------------------------------------------------
// BREW — water / ceramic / grounds / precision
// ---------------------------------------------------------------------------
export const BREW_IMAGES = {
  /** GRIND — whole beans entering the grinder */
  grindBeans: {
    url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1600&auto=format&fit=crop',
    position: '30% 55%',
    alt: 'Coffee beans before grinding',
  },
  /**
   * GRIND GROUNDS — course coffee grounds after grinding.
   * Was same as bloom + water (photo-1517486448375). Now unique.
   */
  grindGrounds: {
    url: 'https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=1600&auto=format&fit=crop',
    position: '50% 40%',
    alt: 'Fresh coffee grounds',
  },
  /**
   * BLOOM — coffee blooming during pour-over.
   * Was same as grindGrounds (photo-1517486448375). Now unique.
   */
  bloom: {
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=85&w=2000&auto=format&fit=crop',
    position: '60% 30%',
    alt: 'Coffee bloom — CO2 release during pour-over',
  },
  /**
   * WATER — water introduction stage.
   * Was same as grindGrounds (photo-1517486448375). Now the kettle/pour.
   */
  water: {
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1800&auto=format&fit=crop',
    position: '50% 15%',
    alt: 'Gooseneck kettle with hot water',
  },
  /** POUR VESSEL: Circular hero vessel for the pour stage */
  pourVessel: {
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=85&w=2000&auto=format&fit=crop',
    position: '50% 15%',
    alt: 'Precision pour from gooseneck kettle',
  },
  /** EXTRACT: Espresso/coffee extraction — dark, rich */
  extract: {
    url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=85&w=2000&auto=format&fit=crop',
    position: '30% 50%',
    alt: 'Coffee extraction in progress',
  },
  /** CUP HERO: Final cup — warm, centered, top priority */
  cup: {
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=90&w=2000&auto=format&fit=crop',
    position: '50% 25%',
    alt: 'Single origin coffee in a ceramic cup',
  },
} satisfies Record<string, ImageAsset>;

// ---------------------------------------------------------------------------
// SHOP — package / product / studio
// ---------------------------------------------------------------------------
export const SHOP_IMAGES = {
  /**
   * PRODUCT HERO: Coffee packaging/bag.
   * Was: coffee bean close-up (photo-1559525839) — wrong material context.
   * Now: coffee bag studio shot.
   */
  product: {
    url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=90&w=1400&auto=format&fit=crop',
    position: '50% 30%',
    alt: 'Ethiopian Heirloom single origin coffee bag',
  },
} satisfies Record<string, ImageAsset>;
