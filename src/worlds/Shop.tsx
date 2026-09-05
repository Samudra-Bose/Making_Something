import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useExperienceStore } from '../experience/store';
import { DRIFT_COLLECTION, Product } from '../data/products';

export default function Shop() {
  const selectedProductId = useExperienceStore((state) => state.selectedProductId);
  const setSelectedProduct = useExperienceStore((state) => state.setSelectedProduct);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar scroll-smooth">
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

function ProductGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="p-8 lg:p-16 pt-24 min-h-full flex flex-col"
    >
      <header className="mb-16">
        <h2 className="text-3xl lg:text-5xl font-display font-medium tracking-tight mb-4">The Collection</h2>
        <p className="text-sm tracking-widest uppercase text-drift-foreground-muted font-sans">
          Curated outcomes of exploration.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-32">
        {DRIFT_COLLECTION.map((product, index) => (
          <motion.button
            key={product.id}
            whileHover={{ y: -8 }}
            className="group flex flex-col text-left cursor-pointer border border-drift-border hover:border-drift-foreground/50 bg-drift-surface p-6 lg:p-8 transition-colors duration-500 rounded-sm shadow-md hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-accent"
            onClick={() => onSelect(product.id)}
            aria-label={`View ${product.name}`}
          >
            <div className="flex justify-between items-start mb-8 w-full">
              <span className="text-[10px] tracking-[0.2em] text-drift-foreground-muted uppercase border border-drift-border px-2 py-1 rounded-sm">
                No. 0{index + 1}
              </span>
              <span className="text-sm font-display tracking-tight text-drift-foreground">
                ${product.price}
              </span>
            </div>

            <div className="w-full aspect-[4/3] bg-drift-bg mb-8 overflow-hidden border border-drift-border/50">
              <img 
                src={`https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop&sig=${index}`} 
                alt={product.name}
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 mix-blend-multiply opacity-90"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-2xl lg:text-3xl font-display mb-2 group-hover:text-drift-foreground transition-colors">
                {product.name}
              </h3>
              <p className="text-xs tracking-widest uppercase text-drift-foreground-muted mb-6">
                {product.origin} • {product.region}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-drift-border flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-drift-foreground-muted">Profile</span>
                <span className="text-xs text-drift-foreground">{product.flavorProfile.slice(0, 2).join(', ')}</span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] uppercase tracking-widest text-drift-foreground-muted">Roast</span>
                <span className="text-xs text-drift-foreground capitalize">{product.roast}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ProductDetail({ productId, onBack }: { productId: string, onBack: () => void }) {
  const product = DRIFT_COLLECTION.find(p => p.id === productId);
  
  const selectedVariant = useExperienceStore((state) => state.selectedVariant);
  const setSelectedVariant = useExperienceStore((state) => state.setSelectedVariant);
  const addToCart = useExperienceStore((state) => state.addToCart);
  
  const setCoffeeOrigin = useExperienceStore((state) => state.setCoffeeOrigin);
  const setRoastLevel = useExperienceStore((state) => state.setRoastLevel);
  const setBrewMethod = useExperienceStore((state) => state.setBrewMethod);
  const focusFork = useExperienceStore((state) => state.focusFork);
  const openFork = useExperienceStore((state) => state.openFork);

  if (!product) return null;

  // Sync this product back to global context when viewed
  React.useEffect(() => {
    setCoffeeOrigin(`${product.origin} / ${product.name}`);
    setRoastLevel(product.roast);
    setBrewMethod(product.recommendedBrew);
  }, [product]);

  const variants = [
    { id: '250g', label: '250g', multiplier: 1 },
    { id: '500g', label: '500g', multiplier: 1.8 },
    { id: '1kg', label: '1kg', multiplier: 3.2 }
  ];

  const currentVariant = variants.find(v => v.id === selectedVariant) || variants[0];
  const finalPrice = Math.floor(product.price * currentVariant.multiplier);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variant: currentVariant.id,
      quantity: 1,
      price: finalPrice
    });
  };

  const navigateContext = (world: 'origin' | 'roast' | 'brew') => {
    openFork(world);
    focusFork(world);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="p-8 lg:p-16 pt-24 min-h-full flex flex-col max-w-5xl mx-auto"
    >
      <button 
        onClick={onBack}
        className="self-start text-[10px] tracking-[0.2em] uppercase text-drift-foreground-muted hover:text-drift-foreground transition-colors mb-12 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground p-1"
        aria-label="Return to Collection"
      >
        <span aria-hidden="true">←</span> Return to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column: Story & Data */}
        <div>
          <div className="mb-12">
            <div className="w-full aspect-[4/3] bg-drift-bg mb-12 overflow-hidden border border-drift-border p-2">
              <img 
                src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1600&auto=format&fit=crop" 
                alt={product.name}
                className="w-full h-full object-cover filter contrast-125 saturate-50 mix-blend-multiply"
              />
            </div>

            <h2 className="text-4xl lg:text-6xl font-display font-medium tracking-tight mb-4">{product.name}</h2>
            <p className="text-sm tracking-widest uppercase text-drift-foreground-muted mb-8">
              {product.origin} • {product.region}
            </p>
            <p className="text-drift-foreground/80 leading-relaxed font-sans text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-drift-border/30">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-2">Process</div>
              <div className="text-sm">{product.process}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-2">Tasting Notes</div>
              <div className="text-sm">{product.flavorProfile.join(', ')}</div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-drift-border">
            <h3 className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-6">Experience Context</h3>
            <div className="flex flex-col gap-3">
              <ContextLink label="Discover Origin" world="origin" onClick={() => navigateContext('origin')} />
              <ContextLink label={`View Roast Profile (${product.roast})`} world="roast" onClick={() => navigateContext('roast')} />
              <ContextLink label={`Brew Recommendation (${product.recommendedBrew})`} world="brew" onClick={() => navigateContext('brew')} />
            </div>
          </div>
        </div>

        {/* Right Column: Commerce */}
        <div className="flex flex-col">
          <div className="bg-drift-surface border border-drift-border p-8 rounded-sm sticky top-8 shadow-lg">
            <div className="flex justify-between items-end mb-12">
              <div className="text-4xl lg:text-5xl font-display text-drift-foreground tracking-tighter tabular-nums">
                ${finalPrice}
              </div>
              <div className="text-xs text-drift-foreground-muted tracking-widest uppercase">One-time</div>
            </div>

            <div className="mb-10">
              <div className="text-[10px] uppercase tracking-widest text-drift-foreground-muted mb-4">Select Weight</div>
              <div className="grid grid-cols-3 gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`py-3 text-xs tracking-widest uppercase transition-colors rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-accent ${
                      selectedVariant === v.id
                        ? 'border-drift-foreground bg-drift-foreground text-drift-bg'
                        : 'border-drift-border hover:border-drift-foreground text-drift-foreground-muted'
                    }`}
                    aria-label={`Select ${v.label} weight`}
                    aria-pressed={selectedVariant === v.id}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-drift-foreground text-drift-bg py-4 text-xs font-medium tracking-[0.2em] uppercase rounded-sm transition-colors opacity-90 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-drift-accent focus-visible:ring-offset-2 focus-visible:ring-offset-drift-surface"
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ContextLink({ label, world, onClick }: { label: string, world: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-between p-4 border border-drift-border hover:border-drift-foreground bg-drift-surface transition-all text-left group rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground"
      aria-label={`Go to ${label}`}
    >
      <span className="text-xs tracking-widest uppercase text-drift-foreground group-hover:text-drift-foreground transition-colors">
        {label}
      </span>
      <span className="text-drift-foreground-muted group-hover:text-drift-foreground transition-colors">→</span>
    </button>
  );
}
