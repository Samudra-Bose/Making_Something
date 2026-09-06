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
      // 1. FIRST VIEWPORT - EXACT IMPLEMENTATION
      const tl = gsap.timeline();
      
      tl.to('.st-hero-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
      tl.to('.st-hero-nav', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.15);
      tl.to('.st-hero-title-line', { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out', stagger: 0.09 }, 0.2);
      tl.to('.st-hero-subject-img', { scale: 1.0, duration: 1.05, ease: 'power2.out' }, 0.35);
      tl.to('.st-hero-support', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.8);
      tl.to('.st-hero-metadata', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 0.9);

      // 2. FIRST SCROLL - EXACT CHOREOGRAPHY
      // Pin for ~220vh + 45vh transition = 265vh
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
            if (isActive) {
               useExperienceStore.getState().setActiveWorld('origin');
            }
          }
        }
      });

      // Normalize timeline progress. Let's map 0 -> 0.83 (220/265) for the main sequence.
      // And 0.83 -> 1.0 (45/265) for transition.
      
      // Main Sequence (0 - 0.83)
      pinTl.to('.st-hero-bg', { y: '-2vh', ease: 'none', duration: 0.83 }, 0);
      pinTl.to('.st-hero-subject-img', { scale: 1.07, duration: 0.45, ease: 'none' }, 0)
           .to('.st-hero-subject-img', { scale: 1.16, duration: 0.25, ease: 'none' }, 0.45);
      pinTl.fromTo('.st-hero-subject-img', { objectPosition: '50% 50%' }, { objectPosition: '50% 70%', duration: 0.33, ease: 'none' }, 0.5);
      pinTl.to('.st-hero-subject-container', { x: '-3vw', y: '-4vh', duration: 0.83, ease: 'none' }, 0);
      
      // Headline Lines
      pinTl.to('.st-title-1', { y: '-8vh', x: '-2vw', duration: 0.75, ease: 'none' }, 0.08);
      pinTl.to('.st-title-2', { y: '-11vh', x: '1vw', duration: 0.71, ease: 'none' }, 0.12);
      pinTl.to('.st-title-3', { y: '-14vh', x: '3vw', duration: 0.68, ease: 'none' }, 0.15);
      pinTl.to('.st-hero-title-container', { scale: 1.08, duration: 0.83, ease: 'none' }, 0);

      // Supporting copy y 0 -> -8vh
      pinTl.to('.st-hero-support', { y: '-8vh', duration: 0.83, ease: 'none' }, 0);

      // Metadata
      pinTl.to('.st-altitude', { x: '4vw', duration: 0.83, ease: 'none' }, 0);
      pinTl.to('.st-varietal', { y: '-5vh', duration: 0.83, ease: 'none' }, 0);

      // Foreground object x -12vw -> 12vw
      pinTl.fromTo('.st-foreground-bean', { x: '-12vw' }, { x: '12vw', duration: 0.83, ease: 'none' }, 0);

      // 5. ORIGIN -> ROAST TRANSITION - EXACT SEQUENCE (0.83 - 1.0)
      // 0.00: scale = final. (done)
      // 0.15: begin increasing scale.
      pinTl.to('.st-hero-subject-container', { scale: 1.5, duration: 0.17, ease: 'none' }, 0.83 + (0.17 * 0.15));
      // 0.30: organic clip mask, expands. Roast visual appears underneath (Roast will be -mt-[100vh] and z-index below Origin).
      pinTl.to('.st-hero-pin', { clipPath: 'circle(0% at 50% 50%)', duration: 0.17 * 0.6, ease: 'none' }, 0.83 + (0.17 * 0.40));
      // 0.65: text moves outside focal frame
      pinTl.to('.st-hero-title-container', { x: '-50vw', opacity: 0, duration: 0.17 * 0.35, ease: 'none' }, 0.83 + (0.17 * 0.65));

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="origin"
      style={{ zIndex: 10 }} // Higher z-index to mask OUT over Roast
    >
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-[#F2F0EB]" style={{ clipPath: 'circle(150% at 50% 50%)' }}>
        
        <div className="drift-entry-stage w-full h-full relative">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 st-hero-bg overflow-hidden depth-back">
             <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover scale-110 blur-sm" alt="" />
          </div>

          <div className="absolute top-8 right-8 z-50 text-drift-foreground font-sans tracking-[0.2em] uppercase text-[10px] st-hero-nav opacity-0 -translate-y-[12px] mix-blend-difference text-white">
            EXPLORE
          </div>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-drift-foreground font-sans tracking-[0.4em] uppercase text-[10px] st-hero-logo opacity-0 -translate-y-[20px] mix-blend-difference text-white">
            DRIFT
          </div>

          <div className="absolute top-[20%] left-[10%] z-10 flex flex-col items-start pointer-events-none depth-main">
            <div className="st-hero-title-container text-[12vw] leading-[0.8] font-display uppercase tracking-tighter text-drift-foreground mix-blend-difference opacity-90 text-white">
              <div className="overflow-hidden">
                <div className="st-hero-title-line st-title-1 translate-y-[8vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>ETHIOPIAN</div>
              </div>
              <div className="overflow-hidden">
                <div className="st-hero-title-line st-title-2 translate-y-[11vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>HEIRLOOM</div>
              </div>
              <div className="overflow-hidden">
                <div className="st-hero-title-line st-title-3 translate-y-[14vh]" style={{ clipPath: 'inset(100% 0 0 0)' }}>COFFEE</div>
              </div>
            </div>
            <div className="st-hero-support mt-8 max-w-sm text-drift-foreground-muted font-sans text-sm leading-relaxed opacity-0 translate-y-[30px]">
              Grown at extreme altitude. Carefully hand-picked. Processed naturally under the equatorial sun.
            </div>
          </div>

          <div className="absolute top-1/2 left-[55%] -translate-y-1/2 z-20 w-[40vw] h-[65vh] st-hero-subject-container overflow-hidden pointer-events-none shadow-2xl depth-main">
            <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop" alt="Coffee Cherries" className="w-full h-full object-cover grayscale-[0.2] st-hero-subject-img origin-center scale-[0.88]" />
          </div>

          <div className="absolute inset-0 z-30 pointer-events-none mix-blend-difference text-white">
            <div className="absolute bottom-[10%] right-[15%] text-right st-hero-metadata st-altitude opacity-0 -translate-x-[24px]">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Elevation</p>
              <p className="text-3xl font-display">1,900M</p>
            </div>
            <div className="absolute bottom-[10%] left-[10%] text-left st-hero-metadata st-varietal opacity-0 -translate-x-[24px]">
              <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Process</p>
              <p className="text-3xl font-display">Natural</p>
            </div>
          </div>

          <div className="absolute top-2/3 right-[10%] z-40 w-48 h-48 opacity-90 st-foreground-bean pointer-events-none drop-shadow-2xl depth-front">
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-darken" alt="Coffee Bean" />
          </div>
        </div>
      </div>
    </div>
  );
}
