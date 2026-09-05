import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { AntiGravity } from '../reactive/AntiGravity';

gsap.registerPlugin(ScrollTrigger);

interface OriginProps {
  isJourney?: boolean;
}

export default function Origin({ isJourney }: OriginProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const expandedFork = useExperienceStore(s => s.expandedFork);
  const setScroll = useExperienceStore(s => s.setScroll);
  const setCoffeeOrigin = useExperienceStore(state => state.setCoffeeOrigin);
  const currentOrigin = useExperienceStore(state => state.coffeeOrigin);
  const openFork = useExperienceStore(state => state.openFork);
  
  const isActive = isJourney || activeFork === 'origin';
  const isExpanded = expandedFork === 'origin';
  // Determine internal responsive scale state
  const scale = isExpanded ? 'expanded' : (isActive ? 'focused' : 'compact');

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = isJourney ? window : containerRef.current;

    
    // Cleanup any existing triggers on this scroller
    ScrollTrigger.getAll().filter(t => t.scroller === scroller).forEach(t => t.kill());
    
    // Only setup scroll narrative if focused or expanded
    if (scale === 'compact') return;

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. HERO - Initial Entrance Animation (Syncs with Entry.tsx exit)
      const tl = gsap.timeline({ delay: 1.2 });
      tl.fromTo('.st-hero-bg', 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1.0, opacity: 0.3, duration: 2, ease: 'power3.out' }
      )
      .fromTo('.st-hero-title-line',
        { y: '100%', clipPath: 'inset(100% 0 0 0)' },
        { y: '0%', clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.out', stagger: 0.1 },
        "-=1.5"
      )
      .fromTo('.st-hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1.2"
      )
      .fromTo('.st-hero-subject',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
        "-=1.2"
      );

      // 1.1 HERO - Cinematic pinned scroll choreography
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-hero-container',
          scroller: scroller,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5 // Added dampening for smooth settling
        }
      });
      
      // 0-40%: Image scale increases, headline moves slightly upward, metadata separates in depth
      heroScrollTl.to('.st-hero-subject-img', { scale: 1.12, duration: 4 })
                  .to('.st-hero-title-line', { y: '-10vh', duration: 4, stagger: 0.05 }, 0)
                  .to('.st-hero-subtitle', { y: '-15vh', duration: 4 }, 0)
                  .to('.st-hero-bg', { scale: 1.05, y: '5vh', duration: 4 }, 0)

      // 40-75%: Headline moves behind/across image (we use x/y translation), metadata drifting
                  .to('.st-hero-title-line', { x: '-5vw', y: '-20vh', opacity: 0.4, duration: 3.5, stagger: 0.1 }, 4)
                  .to('.st-hero-subject', { width: '40vw', left: '50%', duration: 3.5 }, 4)
                  .to('.st-hero-details', { y: '-10vh', duration: 3.5 }, 4)
                  .to('.st-hero-metadata-alt', { x: '5vw', duration: 3.5 }, 4)
                  .to('.st-hero-metadata-var', { y: '5vh', duration: 3.5 }, 4)

      // 75-100%: Image crop becomes extremely close, color temp shifts, transition prep
                  .to('.st-hero-subject', { width: '100vw', height: '100vh', top: '50%', left: '50%', filter: 'sepia(30%) hue-rotate(-10deg) saturate(1.2)', duration: 2.5 }, 7.5)
                  .to('.st-hero-subject-img', { scale: 1.5, objectPosition: 'center 60%', duration: 2.5 }, 7.5)
                  .to('.st-hero-title-container', { opacity: 0, duration: 1 }, 7.5);

      // Track global narrative progress (Origin is 0.0 to 0.25)
      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: scroller,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (isActive) {
            useExperienceStore.getState().setGlobalProgress(self.progress * 0.25);
          }
        }
      });

      // 2. LAND - Altitude cinematic typography reveal
      gsap.fromTo('.st-altitude', 
        { clipPath: 'inset(100% 0 0 0)', y: 40 },
        { 
          clipPath: 'inset(0% 0 0 0)',
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
      gsap.to('.st-hero-title', {
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
        start: 'top 80%',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('roast') && !isJourney) {
            state.openFork('roast');
            
            // If we are expanded, we pass the expanded state to Roast to maintain flow
            if (state.expandedFork === 'origin') {
               state.expandFork('roast');
            } else {
               state.focusFork('roast');
            }
            state.closeFork('origin');
          }
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, [scale]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Update shared scroll position so ReactiveField velocity works
    setScroll(el.scrollTop);
    if (isActive) {
      // globalProgress for Origin (0.0 → 0.25) is handled by ScrollTrigger onUpdate
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll} 
      className={`relative w-full ${isJourney ? 'min-h-screen' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="origin"
    >
      
      {/* 1. CINEMATIC HERO (Pinned Scene) */}
      <div className="st-hero-container relative w-full h-[300vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-drift-bg">
          
          {/* Background slow layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop" 
              alt="Mist over coffee farm"
              className="st-hero-bg w-full h-full object-cover opacity-30 mix-blend-screen scale-110"
            />
          </div>

          {/* Typography Layer (Mid-ground) */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none pt-20 md:pt-0 md:items-start md:pl-[10vw]">
            <div className="overflow-hidden">
              <div className="st-hero-subtitle text-drift-accent text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-medium">
                The Source
              </div>
            </div>
            <div className="st-hero-title-container text-[18vw] md:text-[14vw] leading-[0.85] font-display uppercase tracking-tighter text-left whitespace-nowrap text-drift-foreground">
              <div className="overflow-hidden">
                <div className="st-hero-title-line">ETHI</div>
              </div>
              <div className="overflow-hidden">
                <div className="st-hero-title-line">OPIA</div>
              </div>
            </div>
          </div>

          {/* Foreground Subject */}
          <div className="absolute inset-0 z-20 pointer-events-none">
             <div className="absolute top-[55%] left-1/2 md:top-1/2 md:left-[60%] -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[28vw] aspect-[3/4] st-hero-subject overflow-hidden shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop"
                 alt="Coffee Cherries Macro"
                 className="w-full h-full object-cover filter contrast-110 grayscale hover:grayscale-0 transition-all duration-1000 st-hero-subject-img"
               />
               <div className="absolute inset-0 border border-drift-border/50 m-4"></div>
             </div>
          </div>

          {/* Details (Overlay) */}
          <div className="absolute bottom-12 right-12 z-30 st-hero-details text-right hidden md:block">
            <div className="st-hero-metadata-alt">
              <p className="text-xs text-drift-foreground-muted tracking-[0.2em] font-sans uppercase">Altitude</p>
              <p className="text-xl font-display text-drift-foreground mb-4">1,900-2,100M</p>
            </div>
            <div className="st-hero-metadata-var">
              <p className="text-xs text-drift-foreground-muted tracking-[0.2em] font-sans uppercase">Varietal</p>
              <p className="text-xl font-display text-drift-foreground">Heirloom</p>
            </div>
          </div>
        </div>
      </div>

      {scale !== 'compact' && (
        <div className="relative z-10 max-w-4xl mx-auto -mt-[20vh] px-6 md:px-12 pb-40">
          {/* 2. LAND / DISCOVERY */}
          <div className="st-altitude-trigger min-h-[70vh] flex flex-col justify-center pt-20">
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
            <AntiGravity depth={0.8} className="st-plant flex-1 w-full p-10 md:p-14 bg-drift-surface border border-drift-border rounded-sm shadow-xl relative overflow-hidden group">
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
            </AntiGravity>
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
