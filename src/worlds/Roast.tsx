import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { AntiGravity } from '../reactive/AntiGravity';

export default function Roast() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const setRoastDevelopment = useExperienceStore((state) => state.setRoastDevelopment);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  const setRoastLevel = useExperienceStore((state) => state.setRoastLevel);
  const activeFork = useExperienceStore((state) => state.activeFork);
  const setScroll = useExperienceStore((state) => state.setScroll);

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = containerRef.current;
    
    // State updater - must run regardless of motion preferences
    const st = ScrollTrigger.create({
      trigger: scroller.querySelector('.st-roast-sequence'),
      scroller: scroller,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setRoastDevelopment(self.progress);
      }
    });

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.st-roast-image-reveal',
        { clipPath: 'inset(10% 10% 10% 10%)', scale: 0.95 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          scrollTrigger: {
            trigger: '.st-roast-image-reveal',
            scroller: scroller,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1
          }
        }
      );

      gsap.fromTo('.st-roast-image-parallax',
        { y: -30, scale: 1.1 },
        {
          y: 30,
          scrollTrigger: {
            trigger: '.st-roast-image-reveal',
            scroller: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
      
      // Auto-transition to Brew at the bottom
      ScrollTrigger.create({
        trigger: '.st-transition-trigger',
        scroller: scroller,
        start: 'bottom bottom',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('brew')) {
            state.openFork('brew');
            setTimeout(() => {
               state.focusFork('brew');
            }, 100);
          }
        }
      });
    });

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      st.kill();
      mm.revert();
      setRoastDevelopment(0);
    };
  }, [setRoastDevelopment]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (activeFork === 'roast') {
      setScroll(e.currentTarget.scrollTop);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="relative h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar text-drift-foreground"
    >
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

      {/* EDITORIAL IMAGE */}
      <section className="w-full px-8 lg:px-16 mb-32">
        <div className="w-full h-[60vh] overflow-hidden relative border border-drift-border p-2 bg-drift-surface group">
          <div className="w-full h-full overflow-hidden st-roast-image-reveal">
            <img 
              src="https://images.unsplash.com/photo-1517488629431-6427e028c037?q=80&w=2069&auto=format&fit=crop" 
              alt="Coffee Roasting" 
              className="w-full h-full object-cover filter contrast-125 sepia-[0.3] st-roast-image-parallax"
            />
          </div>
          <div className="absolute bottom-8 left-8 text-[10px] tracking-widest uppercase text-white/90 drop-shadow-md">
            The Maillard Reaction
          </div>
        </div>
      </section>

      {/* 2. THE TRANSFORMATION SCROLL SEQUENCE */}
      <section className="st-roast-sequence min-h-[300vh] relative">
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
            className="st-transition-trigger mt-24 pt-8 border-t border-drift-border flex flex-col items-start gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-sans tracking-widest text-drift-foreground-muted uppercase">
              This transformation creates the character you taste.
            </p>
            <button 
              onClick={() => {
                const state = useExperienceStore.getState();
                if (!state.openForks.includes('brew')) {
                  state.openFork('brew');
                }
                state.focusFork('brew');
              }}
              className="group relative px-10 py-5 border border-drift-border rounded-sm hover:bg-drift-foreground/5 transition-colors overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 text-xs tracking-[0.2em] uppercase text-drift-foreground transition-colors">
                Extract the Character
              </span>
              <div className="absolute inset-0 bg-drift-foreground/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.22,1,0.36,1]" />
            </button>
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
  
  // Physics logic for the bean representation
  // 0.0 - 0.2: Green, slow
  // 0.2 - 0.4: Yellowing, heat increasing
  // 0.4 - 0.6: First Crack! Expansion, pressure
  // 0.6 - 0.8: Browning, development
  // 0.8 - 1.0: Darkening, settling
  
  // Base transforms
  let scale = 1 + dev * 0.4;
  let rotation = dev * 120;
  
  // The first crack (around 0.5) creates a sudden physical expansion and tension
  const firstCrackIntensity = dev > 0.45 && dev < 0.55 
    ? Math.sin((dev - 0.45) * 10 * Math.PI) // bell curve around 0.5
    : 0;
  
  if (firstCrackIntensity > 0) {
    scale += firstCrackIntensity * 0.15;
    // adding jitter
    rotation += (Math.random() - 0.5) * firstCrackIntensity * 10;
  }

  // Color logic
  let r = 138, g = 154, b = 157; // Greenish/Muted start
  
  if (dev > 0.2) {
    // Yellow/Tan phase (maillard)
    const factor = Math.min(1, (dev - 0.2) * 5); // 0 to 1 over 0.2-0.4
    r = 138 + (196 - 138) * factor;
    g = 154 + (159 - 154) * factor;
    b = 157 + (125 - 157) * factor;
  }
  if (dev > 0.4) {
    // Browning
    const factor = Math.min(1, (dev - 0.4) * 2.5); // 0 to 1 over 0.4-0.8
    r = 196 + (60 - 196) * factor;
    g = 159 + (40 - 159) * factor;
    b = 125 + (25 - 125) * factor;
  }
  if (dev > 0.8) {
    // Darkening
    const factor = Math.min(1, (dev - 0.8) * 5); // 0 to 1 over 0.8-1.0
    r = 60 + (30 - 60) * factor;
    g = 40 + (20 - 40) * factor;
    b = 25 + (15 - 25) * factor;
  }

  const bgColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
  const shadowColor = `rgba(${r}, ${g}, ${b}, ${0.1 + dev * 0.4})`;
  const boxShadow = `0 0 ${40 + dev * 100}px ${shadowColor}, inset 0 0 ${20 + firstCrackIntensity * 40}px rgba(255,255,255,${0.1 + firstCrackIntensity * 0.2})`;

  return (
    <div className="w-full max-w-lg aspect-square relative flex items-center justify-center">
      {/* Abstract Representation of the Bean/Transformation */}
      <AntiGravity depth={1.2}>
        <motion.div 
          className="w-48 h-64 rounded-[40%] flex items-center justify-center relative overflow-hidden"
          style={{
            scale,
            rotate: rotation,
            backgroundColor: bgColor,
            boxShadow,
            filter: `contrast(${1 + dev * 0.2}) brightness(${1 - dev * 0.2})`
          }}
        >
          {/* The center cut (crease of the bean) */}
          <motion.div 
            className="w-[3px] h-[80%] bg-black/40 rounded-full"
            style={{
              scaleX: 1 + firstCrackIntensity * 2 // crease widens during crack
            }}
          />
          
          {/* Texture overlay (noise) */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.8 + dev}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />
        </motion.div>
      </AntiGravity>

      {/* Dynamic Data Overlay */}
      <div className="absolute -right-4 md:right-12 top-1/4 flex flex-col gap-2 pointer-events-auto mix-blend-difference text-white">
        <div className="text-[10px] font-sans tracking-[0.2em] uppercase opacity-50">Temp</div>
        <div className="text-2xl md:text-4xl font-display tabular-nums">
          {Math.floor(20 + dev * 200)}°C
        </div>
      </div>
      
      <div className="absolute -left-4 md:left-12 bottom-1/4 flex flex-col gap-2 pointer-events-auto text-right mix-blend-difference text-white">
        <div className="text-[10px] font-sans tracking-[0.2em] uppercase opacity-50">Stage</div>
        <div className="text-sm md:text-lg font-sans tracking-[0.1em] uppercase">
          {dev < 0.2 ? 'Drying' : dev < 0.4 ? 'Yellowing' : dev < 0.55 ? 'First Crack' : dev < 0.8 ? 'Development' : 'Finishing'}
        </div>
      </div>

      {/* Aroma Field (Anti-gravity) */}
      {dev > 0.6 && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <motion.div 
            className="absolute top-10 right-20 text-[10px] font-sans tracking-[0.2em] text-drift-foreground uppercase pointer-events-auto cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: (dev - 0.6) * 2.5, y: -Math.sin(dev * 10) * 20 }}
            whileHover={{ scale: 1.1, x: 10, y: -10, transition: { type: 'spring' } }}
          >
            Jasmine
          </motion.div>
          <motion.div 
            className="absolute bottom-12 left-10 text-[10px] font-sans tracking-[0.2em] text-drift-foreground uppercase pointer-events-auto cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: dev > 0.75 ? (dev - 0.75) * 4 : 0, y: -Math.cos(dev * 15) * 15 }}
            whileHover={{ scale: 1.1, x: -10, y: -10, transition: { type: 'spring' } }}
          >
            Caramel
          </motion.div>
          <motion.div 
            className="absolute top-1/2 -right-8 text-[10px] font-sans tracking-[0.2em] text-drift-foreground uppercase pointer-events-auto cursor-default"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: dev > 0.85 ? (dev - 0.85) * 6 : 0, y: -Math.sin(dev * 20) * 10 }}
            whileHover={{ scale: 1.1, x: 10, y: 0, transition: { type: 'spring' } }}
          >
            Dark Cocoa
          </motion.div>
        </div>
      )}
    </div>
  );
}

function RoastOption({ level, title, desc, current, onSelect }: { level: string, title: string, desc: string, current: string, onSelect: any }) {
  const isActive = current === level;
  
  return (
    <motion.button
      onClick={() => onSelect(level)}
      className={`text-left p-6 rounded-sm border transition-all duration-500 ${
        isActive 
          ? 'border-drift-foreground bg-drift-surface shadow-xl' 
          : 'border-drift-border bg-drift-surface hover:border-drift-foreground/30'
      }`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <h4 className={`text-lg font-display mb-3 transition-colors duration-500 ${isActive ? 'text-drift-foreground' : 'text-drift-foreground-muted'}`}>
        {title}
      </h4>
      <p className="text-sm font-sans text-drift-foreground-muted leading-relaxed">
        {desc}
      </p>
    </motion.button>
  );
}
