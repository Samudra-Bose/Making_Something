import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OriginProps {
  isJourney?: boolean;
}

export default function Origin({ isJourney }: OriginProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);
  
  const isActive = isJourney || activeFork === 'origin';

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = isJourney ? window : containerRef.current;
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && (t.vars.trigger === '.drift-entry-stage' || t.vars.trigger === '.st-hero-pin')).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline();
      tl.to('.st-hero-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
      tl.to('.st-hero-nav', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.15);
      tl.to('.st-hero-title-line', { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', stagger: 0.09 }, 0.2);
      tl.to('.st-hero-subject-img', { scale: 1.0, duration: 1.05, ease: 'power2.out' }, 0.35);
      tl.to('.st-hero-support', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.8);
      tl.to('.st-hero-metadata', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 0.9);

      // Pinned Timeline (265vh)
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-hero-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=265%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          }
        }
      });
      
      // Normalize progress mapping: 
      // 0.00 - 0.05: HOLD
      // 0.05 - 0.80: TRANSFORM (Main Sequence)
      // 0.80 - 1.00: RELEASE (Transition to Roast)

      const trStart = 0.05;
      const trDur = 0.75; // ends at 0.80
      const relStart = 0.80;
      const relDur = 0.20;

      // TRANSFORM PHASE
      // Depth-based scale
      pinTl.fromTo('.st-hero-bg', { scale: 1.02 }, { scale: 1.06, ease: 'none', duration: trDur }, trStart);
      pinTl.fromTo('.st-hero-subject-img', { scale: 1.00 }, { scale: 1.12, ease: 'none', duration: trDur }, trStart);
      pinTl.fromTo('.st-foreground-bean', { scale: 1.00 }, { scale: 1.16, ease: 'none', duration: trDur }, trStart);

      // 14. TYPOGRAPHY HIERARCHY:
      // Hero (large): 8vh -> 0vh
      pinTl.fromTo('.st-hero-title', { y: '8vh' }, { y: '0vh', duration: trDur, ease: 'none' }, trStart);
      // Narrative (small): 30px -> 0px
      pinTl.fromTo('.st-hero-copy', { y: '30px', opacity: 0 }, { y: '0px', opacity: 1, duration: trDur * 0.8, ease: 'power1.out' }, trStart);
      // Metadata (very subtle): -10px -> 0px (was -24px)
      pinTl.fromTo('.st-hero-meta', { x: '-10px', opacity: 0 }, { x: '0px', opacity: 1, duration: trDur * 0.8, ease: 'power1.out' }, trStart);

      // Camera Push System restored
      pinTl.to('.st-hero-subject-container', { y: '-4vh', duration: trDur, ease: 'none' }, trStart);
      pinTl.to('.st-hero-title-container', { y: '-10vh', duration: trDur, ease: 'none' }, trStart);
      pinTl.to('.st-hero-metadata', { x: '3vw', duration: trDur, ease: 'none' }, trStart);
      
      // Cross-world Typography (ORIGIN) restored
      pinTl.to('.st-bg-word', { y: '-30vh', duration: trDur, ease: 'none' }, trStart);
      pinTl.to('.st-bg-word', { opacity: 0.25, duration: relDur, ease: 'none' }, relStart);

      // 15. IMAGE MOTION - STOP CONSTANT ZOOMING
      // HOLD (0.00-0.20) -> ZOOM (0.20-0.50) -> HOLD (0.50-0.80)
      const zoomStart = trStart + (trDur * 0.2); // starts at ~0.20
      const zoomDur = trDur * 0.4; // 0.20 to 0.50 is 30% of total
      pinTl.fromTo('.st-hero-subject-img', { scale: 1.0 }, { scale: 1.12, duration: zoomDur, ease: 'power2.inOut' }, zoomStart);
      
      // Secondary foreground objects (max 2)
      pinTl.fromTo('.st-foreground-bean', { y: '10vh', rotate: 0 }, { y: '-10vh', rotate: -15, duration: trDur, ease: 'none' }, trStart);

      // RELEASE PHASE (Transform 0.80 - 1.00)
      pinTl.to('.st-hero-subject-container', { scale: 1.5, duration: relDur, ease: 'power2.in' }, relStart);
      pinTl.to('.st-hero-pin', { clipPath: 'circle(0% at 50% 50%)', duration: relDur * 0.8, ease: 'none' }, relStart + (relDur * 0.2));
      pinTl.to('.st-hero-title-container', { x: '-20vw', opacity: 0, duration: relDur * 0.5, ease: 'none' }, relStart);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div ref={containerRef} onScroll={(e) => setScroll(e.currentTarget.scrollTop)} className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} data-world="origin" style={{ zIndex: 10 }}>
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-transparent" style={{ clipPath: 'circle(150% at 50% 50%)' }}>
        <div className="drift-entry-stage w-full h-full relative">
          
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 st-hero-bg overflow-hidden depth-bg">
             <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover blur-sm" alt="" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] opacity-10 st-bg-word pointer-events-none text-[30vw] font-display tracking-tighter text-[#333]">
            ORIGIN
          </div>

          <div className="absolute top-8 right-8 z-50 text-drift-foreground font-sans tracking-[0.2em] uppercase text-[10px] st-hero-nav opacity-0 -translate-y-[12px] mix-blend-difference text-white depth-type">
            EXPLORE
          </div>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-drift-foreground font-sans tracking-[0.4em] uppercase text-[10px] st-hero-logo opacity-0 -translate-y-[20px] mix-blend-difference text-white depth-type">
            DRIFT
          </div>

          <div className="absolute top-[20%] left-[10%] z-10 flex flex-col items-start pointer-events-none depth-type st-hero-title-container">
            <div className="text-[12vw] leading-[0.8] font-display uppercase tracking-tighter text-drift-foreground mix-blend-difference opacity-90 text-white">
              <div className="overflow-hidden"><div className="st-hero-title-line translate-y-[8vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>ETHIOPIAN</div></div>
              <div className="overflow-hidden"><div className="st-hero-title-line translate-y-[11vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>HEIRLOOM</div></div>
              <div className="overflow-hidden"><div className="st-hero-title-line translate-y-[14vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>COFFEE</div></div>
            </div>
            <div className="st-hero-support mt-8 max-w-sm text-drift-foreground-muted font-sans text-sm leading-relaxed opacity-0 translate-y-[30px]">
              Grown at extreme altitude. Carefully hand-picked. Processed naturally under the equatorial sun.
            </div>
          </div>

          <div className="absolute top-1/2 left-[55%] -translate-y-1/2 z-20 w-[40vw] h-[65vh] st-hero-subject-container overflow-hidden pointer-events-none shadow-2xl depth-main">
            <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop" alt="Coffee Cherries" className="w-full h-full object-cover grayscale-[0.2] st-hero-subject-img origin-center scale-[0.88]" />
          </div>

          <div className="absolute inset-0 z-30 pointer-events-none mix-blend-difference text-white st-hero-metadata">
            <div className="absolute bottom-[10%] right-[15%] text-right opacity-0 -translate-x-[24px]">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Elevation</p>
              <p className="text-3xl font-display">1,900M</p>
            </div>
            <div className="absolute bottom-[10%] left-[10%] text-left opacity-0 -translate-x-[24px]">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Process</p>
              <p className="text-3xl font-display">Natural</p>
            </div>
          </div>

          {/* Cross-world object */}
          <div className="absolute top-2/3 right-[10%] z-40 w-48 h-48 opacity-90 st-foreground-bean pointer-events-none drop-shadow-2xl depth-fg">
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-darken" alt="Coffee Bean" />
          </div>
        </div>
      </div>
    </div>
  );
}
