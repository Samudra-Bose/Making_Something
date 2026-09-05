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
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-hero-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // INTRO ANIMATION
      const tl = gsap.timeline();
      
      tl.fromTo('.st-hero-logo', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' })
        .fromTo('.st-hero-title-line',
          { y: '100%' },
          { y: '0%', duration: 1.5, ease: 'power4.out', stagger: 0.15 },
          "-=1"
        )
        .fromTo('.st-hero-subject-container',
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, ease: 'power3.out' },
          "-=1.5"
        )
        .fromTo('.st-hero-metadata',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
          "-=1.2"
        );

      // CINEMATIC CHOREOGRAPHY PASS
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-hero-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=400%', 
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          onEnter: () => useExperienceStore.getState().setActiveWorld('origin'),
          onEnterBack: () => useExperienceStore.getState().setActiveWorld('origin'),
          onUpdate: (self) => {
            if (isActive && !isJourney) {
              useExperienceStore.getState().setGlobalProgress(self.progress * 0.25);
            }
          }
        }
      });

      pinTl.to('.st-hero-bg', { scale: 1.1, y: '5vh', duration: 10 }, 0);

      // 0-20%: Camera pushes inward
      pinTl.to('.st-hero-subject-container', { scale: 1.05, duration: 2 }, 0)
           .to('.st-hero-subject-img', { scale: 1.12, duration: 2 }, 0)
           .to('.st-hero-title-line', { y: '-10vh', duration: 2, stagger: 0.1 }, 0)
           .to('.st-altitude', { x: '-5vw', duration: 2 }, 0)
           .to('.st-varietal', { y: '5vh', duration: 2 }, 0)
           .fromTo('.st-foreground-bean', { y: '20vh', opacity: 0 }, { y: '-5vh', opacity: 1, duration: 2 }, 0)
           
      // 20-40%: Headline crosses image
           .to('.st-hero-title-container', { x: '-15vw', duration: 2 }, 2)
           .to('.st-hero-title-line', { x: '5vw', duration: 2, stagger: 0.05 }, 2)
           .to('.st-foreground-bean', { y: '-15vh', x: '5vw', scale: 1.2, duration: 2 }, 2)
           
      // 40-60%: Metadata separates
           .to('.st-altitude', { x: '-15vw', y: '-10vh', opacity: 0.5, duration: 2 }, 4)
           .to('.st-varietal', { x: '10vw', y: '15vh', opacity: 0.5, duration: 2 }, 4)
           .to('.st-hero-title-line', { letterSpacing: '0.1em', duration: 2 }, 4)
           
      // 60-90%: Image macro
           .to('.st-hero-subject-container', { width: '100vw', height: '100vh', scale: 1, duration: 3 }, 6)
           .to('.st-hero-subject-img', { scale: 1.4, duration: 3 }, 6)
           .to('.st-hero-title-container', { y: '-50vh', opacity: 0, scale: 1.5, duration: 3 }, 6)
           .to('.st-foreground-bean', { y: '-50vh', opacity: 0, duration: 3 }, 6)
           .to('.st-metadata-container', { opacity: 0, duration: 2 }, 6)
           
      // 90-100%: Color temp shifts
           .to('.st-hero-subject-img', { filter: 'sepia(40%) hue-rotate(-15deg) saturate(1.2) brightness(0.9)', duration: 1 }, 9);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="origin"
      style={{ zIndex: 10 }}
    >
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-[#F2F0EB]">
        
        {/* Background Depth */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 st-hero-bg overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop"
             className="w-full h-full object-cover scale-110 blur-sm"
             alt=""
           />
        </div>

        {/* Foreground Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-drift-foreground font-sans tracking-[0.4em] uppercase text-[10px] st-hero-logo mix-blend-difference text-white">
          DRIFT
        </div>

        {/* Midground Typography */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="st-hero-title-container text-[18vw] leading-[0.8] font-display uppercase tracking-tighter text-drift-foreground mix-blend-difference opacity-90 text-white">
            <div className="overflow-hidden">
              <div className="st-hero-title-line origin-bottom">ORIGIN</div>
            </div>
            <div className="overflow-hidden">
              <div className="st-hero-title-line origin-bottom">STORY</div>
            </div>
          </div>
        </div>

        {/* Main Subject */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[45vw] h-[60vh] st-hero-subject-container overflow-hidden pointer-events-none shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=1974&auto=format&fit=crop"
            alt="Coffee Cherries"
            className="w-full h-full object-cover grayscale-[0.2] st-hero-subject-img origin-center"
          />
        </div>

        {/* Foreground Metadata */}
        <div className="st-metadata-container absolute inset-0 z-30 pointer-events-none mix-blend-difference text-white">
          <div className="absolute bottom-[15%] right-[10%] text-right st-hero-metadata st-altitude">
            <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Elevation</p>
            <p className="text-3xl md:text-5xl font-display">1,900M</p>
          </div>
          <div className="absolute top-[30%] left-[10%] text-left st-hero-metadata st-varietal">
            <p className="text-[10px] tracking-[0.3em] font-sans uppercase mb-2 opacity-60">Varietal</p>
            <p className="text-3xl md:text-5xl font-display">Heirloom</p>
          </div>
        </div>

        {/* Foreground Floating Object */}
        <div className="absolute top-1/2 right-[20%] z-40 w-48 h-48 opacity-90 st-foreground-bean pointer-events-none drop-shadow-2xl">
           <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-darken" alt="Coffee Bean" />
        </div>
      </div>
    </div>
  );
}
