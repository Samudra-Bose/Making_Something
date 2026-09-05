import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export default function Origin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const expandedFork = useExperienceStore(s => s.expandedFork);
  const setScroll = useExperienceStore(s => s.setScroll);
  const setCoffeeOrigin = useExperienceStore(state => state.setCoffeeOrigin);
  const currentOrigin = useExperienceStore(state => state.coffeeOrigin);
  const openFork = useExperienceStore(state => state.openFork);
  
  const isActive = activeFork === 'origin';
  const isExpanded = expandedFork === 'origin';
  // Determine internal responsive scale state
  const scale = isExpanded ? 'expanded' : (isActive ? 'focused' : 'compact');

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = containerRef.current;
    
    // Cleanup any existing triggers on this scroller
    ScrollTrigger.getAll().filter(t => t.scroller === scroller).forEach(t => t.kill());
    
    // Only setup scroll narrative if focused or expanded
    if (scale === 'compact') return;

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 2. LAND - Altitude reveal
      gsap.fromTo('.st-altitude', 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.st-altitude-trigger',
            scroller: scroller,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );

      // 3. PLANT - Floating / Anti-gravity entry
      gsap.fromTo('.st-plant', 
        { opacity: 0, y: 60, scale: 0.98 },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.st-plant-trigger',
            scroller: scroller,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1.5
          }
        }
      );
      
      // 4. PROCESS - Sequential line drawing
      gsap.fromTo('.st-process-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.2,
          transformOrigin: 'left',
          scrollTrigger: {
            trigger: '.st-process-trigger',
            scroller: scroller,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1
          }
        }
      );

      // 5. EDITORIAL IMAGE REVEAL & PARALLAX
      gsap.fromTo('.st-image-reveal',
        { clipPath: 'inset(10% 10% 10% 10%)', scale: 0.95 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          scrollTrigger: {
            trigger: '.st-image-reveal',
            scroller: scroller,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1
          }
        }
      );

      gsap.fromTo('.st-image-parallax',
        { y: -30, scale: 1.1 },
        {
          y: 30,
          scrollTrigger: {
            trigger: '.st-image-reveal',
            scroller: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      // Subtle parallax for the main hero text when scrolling down
      gsap.to('.st-hero-text', {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scroller,
          start: 'top top',
          end: '500px top',
          scrub: true
        }
      });

      // Auto-transition to Roast at the bottom
      ScrollTrigger.create({
        trigger: '.st-transition-trigger',
        scroller: scroller,
        start: 'bottom bottom',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('roast')) {
            state.openFork('roast');
            setTimeout(() => {
               state.focusFork('roast');
            }, 100);
          }
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, [scale]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Only broadcast scroll to the shared reactive environment if this is the active fork
    if (isActive) {
      setScroll(e.currentTarget.scrollTop);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar relative px-6 md:px-12 py-20 pb-40"
    >
      
      {/* 1. PLACE / WONDER (Hero) */}
      <div className="min-h-[85vh] flex flex-col justify-center items-start relative z-10">
        <div className="overflow-hidden">
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-drift-accent text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 font-medium"
          >
            Origin
          </motion.p>
        </div>
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="st-hero-text text-6xl md:text-8xl lg:text-9xl font-display text-drift-foreground mb-8 uppercase tracking-wider leading-[0.9]"
        >
          Ethiopia<br />Guji
        </motion.h1>
        
        {scale !== 'compact' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="st-hero-text flex flex-col gap-3 mt-8 text-xs md:text-sm text-drift-foreground-muted tracking-[0.15em] font-sans uppercase border-l border-drift-border pl-5"
          >
            <p className="hover:text-drift-foreground transition-colors cursor-default">1,900–2,100M Altitude</p>
            <p className="hover:text-drift-foreground transition-colors cursor-default">Natural Process</p>
            <p className="hover:text-drift-foreground transition-colors cursor-default">Heirloom Varietal</p>
          </motion.div>
        )}
      </div>

      {scale !== 'compact' && (
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* 2. LAND / DISCOVERY */}
          <div className="st-altitude-trigger min-h-[70vh] flex flex-col justify-center">
            <h2 className="st-altitude text-3xl md:text-5xl lg:text-6xl font-display text-drift-foreground mb-10 leading-tight">
              Every cup begins somewhere. In the Guji zone, coffee is not an industry—it is the geography itself.
            </h2>
            <p className="st-altitude text-drift-foreground-muted leading-loose font-light md:text-lg max-w-2xl">
              Deep in the southern highlands of Ethiopia, ancient forests blanket the undulating terrain. The air is cool and thin, slowing the maturation of the cherries and intensifying their complexity. This is a place where coffee grows wild and time moves at the pace of the harvest.
            </p>
          </div>

          {/* EDITORIAL IMAGE */}
          <div className="w-full h-[60vh] md:h-[80vh] my-24 overflow-hidden relative group border border-drift-border p-2 bg-drift-surface">
            <div className="w-full h-full overflow-hidden st-image-reveal">
              <img 
                src="https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=2071&auto=format&fit=crop" 
                alt="Guji Highlands" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 origin-center st-image-parallax"
              />
            </div>
            <div className="absolute bottom-8 left-8 text-[10px] tracking-widest uppercase text-drift-bg mix-blend-difference">
              Guji Zone, 2,100M
            </div>
          </div>

          {/* 3. ALTITUDE & PLANT / CONTEXT */}
          <div className="st-plant-trigger min-h-[80vh] flex flex-col lg:flex-row gap-16 items-center justify-between border-y border-drift-border py-24 my-24 relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none grayscale mix-blend-multiply">
              <img src="https://images.unsplash.com/photo-1524350876685-274059332603?q=80&w=2071&auto=format&fit=crop" alt="Coffee Farm Landscape" className="w-full h-full object-cover" />
            </div>
            <div className="st-plant flex-1 w-full relative z-10">
              <div className="text-xs text-drift-accent tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-drift-accent"></span>
                Elevation
              </div>
              <div className="text-7xl md:text-9xl font-display text-drift-foreground font-light tracking-tighter">
                1,900<span className="text-3xl md:text-5xl text-drift-foreground-muted ml-2 font-sans tracking-normal">m</span>
              </div>
              <p className="mt-8 text-drift-foreground-muted leading-loose md:text-lg">
                Extreme altitude forces the plant to work harder, producing denser beans with a profoundly concentrated cellular structure and higher organic acid content.
              </p>
            </div>
            <div className="st-plant flex-1 w-full p-10 md:p-14 bg-drift-surface border border-drift-border rounded-sm shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none text-drift-foreground">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <path d="M12 2L22 22H2L12 2Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-xs text-drift-accent tracking-[0.2em] uppercase mb-6">Varietal</div>
                <div className="text-4xl md:text-5xl font-display text-drift-foreground mb-6">Ethiopian Heirloom</div>
                <p className="text-sm md:text-base text-drift-foreground-muted leading-loose">
                  Unlike genetically uniform modern crops, this coffee is a chaotic, beautiful mix of indigenous landraces—each contributing a distinct thread to the final tapestry of flavor.
                </p>
              </div>
            </div>
          </div>

          {/* 4. HARVEST & PROCESS / UNDERSTANDING */}
          <div className="st-process-trigger min-h-[80vh] flex flex-col justify-center">
            <div className="max-w-2xl mb-20">
              <h2 className="text-4xl md:text-6xl font-display text-drift-foreground mb-8">Sun & Time</h2>
              <p className="text-drift-foreground-muted leading-loose md:text-lg">
                After selective hand-picking by local smallholders, the cherries are spread across raised African drying beds. For weeks, they are turned continuously by hand under the equatorial sun, allowing the fruit sugars to ferment and bake directly into the seed.
              </p>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-3xl">
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Method</div>
                <div className="h-[1px] bg-drift-border st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-foreground text-right">Natural (Dry)</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Drying</div>
                <div className="h-[1px] bg-drift-border st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-foreground text-right">18–21 Days</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Profile</div>
                <div className="h-[1px] bg-drift-border st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-foreground text-right">Fruit-forward & Syrupy</div>
              </div>
            </div>
          </div>

          {/* EDITORIAL IMAGE 2 */}
          <div className="w-full h-[50vh] my-32 flex justify-end relative">
            <div className="w-[80%] md:w-[60%] h-full overflow-hidden relative group border border-drift-border p-2 bg-drift-bg">
              <img 
                src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop" 
                alt="Coffee Cherries" 
                className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-1000 group-hover:saturate-100"
              />
              <div className="absolute top-8 -left-12 rotate-[-90deg] origin-left text-xs tracking-[0.2em] uppercase text-drift-foreground-muted whitespace-nowrap">
                Selective Hand-Picking
              </div>
            </div>
          </div>

          {/* 5. CONNECTION (Leads to Roast) */}
          <div className="st-transition-trigger min-h-[50vh] flex flex-col justify-center items-center text-center mt-32 mb-20">
            <p className="text-drift-foreground-muted text-xs md:text-sm tracking-[0.2em] uppercase mb-10 max-w-md leading-relaxed">
              The raw material is complete. Its true potential now relies on the application of heat.
            </p>
            <button 
              onClick={() => {
                const state = useExperienceStore.getState();
                if (!state.openForks.includes('roast')) {
                  state.openFork('roast');
                }
                state.focusFork('roast');
              }}
              className="group relative px-10 py-5 border border-drift-border rounded-sm hover:bg-drift-foreground/5 transition-colors overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 text-xs tracking-[0.2em] uppercase text-drift-foreground transition-colors">
                Follow to Roast
              </span>
              <div className="absolute inset-0 bg-drift-foreground/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.22,1,0.36,1]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
