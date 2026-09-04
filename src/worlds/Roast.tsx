import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

export default function Roast() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const setRoastDevelopment = useExperienceStore((state) => state.setRoastDevelopment);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  const setRoastLevel = useExperienceStore((state) => state.setRoastLevel);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // We create a ScrollTrigger that updates the store's roast development 
    // to drive the shared background environment, but we debounce/throttle or just use it.
    // Zustand handles frequent updates well.
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setRoastDevelopment(self.progress);
      }
    });

    return () => {
      st.kill();
      setRoastDevelopment(0); // reset when leaving
    };
  }, [setRoastDevelopment]);

  return (
    <div ref={containerRef} className="relative w-full text-drift-foreground">
      {/* 1. OPENING / HERO */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-16 pt-32 pb-32">
        <div className="max-w-2xl">
          <motion.h4 
            className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {coffeeOrigin}
          </motion.h4>
          <motion.h2 
            className="text-4xl md:text-6xl font-display font-medium tracking-wide mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The moment green becomes something else.
          </motion.h2>
          <motion.p 
            className="text-sm md:text-base font-sans text-drift-foreground-muted leading-relaxed max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Heat transforms density. Moisture becomes pressure. A seed becomes a sensory experience. 
            Scroll to begin the transformation.
          </motion.p>
        </div>
      </section>

      {/* 2. THE TRANSFORMATION SCROLL SEQUENCE */}
      <section className="min-h-[300vh] relative">
        <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none overflow-hidden">
          {/* We will build the interactive/visual bean transformation here */}
          <RoastVisualizer />
        </div>
      </section>

      {/* 3. ROAST LEVEL SELECTION */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-16 py-32 relative z-10 bg-gradient-to-t from-drift-bg via-drift-bg/80 to-transparent">
        <div className="max-w-2xl">
          <h3 className="text-sm font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-12">
            Determine Character
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RoastOption 
              level="light" 
              title="Light" 
              desc="More acidity. More floral. More delicate. The terroir is most prominent here." 
              current={roastLevel} 
              onSelect={setRoastLevel} 
            />
            <RoastOption 
              level="medium" 
              title="Medium" 
              desc="Balanced. Sweet. Complex. The perfect equilibrium of origin and process." 
              current={roastLevel} 
              onSelect={setRoastLevel} 
            />
            <RoastOption 
              level="medium-dark" 
              title="Medium-Dark" 
              desc="Heavier body. Chocolate notes. Lower acidity with profound sweetness." 
              current={roastLevel} 
              onSelect={setRoastLevel} 
            />
            <RoastOption 
              level="dark" 
              title="Dark" 
              desc="More body. More bitterness. Deeper roast character taking center stage." 
              current={roastLevel} 
              onSelect={setRoastLevel} 
            />
          </div>
          
          <motion.div 
            className="mt-24 pt-8 border-t border-white/5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-sans tracking-widest text-drift-foreground-muted uppercase">
              This transformation creates the character you taste.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------
// Sub-components
// ---------------------------------------------------------

function RoastVisualizer() {
  const dev = useExperienceStore((state) => state.roastDevelopment);
  
  // We compute visual properties based on development (0 to 1)
  // 0.0 - 0.2: Green, slow
  // 0.2 - 0.4: Yellowing, heat increasing
  // 0.4 - 0.6: First Crack! Expansion, pressure
  // 0.6 - 0.8: Browning, development
  // 0.8 - 1.0: Darkening, settling
  
  let scale = 1 + dev * 0.5; // Bean expands as it roasts
  let rotation = dev * 180;
  
  // Color transition mapping
  // Green -> Tan -> Brown -> Dark Brown
  let bgColor = `rgba(138, 154, 157, 0.1)`; // default muted
  let borderColor = `rgba(138, 154, 157, 0.4)`;
  
  if (dev > 0.4 && dev < 0.5) {
    // First crack energy
    scale += Math.sin(dev * 100) * 0.05; 
  }
  
  if (dev > 0.1) bgColor = `rgba(196, 159, 125, ${dev})`; // drift-accent
  if (dev > 0.6) bgColor = `rgba(42, 28, 22, ${dev})`; // roast world color
  if (dev > 0.8) bgColor = `rgba(19, 26, 31, 1)`; // dark

  return (
    <div className="w-full max-w-lg aspect-square relative flex items-center justify-center">
      {/* Abstract Representation of the Bean/Transformation */}
      <motion.div 
        className="w-48 h-64 rounded-[40%] border backdrop-blur-md flex items-center justify-center"
        style={{
          scale,
          rotate: rotation,
          backgroundColor: bgColor,
          borderColor
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-[2px] h-3/4 bg-black/20 rounded-full" />
      </motion.div>

      {/* Dynamic Data Overlay */}
      <div className="absolute -right-8 md:right-12 top-1/3 flex flex-col gap-2 pointer-events-auto">
        <div className="text-xs font-sans tracking-widest text-white/50 uppercase">Temp</div>
        <div className="text-2xl font-display">
          {Math.floor(20 + dev * 200)}°C
        </div>
      </div>
      
      <div className="absolute -left-8 md:left-12 bottom-1/3 flex flex-col gap-2 pointer-events-auto text-right">
        <div className="text-xs font-sans tracking-widest text-white/50 uppercase">Stage</div>
        <div className="text-lg font-sans tracking-widest uppercase text-drift-accent">
          {dev < 0.2 ? 'Drying' : dev < 0.4 ? 'Yellowing' : dev < 0.6 ? 'First Crack' : dev < 0.8 ? 'Development' : 'Finishing'}
        </div>
      </div>
    </div>
  );
}

function RoastOption({ level, title, desc, current, onSelect }: { level: string, title: string, desc: string, current: string, onSelect: any }) {
  const isActive = current === level;
  
  return (
    <motion.button
      onClick={() => onSelect(level)}
      className={`text-left p-6 rounded-2xl border transition-all duration-500 ${
        isActive 
          ? 'border-drift-accent bg-drift-accent/10 shadow-[0_0_30px_rgba(196,159,125,0.1)]' 
          : 'border-white/5 bg-white/5 hover:border-white/20'
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <h4 className={`text-lg font-display mb-3 transition-colors duration-500 ${isActive ? 'text-drift-accent' : 'text-white'}`}>
        {title}
      </h4>
      <p className="text-sm font-sans text-drift-foreground-muted leading-relaxed">
        {desc}
      </p>
    </motion.button>
  );
}
