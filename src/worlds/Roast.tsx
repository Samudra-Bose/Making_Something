import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RoastProps {
  isJourney?: boolean;
}

export default function Roast({ isJourney }: RoastProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);

  const isActive = isJourney || activeFork === 'roast';

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = isJourney ? window : containerRef.current;
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-roast-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const roastTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-roast-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=300%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) {
               useExperienceStore.getState().setActiveWorld('roast');
               useExperienceStore.getState().setRoastDevelopment(self.progress);
            }
          }
        }
      });

      // GLOBAL OBJECT TRAVEL (Do not remove, affects AppShell)
      roastTl.fromTo('.st-foreground-bean', { x: '10vw', rotate: 0 }, { x: '-80vw', rotate: 180, duration: 1, ease: 'none' }, 0);
      roastTl.fromTo('.st-bg-word-roast', { x: '50vw' }, { x: '-150vw', duration: 1, ease: 'none' }, 0);

      // Background Color Transformation
      roastTl.fromTo('.st-roast-bg', 
        { backgroundColor: '#E3E8E0' }, 
        { backgroundColor: '#E3E8E0', duration: 0.18, ease: 'none' }, 0)
        .to('.st-roast-bg', { backgroundColor: '#F2E3C6', duration: 0.20, ease: 'none' }, 0.18) // Yellow
        .to('.st-roast-bg', { backgroundColor: '#D4AF37', duration: 0.17, ease: 'none' }, 0.38) // Gold
        .to('.st-roast-bg', { backgroundColor: '#C68E58', duration: 0.13, ease: 'none' }, 0.55) // Caramel
        .to('.st-roast-bg', { backgroundColor: '#5C3A21', duration: 0.12, ease: 'none' }, 0.68) // Brown
        .to('.st-roast-bg', { backgroundColor: '#1A100C', duration: 0.20, ease: 'none' }, 0.80); // Dark

      // Depth Parallax
      roastTl.fromTo('.st-roast-bg-parallax', { y: '0vh' }, { y: '-20vh', duration: 1, ease: 'none' }, 0);
      roastTl.fromTo('.st-roast-fg-parallax', { y: '20vh' }, { y: '-80vh', duration: 1, ease: 'none' }, 0);

      // --- 0.00-0.18 GREEN ---
      roastTl.fromTo('.st-roast-bean-wrap', 
        { rotation: -2, y: '0vh' }, 
        { rotation: 0, y: '0vh', duration: 0.18, ease: 'none' }, 0);
      roastTl.fromTo('.st-roast-bean-img', 
        { scale: 0.92, filter: 'brightness(1.05) contrast(0.95)' }, 
        { scale: 1.00, filter: 'brightness(1.0) contrast(1.0)', duration: 0.18, ease: 'none' }, 0);
      
      // Typography: quiet
      roastTl.fromTo('.st-quiet-typography', { opacity: 0, y: '5vh' }, { opacity: 0.6, y: '0vh', duration: 0.10 }, 0.04)
             .to('.st-quiet-typography', { opacity: 0, duration: 0.04 }, 0.14);

      // --- 0.18-0.38 HEAT ---
      roastTl.to('.st-roast-bean-wrap', 
        { rotation: 3, y: '-3vh', duration: 0.20, ease: 'power1.inOut' }, 0.18);
      roastTl.to('.st-roast-bean-img', 
        { scale: 1.06, duration: 0.20, ease: 'power1.inOut' }, 0.18);
      roastTl.fromTo('.st-heat-distortion', { opacity: 0 }, { opacity: 0.3, duration: 0.10 }, 0.20)
             .to('.st-heat-distortion', { opacity: 0, duration: 0.08 }, 0.30);

      // --- 0.38-0.55 YELLOW / GOLD ---
      roastTl.to('.st-roast-bean-img', 
        { filter: 'brightness(0.9) contrast(1.1) sepia(0.2)', duration: 0.17, ease: 'none' }, 0.38);
      
      // Secondary typography moves horizontally
      roastTl.fromTo('.st-secondary-typography', 
        { x: '10vw', opacity: 0 }, 
        { x: '-20vw', opacity: 1, duration: 0.10, ease: 'none' }, 0.38)
        .to('.st-secondary-typography', { x: '-30vw', duration: 0.04, ease: 'none' }, 0.48) // Reduce movement (0.52-0.60)
        .to('.st-secondary-typography', { x: '-35vw', opacity: 0, duration: 0.08, ease: 'power1.out' }, 0.52);

      // --- 0.52-0.68 FIRST CRACK ---
      // 0.52 - 0.60 Tension
      roastTl.fromTo('.st-first-crack-text', 
        { scale: 1.0, opacity: 0, letterSpacing: '0em' }, 
        { scale: 1.10, opacity: 1, letterSpacing: '-0.02em', duration: 0.08, ease: 'power2.in' }, 0.52);

      // 0.60 - Crack Impulse
      const crackStart = 0.60;
      roastTl.to('.st-roast-bean-wrap', { x: '14px', rotation: 4, duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-roast-bean-wrap', { x: '0px', rotation: 3, duration: 0.06, ease: 'elastic.out(1, 0.3)' }, crackStart + 0.02);
      
      roastTl.to('.st-first-crack-text', { scale: 1.17, duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-first-crack-text', { scale: 1.10, opacity: 0, duration: 0.06, ease: 'power2.in' }, crackStart + 0.02);

      // Radial displacement
      roastTl.fromTo('.st-crack-radial', 
        { scale: 0.4, opacity: 0 }, 
        { scale: 1.5, opacity: 0.6, duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-crack-radial', { scale: 2.5, opacity: 0, duration: 0.06, ease: 'power2.out' }, crackStart + 0.02);

      // Secondary object impulse
      roastTl.to('.st-roast-fg-parallax', { x: '-18px', duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-roast-fg-parallax', { x: '0px', duration: 0.06, ease: 'elastic.out(1, 0.3)' }, crackStart + 0.02);

      // --- 0.68-0.90 DEVELOPMENT ---
      roastTl.to('.st-roast-bean-img', 
        { scale: 1.10, filter: 'brightness(0.7) contrast(1.15) sepia(0.3)', duration: 0.22, ease: 'none' }, 0.68);
      
      // DEVELOPMENT moving slowly
      roastTl.fromTo('.st-development-text', 
        { x: '15vw', opacity: 0 }, 
        { x: '0vw', opacity: 1, duration: 0.05, ease: 'power1.out' }, 0.68)
        .to('.st-development-text', { x: '-15vw', duration: 0.12, ease: 'none' }, 0.73)
        .to('.st-development-text', { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.85);

      // Sensory notes
      roastTl.fromTo('.st-note-jasmine', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04 }, 0.70)
             .to('.st-note-jasmine', { opacity: 0, duration: 0.04 }, 0.76);
      roastTl.fromTo('.st-note-caramel', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04 }, 0.75)
             .to('.st-note-caramel', { opacity: 0, duration: 0.04 }, 0.81);
      roastTl.fromTo('.st-note-cocoa', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04 }, 0.80)
             .to('.st-note-cocoa', { opacity: 0, duration: 0.04 }, 0.86);

      // --- 0.90-1.00 CHARACTER ---
      roastTl.fromTo('.st-character-text', { scale: 0.95, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.10, ease: 'power2.out' }, 0.90);

      // --- ROAST -> BREW HANDOFF (0.833 - 1.00) ---
      const h = 0.833;
      const d = 0.167;
      
      // 0-20% final bean -> push in begins (we start scale at 0.833 to hit peak at 1.00 or so)
      roastTl.to('.st-roast-bean-wrap', { scale: 4.0, duration: d * 0.50, ease: 'power2.inOut' }, h + d * 0.20);
      
      // 50% mask opens
      roastTl.fromTo('.st-bean-mask', 
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 }, 
        { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: d * 0.25, ease: 'power2.inOut' }, h + d * 0.50);
      
      // 65% grounds texture appears
      roastTl.fromTo('.st-grounds-img', 
        { opacity: 0, scale: 1.2 }, 
        { opacity: 1, scale: 1.0, duration: d * 0.20 }, h + d * 0.65);
      
      // 78% bean disappears
      roastTl.to('.st-roast-bean-img', { opacity: 0, duration: d * 0.15 }, h + d * 0.78);
      
      // 88% grounds settle
      roastTl.to('.st-bean-mask', { scale: 1.05, duration: d * 0.12, ease: 'power1.out' }, h + d * 0.88);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[140vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="roast"
      style={{ zIndex: 5 }}
    >
      <div className="st-roast-pin w-full h-screen relative st-roast-bg overflow-hidden depth-bg">
        
        {/* Background Parallax Layer (0.4x) */}
        <div className="absolute inset-0 w-full h-[150vh] st-roast-bg-parallax opacity-20 pointer-events-none mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1518832553480-1619eb2ab514?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
        </div>

        {/* Heat Distortion Overlay */}
        <div className="absolute inset-0 st-heat-distortion pointer-events-none mix-blend-color-dodge bg-gradient-to-t from-orange-500/20 to-transparent" />

        {/* Quiet Typography (GREEN) */}
        <div className="absolute top-1/3 left-[15vw] st-quiet-typography pointer-events-none">
          <span className="text-[#8B9D83] text-[6vw] font-display uppercase tracking-widest">Raw Nature</span>
        </div>

        {/* Secondary Typography (HEAT/YELLOW) */}
        <div className="absolute top-[20vh] left-[50vw] w-[150vw] flex justify-between st-secondary-typography pointer-events-none mix-blend-overlay">
          <span className="text-[#C5A880] text-[8vw] font-display">WARMTH</span>
          <span className="text-[#D4AF37] text-[8vw] font-display">RADIANCE</span>
          <span className="text-[#995c2b] text-[8vw] font-display">GLOW</span>
        </div>

        {/* DEVELOPMENT Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 st-development-text pointer-events-none mix-blend-overlay z-0">
          <span className="text-white text-[15vw] font-display uppercase tracking-tighter opacity-10">DEVELOPMENT</span>
        </div>

        {/* Sensory Notes */}
        <div className="absolute top-[60vh] left-[20vw] st-note-jasmine pointer-events-none">
          <span className="text-[#C5A880] text-[4vw] font-display uppercase tracking-widest">JASMINE</span>
        </div>
        <div className="absolute top-[30vh] left-[65vw] st-note-caramel pointer-events-none">
          <span className="text-[#995c2b] text-[4.5vw] font-display uppercase tracking-widest">CARAMEL</span>
        </div>
        <div className="absolute top-[70vh] left-[55vw] st-note-cocoa pointer-events-none">
          <span className="text-[#5C3A21] text-[5vw] font-display uppercase tracking-widest">COCOA</span>
        </div>

        {/* CHARACTER Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 st-character-text pointer-events-none z-10 text-center">
          <span className="text-[#D4AF37] text-[12vw] font-display uppercase tracking-tighter mix-blend-color-dodge">RICH</span>
        </div>

        {/* FIRST CRACK Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mix-blend-difference text-white z-10">
          <div className="text-[12vw] font-display uppercase tracking-tighter leading-none flex st-first-crack-text">
            <span>FIRST</span>
            <span className="ml-4">CRACK</span>
          </div>
        </div>

        {/* The single cross-world bean (1x) */}
        <div className="absolute left-[30vw] top-1/2 -translate-y-1/2 w-[35vw] h-[35vw] st-roast-bean-wrap depth-main pointer-events-none z-[5]">
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl st-roast-bean-img" />
          
          <div className="absolute inset-0 rounded-full st-bean-mask overflow-hidden opacity-0 pointer-events-none">
             <img src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover st-grounds-img" />
          </div>
        </div>
        
        {/* Foreground Detail Parallax (1.25x) */}
        <div className="absolute top-[80vh] left-[65vw] w-[15vw] h-[15vw] st-roast-fg-parallax depth-fg blur-md opacity-70 z-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover rounded-full brightness-50" />
        </div>

        {/* First Crack Radial Displacement */}
        <div className="absolute top-1/2 left-[30vw] -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-white/30 blur-3xl opacity-0 st-crack-radial pointer-events-none z-10 mix-blend-overlay" />
      </div>
    </div>
  );
}
