import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '../experience/store';
import { AntiGravity } from '../reactive/AntiGravity';

gsap.registerPlugin(ScrollTrigger);

export default function Brew() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [extractPercent, setExtractPercent] = useState(0);
  
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  const brewMethod = useExperienceStore((state) => state.brewMethod);
  const brewTemperature = useExperienceStore((state) => state.brewTemperature);
  const brewRatio = useExperienceStore((state) => state.brewRatio);
  const setBrewProgress = useExperienceStore((state) => state.setBrewProgress);

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = containerRef.current;
    
    // Overall Brew Progress
    const stGlobal = ScrollTrigger.create({
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
      
      // SCENE 01: GRIND (Pinned)
      const tlGrind = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-grind',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
      tlGrind.to('.st-beans-img', { scale: 1.5, rotation: 10, filter: 'blur(5px)', duration: 1 })
             .to('.st-grounds-img', { opacity: 1, scale: 1, duration: 1 }, '<0.5')
             .to('.st-grind-text', { scale: 1.2, letterSpacing: '0.1em', duration: 1 }, '<');

      // SCENE 02: WATER
      const tlWater = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-water',
          scroller: scroller,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
      tlWater.fromTo('.st-water-fill', { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: 1 })
             .fromTo('.st-water-temp', { yPercent: 50 }, { yPercent: -50, duration: 1 }, '<');

      // SCENE 03: BLOOM (Pinned)
      const tlBloom = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-bloom',
          scroller: scroller,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
      tlBloom.fromTo('.st-bloom-circle', { scale: 0, opacity: 0 }, { scale: 15, opacity: 0.8, duration: 1 })
             .fromTo('.st-bloom-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, '<0.2')
             .to('.st-bloom-text', { scale: 1.1, duration: 0.5 });

      // SCENE 04: POUR (Pinned)
      const tlPour = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-pour',
          scroller: scroller,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
      tlPour.fromTo('.st-pour-water', { scaleY: 0 }, { scaleY: 1, duration: 0.5 })
            .to('.st-pour-surface', { scale: 1, opacity: 1, duration: 0.5 }, '<0.4')
            .to('.st-pour-vessel', { rotation: 180, duration: 1 }, '+=0.1')
            .to('.st-pour-stream', { strokeDashoffset: 0, duration: 1 }, '<');

      // SCENE 05: EXTRACTION
      ScrollTrigger.create({
        trigger: '.st-extract',
        scroller: scroller,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate: (self) => setExtractPercent(Math.floor(self.progress * 100))
      });
      
      gsap.fromTo('.st-extract-typography', 
        { y: 100, opacity: 0 },
        { y: -100, opacity: 1, scrollTrigger: {
            trigger: '.st-extract',
            scroller: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      // SCENE 06: CUP (Pinned)
      const tlCup = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-cup',
          scroller: scroller,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });
      tlCup.fromTo('.st-cup-img', { scale: 1.5, y: 100 }, { scale: 1, y: 0, duration: 1 })
           .fromTo('.st-cup-steam', { opacity: 0, y: 20 }, { opacity: 0.6, y: -20, duration: 1 }, '<0.5');

      // SCENE 07: CHARACTER
      gsap.fromTo('.st-character-text',
        { y: 50 },
        { y: -50, scrollTrigger: {
            trigger: '.st-transition-trigger',
            scroller: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      // Auto-transition to Shop at the bottom
      ScrollTrigger.create({
        trigger: '.st-transition-trigger',
        scroller: scroller,
        start: 'top 80%',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('shop')) {
            state.openFork('shop');
            if (state.expandedFork === 'brew') {
               state.expandFork('shop');
            } else {
               state.focusFork('shop');
            }
          }
        }
      });
    });

    return () => {
      stGlobal.kill();
      mm.revert();
      setBrewProgress(0);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar text-drift-foreground bg-drift-bg pb-[30vh]">
      
      {/* Intro */}
      <section className="min-h-screen flex flex-col justify-center px-8 lg:px-16 relative z-10">
        <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4">
          {coffeeOrigin} • {roastLevel}
        </h4>
        <h2 className="text-7xl md:text-9xl font-display font-medium tracking-tight mb-8 leading-none">
          The<br/>Extraction
        </h2>
        
        {/* Method Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mt-12 relative z-10">
          {(['v60', 'espresso', 'french-press'] as const).map(method => {
            const isSelected = brewMethod === method;
            return (
              <button
                key={method}
                onClick={() => {
                  useExperienceStore.getState().setBrewMethod(method);
                  // Update temp and ratio accordingly for local control overriding
                  if (method === 'v60') {
                    useExperienceStore.getState().setBrewTemperature(94);
                    useExperienceStore.getState().setBrewRatio(15);
                  } else if (method === 'espresso') {
                    useExperienceStore.getState().setBrewTemperature(91);
                    useExperienceStore.getState().setBrewRatio(2);
                  } else {
                    useExperienceStore.getState().setBrewTemperature(88);
                    useExperienceStore.getState().setBrewRatio(12);
                  }
                }}
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
        
        {/* SCENE 01: GRIND */}
        <section className="st-grind h-screen relative bg-drift-bg z-10">
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden p-8">
            <div className="w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] relative border border-drift-border overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1495474472205-51f75f23b1fb?q=80&w=2070&auto=format&fit=crop" 
                alt="Whole Beans"
                className="st-beans-img absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 mix-blend-multiply"
              />
              <img 
                src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" 
                alt="Ground Coffee"
                className="st-grounds-img absolute inset-0 w-full h-full object-cover opacity-0 filter grayscale contrast-125 mix-blend-multiply scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-drift-bg/10 mix-blend-overlay">
                <h3 className="st-grind-text text-6xl md:text-[8vw] font-display uppercase tracking-tight text-drift-bg drop-shadow-2xl">Grind</h3>
              </div>
            </div>
          </div>
        </section>

        {/* SCENE 02: WATER */}
        <section className="st-water min-h-[150vh] relative border-y border-drift-border">
          <div className="absolute inset-0 z-0">
            <div className="st-water-fill absolute inset-x-0 bottom-0 bg-drift-foreground/10 origin-bottom" style={{ height: '100%' }}></div>
          </div>
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center pointer-events-none">
             <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mb-8">Solvent</div>
             <h3 className="st-water-temp text-[25vw] md:text-[20vw] font-display leading-none text-drift-foreground tracking-tighter mix-blend-difference">
               {brewTemperature}°
             </h3>
          </div>
        </section>

        {/* SCENE 03: BLOOM */}
        <section className="st-bloom h-screen relative bg-[#e0dcd0] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Radial expansion */}
            <div className="st-bloom-circle w-32 h-32 rounded-full bg-[#1a1412] blur-2xl origin-center"></div>
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
            <h3 className="st-bloom-text text-[15vw] font-display text-[#e0dcd0] mix-blend-difference">BLOOM</h3>
          </div>
        </section>

        {/* SCENE 04: POUR */}
        <section className="st-pour h-screen relative bg-drift-surface border-y border-drift-border">
           <div className="w-full h-full flex items-center justify-center relative p-8">
             <div className="st-pour-vessel relative w-full max-w-2xl aspect-square border border-drift-foreground rounded-full overflow-hidden flex items-center justify-center">
                {/* Simulated circular flow / surface */}
                <div className="st-pour-surface absolute inset-0 bg-drift-foreground/5 rounded-full scale-0 opacity-0 transition-transform origin-center"></div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-drift-foreground/20" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="251" strokeDashoffset="251" className="st-pour-stream text-drift-foreground" />
                </svg>
             </div>
             {/* The incoming stream */}
             <div className="st-pour-water absolute top-0 left-1/2 w-1 h-[50%] bg-drift-foreground origin-top -translate-x-1/2 z-20"></div>
           </div>
        </section>

        {/* SCENE 05: EXTRACTION */}
        <section className="st-extract min-h-[150vh] relative flex items-center justify-center overflow-hidden">
          <div className="st-extract-typography flex flex-col items-center pointer-events-none">
             <div className="text-sm font-sans tracking-[0.3em] uppercase text-drift-foreground-muted mb-4">Yield</div>
             <div className="text-[20vw] font-display tabular-nums tracking-tighter leading-none">{extractPercent}%</div>
             <div className="text-4xl font-display mt-8 text-drift-foreground/60">{brewRatio}:1</div>
          </div>
        </section>

        {/* SCENE 06: CUP */}
        <section className="st-cup h-screen relative bg-drift-bg flex flex-col items-center justify-center overflow-hidden">
          <AntiGravity depth={0.2} className="relative w-[60vw] max-w-lg aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" 
              alt="Coffee Cup"
              className="st-cup-img w-full h-full object-cover filter grayscale contrast-125 shadow-2xl"
            />
            {/* Minimal CSS steam */}
            <div className="st-cup-steam absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
          </AntiGravity>
        </section>

        {/* SCENE 07: CHARACTER */}
        <section className="st-transition-trigger min-h-screen flex flex-col justify-center px-8 lg:px-16 relative bg-drift-foreground text-drift-bg">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-drift-bg/50 mb-12">07 — Character</div>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-display mb-12 leading-tight mix-blend-difference">
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
