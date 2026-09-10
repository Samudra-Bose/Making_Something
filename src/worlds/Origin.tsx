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
      // 1. ENTRY REVEAL (On Mount)
      const introTl = gsap.timeline();
      
      introTl.fromTo('.st-entry-logo', 
        { opacity: 0, y: 18, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1.00, duration: 0.7, ease: 'power2.out' }, 0);
      
      introTl.fromTo('.st-hero-title-line', 
        { y: '100%' }, 
        { y: '0%', duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.2);
        
      introTl.fromTo('.st-entry-meta-top',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.5);
        
      introTl.fromTo('.st-entry-meta-bottom',
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.7);

      // Initial Scroll States
      gsap.set('.st-hero-subject-img', { scale: 0.96 });
      gsap.set('.st-hero-bg-layer', { scale: 1.0 });
      gsap.set('.st-foreground-bean', { x: '-3vw', scale: 1.0 });
      gsap.set('.st-hero-title-container', { y: '0vh' });
      gsap.set('.st-entry-meta-top', { y: '0vh' });

      // Pinned Timeline (400vh for long scroll)
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-hero-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=400%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          }
        }
      });
      
      // 0.00 -> 0.06 (Immediate motion - first ~200px)
      pinTl.to('.st-entry-logo', { scale: 0.96, ease: 'none', duration: 0.06 }, 0);
      pinTl.to('.st-hero-title-container', { y: '-6vh', ease: 'none', duration: 0.06 }, 0); 
      pinTl.to('.st-entry-meta-top', { y: '-2vh', ease: 'none', duration: 0.06 }, 0);
      pinTl.to('.st-hero-subject-img', { scale: 1.04, ease: 'none', duration: 0.06 }, 0);
      pinTl.to('.st-hero-bg-layer', { scale: 1.015, ease: 'none', duration: 0.06 }, 0);
      pinTl.to('.st-foreground-bean', { x: '3vw', ease: 'none', duration: 0.06 }, 0);

      // 0.06 -> 0.15 (Mostly still)
      // Empty time

      // 0.15 -> 0.40
      pinTl.to('.st-hero-subject-img', { scale: 1.06, ease: 'none', duration: 0.25 }, 0.15);
      pinTl.to('.st-hero-title-container', { y: '-10vh', ease: 'none', duration: 0.25 }, 0.15);

      // 0.40 -> 0.65
      pinTl.to('.st-hero-subject-img', { scale: 1.12, ease: 'none', duration: 0.25 }, 0.40);
      pinTl.to('.st-hero-title-container', { y: '-19vh', ease: 'none', duration: 0.25 }, 0.40);
      pinTl.to('.st-title-line-1', { x: '-2vw', ease: 'none', duration: 0.25 }, 0.40);
      pinTl.to('.st-title-line-2', { x: '1vw', ease: 'none', duration: 0.25 }, 0.40);
      pinTl.to('.st-title-line-3', { x: '3vw', ease: 'none', duration: 0.25 }, 0.40);

      // Bean moves toward center
      pinTl.to('.st-foreground-bean', { x: '8vw', ease: 'none', duration: 0.59 }, 0.06);

      // 0.65 -> 0.82
      pinTl.to('.st-meta-altitude', { x: '3vw', ease: 'none', duration: 0.17 }, 0.65);
      pinTl.to('.st-meta-varietal', { y: '-4vh', ease: 'none', duration: 0.17 }, 0.65);

      // 0.82 -> 1.00 (ORIGIN -> ROAST VISUAL TRANSITION)
      // "camera pushes inward -> crop tightens -> coffee detail becomes dominant -> green bean appears"
      pinTl.to('.st-hero-subject-container', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.in', duration: 0.18 }, 0.82);
      pinTl.to('.st-hero-subject-img', { scale: 3, ease: 'power2.in', duration: 0.18 }, 0.82);
      
      pinTl.to('.st-hero-title-container', { opacity: 0, y: '-20vh', ease: 'power1.in', duration: 0.10 }, 0.82);
      pinTl.to('.st-entry-logo', { opacity: 0, y: '-15vh', ease: 'power1.in', duration: 0.10 }, 0.82);
      pinTl.to('.st-entry-meta-top', { opacity: 0, y: '-5vh', ease: 'power1.in', duration: 0.10 }, 0.82);
      
      pinTl.to('.st-hero-bg-layer', { opacity: 0, ease: 'none', duration: 0.10 }, 0.90);
      pinTl.to('.st-hero-subject-img', { opacity: 0, ease: 'none', duration: 0.10 }, 0.90);
      pinTl.to('.st-foreground-bean', { opacity: 0, ease: 'none', duration: 0.10 }, 0.90);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div ref={containerRef} onScroll={(e) => setScroll(e.currentTarget.scrollTop)} className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} data-world="origin" style={{ zIndex: 10 }}>
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-transparent">
        <div className="drift-entry-stage w-full h-full relative">
          
          {/* 1. Background layer */}
          <div className="absolute inset-0 z-0 pointer-events-none st-hero-bg-layer overflow-hidden bg-[#F5F2EB]">
             {/* Optional: subtle texture overlay */}
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* ENTRY VISUALS */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-[35] flex flex-col items-center pointer-events-none">
            <p className="st-entry-meta-top text-[10px] md:text-xs tracking-[0.5em] uppercase text-drift-accent mb-6 opacity-0">
              Ethiopia · Guji Zone · 2,100M
            </p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center pointer-events-none w-full">
            <h1 className="st-entry-logo text-[22vw] md:text-[18vw] font-display uppercase tracking-[-0.04em] leading-none text-drift-foreground mix-blend-difference text-white opacity-0" style={{ transformOrigin: 'center center' }}>
              DRIFT
            </h1>
            <div className="st-entry-meta-top flex items-center gap-6 mt-6 opacity-0">
              <div className="h-[1px] w-12 bg-drift-border" />
              <p className="text-xs md:text-sm font-sans text-drift-foreground-muted tracking-[0.2em] uppercase">
                Coffee changes the pace of a room.
              </p>
              <div className="h-[1px] w-12 bg-drift-border" />
            </div>
          </div>

          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-[35] st-entry-meta-bottom opacity-0 pointer-events-none">
            <p className="text-[9px] tracking-[0.3em] uppercase text-drift-foreground-muted">
              Natural Process · Heirloom Varietal
            </p>
          </div>

          {/* ORIGIN HERO VISUALS */}
          <div className="absolute top-[20%] left-[10%] z-10 flex flex-col items-start pointer-events-none depth-type st-hero-title-container">
            <div className="text-[12vw] leading-[0.8] font-display uppercase tracking-tighter text-drift-foreground mix-blend-difference opacity-90 text-white">
              <div className="overflow-hidden"><div className="st-hero-title-line st-title-line-1">ETHIOPIAN</div></div>
              <div className="overflow-hidden"><div className="st-hero-title-line st-title-line-2">HEIRLOOM</div></div>
              <div className="overflow-hidden"><div className="st-hero-title-line st-title-line-3">COFFEE</div></div>
            </div>
          </div>

          <div className="absolute top-1/2 left-[55%] -translate-y-1/2 z-20 w-[45vw] h-[75vh] st-hero-subject-container overflow-hidden pointer-events-none shadow-2xl depth-main" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
            <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop" alt="Coffee Cherries" className="w-full h-full object-cover grayscale-[0.2] st-hero-subject-img origin-center" style={{ objectPosition: 'center center' }} />
          </div>

          <div className="absolute inset-0 z-30 pointer-events-none mix-blend-difference text-white st-hero-metadata">
            <div className="absolute bottom-[10%] right-[15%] text-right st-meta-altitude">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Elevation</p>
              <p className="text-3xl font-display">1,900M</p>
            </div>
            <div className="absolute bottom-[10%] left-[10%] text-left st-meta-varietal">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Process</p>
              <p className="text-3xl font-display">Natural</p>
            </div>
          </div>

          {/* Cross-world object */}
          <div className="absolute top-2/3 right-[20%] z-40 w-48 h-48 opacity-90 st-foreground-bean pointer-events-none drop-shadow-2xl depth-fg">
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-darken" alt="Coffee Bean" />
          </div>
        </div>
      </div>
    </div>
  );
}
