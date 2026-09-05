import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useExperienceStore } from '../experience/store';
import { DRIFT_COLLECTION, Product } from '../data/products';
import { useShockwave } from '../reactive/useShockwave';
import { AntiGravity } from '../reactive/AntiGravity';

// Awwwards-quality stagger reveal for cards
function useStaggerReveal(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return { ref, isInView };
}

export default function Shop() {
  const selectedProductId = useExperienceStore((state) => state.selectedProductId);
  const setSelectedProduct = useExperienceStore((state) => state.setSelectedProduct);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  const brewMethod = useExperienceStore((state) => state.brewMethod);
  const hasAutoSelected = React.useRef(false);

  React.useEffect(() => {
    if (!selectedProductId && !hasAutoSelected.current) {
      let bestMatch = DRIFT_COLLECTION.find(p => p.roast === roastLevel && p.recommendedBrew === brewMethod);
      if (!bestMatch) bestMatch = DRIFT_COLLECTION.find(p => p.roast === roastLevel);
      if (!bestMatch) bestMatch = DRIFT_COLLECTION.find(p => p.recommendedBrew === brewMethod);
      
      if (bestMatch) {
        hasAutoSelected.current = true;
        const timer = setTimeout(() => {
          setSelectedProduct(bestMatch!.id);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [roastLevel, brewMethod, selectedProductId, setSelectedProduct]);

  const activeFork = useExperienceStore((state) => state.activeFork);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (activeFork === 'shop') {
      useExperienceStore.getState().setScroll(e.currentTarget.scrollTop);
      useExperienceStore.getState().setGlobalProgress(0.78 + (e.currentTarget.scrollTop / e.currentTarget.scrollHeight) * 0.22);
    }
  };

  return (
    <div onScroll={handleScroll} className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
      <AnimatePresence mode="wait">
        {!selectedProductId ? (
          <ProductGrid key="grid" onSelect={setSelectedProduct} />
        ) : (
          <ProductDetail key="detail" productId={selectedProductId} onBack={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Unique curated images per product — different subjects, same editorial B&W treatment
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop', // Ethiopia cherries
  'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1200&auto=format&fit=crop', // Guatemala highlands
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1200&auto=format&fit=crop', // Brazil beans
];

function ProductGrid({ onSelect }: { onSelect: (id: string) => void; key?: React.Key }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-5% 0px' });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="p-8 lg:p-16 pt-10 min-h-full flex flex-col"
    >
      {/* Header — line reveal */}
      <motion.header 
        className="mb-16 overflow-hidden border-b border-drift-border pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="overflow-hidden">
          <motion.p
            className="text-[10px] tracking-[0.4em] uppercase text-drift-accent mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Collection
          </motion.p>
        </div>
        <div className="overflow-hidden">
          <motion.h2 
            className="text-4xl lg:text-6xl font-display font-medium tracking-tight"
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            Curated outcomes<br/>of exploration.
          </motion.h2>
        </div>
      </motion.header>

      {/* Grid — staggered clip-path card reveals */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-drift-border pb-32">
        {DRIFT_COLLECTION.map((product, index) => (
          <motion.button
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ 
              duration: 0.7, 
              delay: 0.1 + index * 0.12,
              ease: [0.22, 1, 0.36, 1]
            }}
            onClick={() => onSelect(product.id)}
            aria-label={`View ${product.name}`}
            className="group flex flex-col text-left cursor-pointer bg-drift-bg hover:bg-drift-surface transition-colors duration-500 p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-drift-accent relative overflow-hidden"
          >
            {/* Slide-up overlay on hover */}
            <div className="absolute inset-0 bg-drift-foreground/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]" />

            {/* Product number + price */}
            <div className="flex justify-between items-start mb-6 w-full relative z-10">
              <span className="text-[9px] tracking-[0.3em] text-drift-foreground-muted uppercase">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-display tracking-tight text-drift-foreground tabular-nums">
                ${product.price}
              </span>
            </div>

            {/* Image — grayscale, hover color */}
            <div className="w-full aspect-[4/3] mb-8 overflow-hidden relative z-10">
              <img 
                src={PRODUCT_IMAGES[index] || PRODUCT_IMAGES[0]}
                alt={product.name}
                className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>

            {/* Name */}
            <div className="flex-1 relative z-10">
              <div className="overflow-hidden">
                <h3 className="text-2xl lg:text-3xl font-display mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  {product.name}
                </h3>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-drift-foreground-muted">
                {product.origin} &middot; {product.region}
              </p>
            </div>

            {/* Bottom metadata + CTA */}
            <div className="mt-8 pt-6 border-t border-drift-border/50 flex justify-between items-end relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-widest text-drift-foreground-muted">Profile</span>
                <span className="text-xs text-drift-foreground">{product.flavorProfile.slice(0, 2).join(', ')}</span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted flex items-center gap-2 group-hover:text-drift-foreground transition-colors">
                View
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                >
                  &rarr;
                </motion.span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ProductDetail({ productId, onBack }: { productId: string; onBack: () => void; key?: React.Key }) {
  const product = DRIFT_COLLECTION.find(p => p.id === productId);
  const imgIndex = DRIFT_COLLECTION.findIndex(p => p.id === productId);
  
  const selectedVariant = useExperienceStore((state) => state.selectedVariant);
  const setSelectedVariant = useExperienceStore((state) => state.setSelectedVariant);
  const addToCart = useExperienceStore((state) => state.addToCart);
  
  const setCoffeeOrigin = useExperienceStore((state) => state.setCoffeeOrigin);
  const setRoastLevel = useExperienceStore((state) => state.setRoastLevel);
  const setBrewMethod = useExperienceStore((state) => state.setBrewMethod);
  const focusFork = useExperienceStore((state) => state.focusFork);
  const openFork = useExperienceStore((state) => state.openFork);
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  if (!product) return null;

  React.useEffect(() => {
    setCoffeeOrigin(`${product.origin} / ${product.name}`);
    setRoastLevel(product.roast);
    setBrewMethod(product.recommendedBrew);
  }, [product]);

  const variants = [
    { id: '250g', label: '250g', multiplier: 1 },
    { id: '500g', label: '500g', multiplier: 1.8 },
    { id: '1kg',  label: '1kg',  multiplier: 3.2 }
  ];

  const currentVariant = variants.find(v => v.id === selectedVariant) || variants[0];
  const finalPrice = Math.floor(product.price * currentVariant.multiplier);
  
  const triggerShockwave = useShockwave();

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart({
      productId: product.id,
      variant: currentVariant.id,
      quantity: 1,
      price: finalPrice
    });
    triggerShockwave(e.clientX, e.clientY, 1.5);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const navigateContext = (world: 'origin' | 'roast' | 'brew') => {
    openFork(world);
    focusFork(world);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 lg:p-16 pt-10 min-h-full flex flex-col max-w-5xl mx-auto"
    >
      {/* Back button — fixed arrow */}
      <motion.button 
        onClick={onBack}
        className="self-start text-[10px] tracking-[0.25em] uppercase text-drift-foreground-muted hover:text-drift-foreground transition-colors mb-12 flex items-center gap-3 focus-visible:outline-none group"
        whileHover={{ x: -3 }}
        aria-label="Return to Collection"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">&larr;</span>
        Return to Collection
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Story & Data */}
        <div>
          <div className="mb-12 relative">
            <AntiGravity depth={0.3} className="w-full aspect-[4/3] mb-10 overflow-hidden relative">
              <img 
                src={PRODUCT_IMAGES[imgIndex >= 0 ? imgIndex : 0]}
                alt={product.name}
                className="w-full h-full object-cover filter grayscale contrast-110"
              />
              {/* Editorial crop indicator */}
              <div className="absolute inset-4 border border-drift-foreground/20 pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-[9px] tracking-[0.25em] uppercase text-drift-bg mix-blend-difference">
                {product.origin} &middot; {product.region}
              </div>
            </AntiGravity>

            <div className="overflow-hidden">
              <motion.h2 
                className="text-4xl lg:text-6xl font-display font-medium tracking-tight mb-2"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {product.name}
              </motion.h2>
            </div>
            <motion.p 
              className="text-[10px] tracking-[0.3em] uppercase text-drift-foreground-muted mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {product.origin} &middot; {product.region}
            </motion.p>
            <motion.p 
              className="text-drift-foreground/70 leading-relaxed font-sans text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {product.description}
            </motion.p>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-drift-border/40">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-2">Process</div>
              <div className="text-sm font-display">{product.process}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-2">Tasting Notes</div>
              <div className="text-sm">{product.flavorProfile.join(', ')}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-2">Roast</div>
              <div className="text-sm capitalize font-display">{product.roast}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-2">Recommended</div>
              <div className="text-sm capitalize">{product.recommendedBrew === 'v60' ? 'Pour Over' : product.recommendedBrew === 'espresso' ? 'Espresso' : 'French Press'}</div>
            </div>
          </div>

          {/* Context links */}
          <div className="mt-16 pt-8 border-t border-drift-border/30">
            <h3 className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-6">Experience Context</h3>
            <div className="flex flex-col gap-0">
              <ContextLink label="Discover Origin" world="origin" onClick={() => navigateContext('origin')} />
              <ContextLink label={`Roast Profile · ${product.roast}`} world="roast" onClick={() => navigateContext('roast')} />
              <ContextLink label={`Brew Guide · ${product.recommendedBrew === 'v60' ? 'Pour Over' : product.recommendedBrew}`} world="brew" onClick={() => navigateContext('brew')} />
            </div>
          </div>
        </div>

        {/* Right: Commerce */}
        <div className="flex flex-col">
          <div className="sticky top-8">
            {/* Price */}
            <div className="flex items-baseline justify-between mb-10 pb-8 border-b border-drift-border">
              <div className="text-5xl lg:text-6xl font-display text-drift-foreground tracking-tighter tabular-nums">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={finalPrice}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${finalPrice}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-[9px] text-drift-foreground-muted tracking-widest uppercase">One-time</div>
            </div>

            {/* Weight selector — animated active state */}
            <div className="mb-10">
              <div className="text-[9px] uppercase tracking-widest text-drift-foreground-muted mb-4">Select Weight</div>
              <div className="flex gap-0 border border-drift-border relative overflow-hidden">
                {variants.map((v, vi) => {
                  const isSelected = selectedVariant === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`relative flex-1 py-4 text-xs tracking-widest uppercase transition-colors duration-300 z-10 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-drift-accent ${
                        isSelected
                          ? 'text-drift-bg'
                          : 'text-drift-foreground-muted hover:text-drift-foreground'
                      } ${vi < variants.length - 1 ? 'border-r border-drift-border' : ''}`}
                      aria-label={`Select ${v.label} weight`}
                      aria-pressed={isSelected}
                    >
                      {/* Animated fill background */}
                      {isSelected && (
                        <motion.div
                          layoutId="variant-fill"
                          className="absolute inset-0 bg-drift-foreground z-[-1]"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add to Cart — magnetic CTA */}
            <motion.button
              onClick={handleAddToCart}
              className="relative w-full py-5 text-xs font-medium tracking-[0.25em] uppercase overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-accent focus-visible:ring-offset-2"
              whileTap={{ scale: 0.98 }}
              aria-label={`Add ${product.name} to cart`}
            >
              {/* Base: dark fill */}
              <div className="absolute inset-0 bg-drift-foreground transition-transform duration-500 group-hover:scale-105" />
              {/* Hover: accent fill wipes in from left */}
              <div className="absolute inset-0 bg-drift-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
              <span className="relative z-10 text-drift-bg transition-colors duration-300">
                <AnimatePresence mode="wait">
                  {addedFeedback ? (
                    <motion.span
                      key="added"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      Added &mdash; Open Cart
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      Add to Selection
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>

            {/* Shipping note */}
            <p className="text-center text-[9px] tracking-widest uppercase text-drift-foreground-muted mt-4">
              Roasted to order &middot; Ships in 2-3 days
            </p>
          </div>
        </div>
      </div>

      {/* Cinematic Conclusion */}
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center mt-32 border-t border-drift-border/30 pt-24 pb-24">
        <motion.p 
          className="text-[10px] tracking-[0.4em] uppercase text-drift-foreground-muted mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Ritual Continues
        </motion.p>
        <motion.h3 
          className="text-3xl md:text-4xl font-display text-drift-foreground mb-12 max-w-sm leading-tight"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Coffee changes<br/>the pace of a room.
        </motion.h3>
        <motion.button 
          onClick={onBack}
          className="text-[10px] tracking-[0.3em] uppercase text-drift-foreground-muted hover:text-drift-foreground transition-colors border-b border-drift-border hover:border-drift-foreground pb-1 focus-visible:outline-none"
          whileHover={{ x: -4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          &larr; Back to Collection
        </motion.button>
      </div>
    </motion.div>
  );
}

function ContextLink({ label, world, onClick }: { label: string; world: string; onClick: () => void }) {
  return (
    <motion.button 
      onClick={onClick}
      className="flex items-center justify-between py-4 border-b border-drift-border/40 hover:border-drift-foreground text-left group transition-colors duration-300 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-drift-foreground"
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      aria-label={`Go to ${label}`}
    >
      <span className="text-[10px] tracking-widest uppercase text-drift-foreground-muted group-hover:text-drift-foreground transition-colors duration-300">
        {label}
      </span>
      <span className="text-drift-foreground-muted group-hover:text-drift-foreground transition-colors duration-300">
        &rarr;
      </span>
    </motion.button>
  );
}
