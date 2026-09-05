import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { useExperienceStore } from '../experience/store';
import { AntiGravity } from '../reactive/AntiGravity';

export default function Brew() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  
  const brewMethod = useExperienceStore((state) => state.brewMethod);
  const brewTemperature = useExperienceStore((state) => state.brewTemperature);
  const brewRatio = useExperienceStore((state) => state.brewRatio);
  const brewProgress = useExperienceStore((state) => state.brewProgress);
  
  const setBrewMethod = useExperienceStore((state) => state.setBrewMethod);
  const setBrewTemperature = useExperienceStore((state) => state.setBrewTemperature);
  const setBrewRatio = useExperienceStore((state) => state.setBrewRatio);
  const setBrewProgress = useExperienceStore((state) => state.setBrewProgress);

  const getRecommendation = () => {
    switch(roastLevel) {
      case 'light': return { method: 'v60', temp: 96, ratio: 16 };
      case 'medium': return { method: 'v60', temp: 93, ratio: 15 };
      case 'medium-dark': return { method: 'espresso', temp: 91, ratio: 2 };
      case 'dark': return { method: 'french-press', temp: 88, ratio: 12 };
      default: return { method: 'v60', temp: 94, ratio: 15 };
    }
  };

  useEffect(() => {
    const rec = getRecommendation();
    setBrewMethod(rec.method as any);
    setBrewTemperature(rec.temp);
    setBrewRatio(rec.ratio);
  }, [roastLevel]);

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = containerRef.current;
    
    // Overall Brew Progress
    const st = ScrollTrigger.create({
      trigger: scroller.querySelector('.st-brew-sequence'),
      scroller: scroller,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setBrewProgress(self.progress);
      }
    });

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Grind interactions
      gsap.fromTo('.st-grind-img', 
        { scale: 1.2, rotation: 5 }, 
        { scale: 1, rotation: 0, scrollTrigger: { trigger: '.st-grind', scroller: scroller, scrub: true } }
      );
      
      // Water interactions
      gsap.fromTo('.st-water-level',
        { yPercent: 100 },
        { yPercent: 0, scrollTrigger: { trigger: '.st-water', scroller: scroller, start: 'top center', end: 'bottom center', scrub: true } }
      );

      // Bloom interactions
      gsap.fromTo('.st-bloom-expand',
        { scale: 0.8, filter: 'brightness(1.5)' },
        { scale: 1.1, filter: 'brightness(0.8)', scrollTrigger: { trigger: '.st-bloom', scroller: scroller, start: 'top center', end: 'center center', scrub: true } }
      );

      // Pour interactions
      gsap.fromTo('.st-pour-stream',
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, scrollTrigger: { trigger: '.st-pour', scroller: scroller, start: 'top center', end: 'center center', scrub: true } }
      );

      // Auto-transition to Shop at the bottom
      ScrollTrigger.create({
        trigger: '.st-transition-trigger',
        scroller: scroller,
        start: 'bottom bottom',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('shop')) {
            state.openFork('shop');
            setTimeout(() => {
               state.focusFork('shop');
            }, 100);
          }
        }
      });
    });

    return () => {
      st.kill();
      mm.revert();
      setBrewProgress(0);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar text-drift-foreground bg-drift-bg pb-[30vh]">
      
      {/* Intro / Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-16 relative">
        <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4">
          {coffeeOrigin} • {roastLevel}
        </h4>
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium tracking-tight mb-8 leading-[0.9]">
          The<br/>Extraction
        </h2>
        
        {/* Method Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mt-12 relative z-10">
          {(['v60', 'espresso', 'french-press'] as const).map(method => {
            const isSelected = brewMethod === method;
            return (
              <button
                key={method}
                onClick={() => setBrewMethod(method)}
                className={`text-left p-4 border-b transition-all duration-300 ${
                  isSelected ? 'border-drift-foreground text-drift-foreground' : 'border-drift-border text-drift-foreground-muted hover:border-drift-foreground/50'
                }`}
              >
                <div className="text-[10px] tracking-widest uppercase mb-2">Method</div>
                <div className="font-display text-xl">{method === 'v60' ? 'Pour Over' : method === 'espresso' ? 'Espresso' : 'Immersion'}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="st-brew-sequence">
        
        {/* SECTION 01: GRIND */}
        <section className="st-grind min-h-[120vh] flex flex-col justify-center px-8 lg:px-16 relative">
          <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 w-full overflow-hidden border border-drift-border p-2 bg-drift-surface">
              <img 
                src="https://images.unsplash.com/photo-1495474472205-51f75f23b1fb?q=80&w=2070&auto=format&fit=crop" 
                alt="Coffee Beans" 
                className="st-grind-img w-full aspect-square object-cover grayscale contrast-125 saturate-50 mix-blend-multiply"
              />
            </div>
            <div className="flex-1 w-full flex flex-col justify-center">
              <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-4">01 — Preparation</div>
              <h3 className="text-4xl lg:text-6xl font-display mb-6">Grind</h3>
              <p className="text-sm font-sans leading-relaxed text-drift-foreground/80 max-w-md">
                Increasing the surface area is the first step of extraction. 
                {brewMethod === 'espresso' ? ' A fine, uniform grind creates the necessary resistance for high pressure.' : 
                 brewMethod === 'french-press' ? ' A coarse grind allows for slow, even immersion without over-extracting bitter compounds.' : 
                 ' A medium-fine grind allows water to flow through the bed evenly, pulling clarity and sweetness.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 02: WATER */}
        <section className="st-water min-h-[120vh] flex flex-col justify-center px-8 lg:px-16 relative overflow-hidden bg-drift-surface border-y border-drift-border">
          <div className="absolute inset-0 z-0">
             <div className="st-water-level absolute inset-x-0 bottom-0 top-1/2 bg-drift-bg/50 border-t border-drift-border"></div>
          </div>
          <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="flex-1 w-full overflow-hidden p-2">
              <img 
                src="https://images.unsplash.com/photo-1610632380989-680fe0c80b27?q=80&w=2187&auto=format&fit=crop" 
                alt="Water" 
                className="w-full aspect-[4/3] object-cover grayscale contrast-[1.1] opacity-90 mix-blend-multiply"
              />
            </div>
            <div className="flex-1 w-full flex flex-col justify-center">
              <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-4">02 — Solvent</div>
              <h3 className="text-4xl lg:text-6xl font-display mb-6">Water</h3>
              <div className="font-display text-7xl lg:text-9xl tabular-nums text-drift-foreground tracking-tighter my-8 border-b border-drift-border pb-4 w-max">
                {brewTemperature}<span className="text-3xl text-drift-foreground-muted">°C</span>
              </div>
              <p className="text-sm font-sans leading-relaxed text-drift-foreground/80 max-w-md">
                Temperature dictates solubility. Higher heat extracts rapidly, pulling acids first, then sugars, and finally bitter compounds.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 03: BLOOM */}
        <section className="st-bloom min-h-[120vh] flex flex-col justify-center px-8 lg:px-16 relative">
          <div className="w-full h-screen absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1542181514-69974204859a?q=80&w=1968&auto=format&fit=crop" 
              alt="Bloom Texture"
              className="st-bloom-expand w-[120vw] h-[120vh] object-cover mix-blend-multiply"
            />
          </div>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-4">03 — Awakening</div>
            <h3 className="text-5xl lg:text-8xl font-display mb-8">Bloom</h3>
            <p className="text-lg font-sans leading-relaxed text-drift-foreground max-w-md mx-auto">
              As water hits the grounds, trapped carbon dioxide violently escapes. The bed expands, releasing the first intense wave of aromatics.
            </p>
          </div>
        </section>

        {/* SECTION 04: POUR */}
        <section className="st-pour min-h-[150vh] flex flex-col justify-center px-8 lg:px-16 relative">
           <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
             <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-4 self-start">04 — Agitation</div>
             <div className="flex w-full justify-between items-end mb-12 border-b border-drift-border pb-8">
               <h3 className="text-4xl lg:text-7xl font-display">The Pour</h3>
               <div className="text-right">
                 <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-2">Ratio</div>
                 <div className="font-display text-4xl lg:text-6xl tracking-tight text-drift-foreground">1:{brewRatio}</div>
               </div>
             </div>
             
             <div className="w-full aspect-[21/9] border border-drift-border relative overflow-hidden bg-drift-surface">
               <div className="absolute top-0 left-1/2 w-[2px] h-[30%] bg-drift-foreground/30 -translate-x-1/2 st-pour-stream origin-top"></div>
               <img 
                 src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop" 
                 alt="Pouring" 
                 className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-multiply opacity-80"
               />
             </div>
           </div>
        </section>

        {/* SECTION 05: EXTRACTION */}
        <section className="min-h-[120vh] flex flex-col justify-center px-8 lg:px-16 bg-drift-surface border-y border-drift-border relative">
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-4">05 — Chemistry</div>
              <h3 className="text-4xl lg:text-6xl font-display mb-8">Extraction</h3>
              <p className="text-sm font-sans leading-relaxed text-drift-foreground/80 mb-12">
                Water acts as a solvent, pulling soluble compounds from the cellular structure of the roasted seed into the liquid. Too fast, it is sour and empty. Too slow, it becomes bitter and astringent.
              </p>
            </div>
            <div className="flex flex-col justify-center items-end">
              <div className="font-display text-[12vw] md:text-[8vw] leading-none text-drift-foreground tracking-tighter">
                {Math.floor(brewProgress * 100)}<span className="text-4xl text-drift-foreground-muted ml-2">%</span>
              </div>
              <div className="w-full h-[1px] bg-drift-border mt-4 relative">
                <div className="absolute top-0 right-0 h-full bg-drift-foreground" style={{ width: `${brewProgress * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 06: CUP */}
        <section className="min-h-[120vh] flex flex-col justify-center px-8 lg:px-16 relative">
          <AntiGravity depth={0.5} className="w-full max-w-xl mx-auto aspect-[3/4] border border-drift-border p-3 bg-drift-bg shadow-2xl z-10">
            <img 
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" 
              alt="The Cup" 
              className="w-full h-full object-cover filter contrast-125 saturate-50"
            />
          </AntiGravity>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-center pointer-events-none">
            <h3 className="text-[12vw] font-display text-drift-foreground/5 opacity-50 tracking-tighter uppercase whitespace-nowrap mix-blend-multiply">
              The Ritual Resolves
            </h3>
          </div>
        </section>

        {/* SECTION 07: TASTE / CHARACTER */}
        <section className="st-transition-trigger min-h-screen flex flex-col justify-center px-8 lg:px-16 relative bg-drift-foreground text-drift-bg">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-bg/50 mb-12">07 — Character</div>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-display mb-12 leading-tight">
              {roastLevel === 'light' ? 'Jasmine, Citrus & Bright Acidity.' : 
               roastLevel === 'medium' ? 'Stone Fruit, Caramel & Balanced Sweetness.' : 
               'Dark Cocoa, Toasted Nuts & Heavy Body.'}
            </h3>
            
            <button 
              onClick={() => {
                const state = useExperienceStore.getState();
                if (!state.openForks.includes('shop')) {
                  state.openFork('shop');
                }
                state.focusFork('shop');
              }}
              className="mt-24 text-xs font-sans tracking-[0.2em] uppercase text-drift-bg border-b border-drift-bg/30 pb-2 hover:border-drift-bg transition-colors"
            >
              Acquire in Shop
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
