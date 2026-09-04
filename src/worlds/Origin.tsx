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

    const ctx = gsap.context(() => {
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
    }, scroller);

    return () => {
      ctx.revert();
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
          className="st-hero-text text-6xl md:text-8xl lg:text-9xl font-display text-white mb-8 uppercase tracking-wider leading-[0.9]"
        >
          Ethiopia<br />Guji
        </motion.h1>
        
        {scale !== 'compact' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="st-hero-text flex flex-col gap-3 mt-8 text-xs md:text-sm text-drift-foreground-muted tracking-[0.15em] font-sans uppercase border-l-2 border-drift-accent/30 pl-5"
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
            <h2 className="st-altitude text-3xl md:text-5xl lg:text-6xl font-display text-drift-highlight mb-10 leading-tight">
              Every cup begins somewhere. In the Guji zone, coffee is not an industry—it is the geography itself.
            </h2>
            <p className="st-altitude text-drift-foreground-muted leading-loose font-light md:text-lg max-w-2xl">
              Deep in the southern highlands of Ethiopia, ancient forests blanket the undulating terrain. The air is cool and thin, slowing the maturation of the cherries and intensifying their complexity. This is a place where coffee grows wild and time moves at the pace of the harvest.
            </p>
          </div>

          {/* 3. ALTITUDE & PLANT / CONTEXT */}
          <div className="st-plant-trigger min-h-[80vh] flex flex-col lg:flex-row gap-16 items-center justify-between border-y border-drift-border/30 py-24 my-24">
            <div className="st-plant flex-1 w-full">
              <div className="text-xs text-drift-accent tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-drift-accent/50"></span>
                Elevation
              </div>
              <div className="text-7xl md:text-9xl font-display text-white font-light tracking-tighter">
                1,900<span className="text-3xl md:text-5xl text-drift-foreground-muted ml-2 font-sans tracking-normal">m</span>
              </div>
              <p className="mt-8 text-drift-foreground-muted leading-loose md:text-lg">
                Extreme altitude forces the plant to work harder, producing denser beans with a profoundly concentrated cellular structure and higher organic acid content.
              </p>
            </div>
            <div className="st-plant flex-1 w-full p-10 md:p-14 bg-white/[0.01] border border-white/[0.03] rounded-2xl backdrop-blur-md shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <path d="M12 2L22 22H2L12 2Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-xs text-drift-accent tracking-[0.2em] uppercase mb-6">Varietal</div>
                <div className="text-4xl md:text-5xl font-display text-drift-highlight mb-6">Ethiopian Heirloom</div>
                <p className="text-sm md:text-base text-drift-foreground-muted leading-loose">
                  Unlike genetically uniform modern crops, this coffee is a chaotic, beautiful mix of indigenous landraces—each contributing a distinct thread to the final tapestry of flavor.
                </p>
              </div>
            </div>
          </div>

          {/* 4. HARVEST & PROCESS / UNDERSTANDING */}
          <div className="st-process-trigger min-h-[80vh] flex flex-col justify-center">
            <div className="max-w-2xl mb-20">
              <h2 className="text-4xl md:text-6xl font-display text-white mb-8">Sun & Time</h2>
              <p className="text-drift-foreground-muted leading-loose md:text-lg">
                After selective hand-picking by local smallholders, the cherries are spread across raised African drying beds. For weeks, they are turned continuously by hand under the equatorial sun, allowing the fruit sugars to ferment and bake directly into the seed.
              </p>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-3xl">
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Method</div>
                <div className="h-[1px] bg-drift-accent/30 st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-highlight text-right">Natural (Dry)</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Drying</div>
                <div className="h-[1px] bg-drift-accent/30 st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-highlight text-right">18–21 Days</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 md:w-32 text-xs md:text-sm tracking-widest text-drift-foreground-muted uppercase">Profile</div>
                <div className="h-[1px] bg-drift-accent/30 st-process-line flex-1"></div>
                <div className="text-xl md:text-2xl font-display text-drift-highlight text-right">Fruit-forward & Syrupy</div>
              </div>
            </div>
          </div>

          {/* 5. CONNECTION (Leads to Roast) */}
          <div className="min-h-[50vh] flex flex-col justify-center items-center text-center mt-32 mb-20">
            <p className="text-drift-foreground-muted text-xs md:text-sm tracking-[0.2em] uppercase mb-10 max-w-md leading-relaxed">
              The raw material is complete. Its true potential now relies on the application of heat.
            </p>
            <button 
              onClick={() => {
                useExperienceStore.getState().openFork('roast');
                useExperienceStore.getState().focusFork('roast');
              }}
              className="group relative px-10 py-5 border border-drift-accent/30 rounded-full hover:bg-drift-accent/5 transition-colors overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 text-xs tracking-[0.2em] uppercase text-drift-highlight group-hover:text-white transition-colors">
                Follow to Roast
              </span>
              <div className="absolute inset-0 bg-drift-accent/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.22,1,0.36,1]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
