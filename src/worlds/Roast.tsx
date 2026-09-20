import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROAST_IMAGES } from '../assets/images';

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
    const scroller = window;
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-roast-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const roastTl = gsap.timeline({
        scrollTrigger: {
          trigger: isJourney ? '.st-roast-pin' : null,
          start: isJourney ? 'top top' : '400vh',
          end: isJourney ? '+=300%' : '700vh',
          pin: isJourney ? true : false,
          scroller: scroller,
          
           
          scrub: 1,
          
          anticipatePin: 1,
          onEnter: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('roast');
          },
          onEnterBack: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('roast');
          },
          onUpdate: (self) => {
            if (isActive) {
               useExperienceStore.getState().setRoastDevelopment(self.progress);
            }
          }
        }
      });

      // GLOBAL OBJECT TRAVEL (Do not remove, affects AppShell)
      roastTl.fromTo('.st-foreground-bean', { x: '10vw', rotate: 0 }, { x: '-80vw', rotate: 180, duration: 1, ease: 'none', immediateRender: false }, 0);
      roastTl.fromTo('.st-bg-word-roast', { x: '50vw' }, { x: '-150vw', duration: 1, ease: 'none', immediateRender: false }, 0);

      // Background Color Transformation
      roastTl.fromTo('.st-roast-bg', 
        { backgroundColor: '#E3E8E0' }, 
        { backgroundColor: '#E3E8E0', duration: 0.18, ease: 'none' }, 0)
        .to('.st-roast-bg', { backgroundColor: '#F2E3C6', duration: 0.20, ease: 'none' }, 0.18) // Yellow
        .to('.st-roast-bg', { backgroundColor: '#D4AF37', duration: 0.17, ease: 'none' }, 0.38) // Gold
        .to('.st-roast-bg', { backgroundColor: '#C68E58', duration: 0.13, ease: 'none' }, 0.55) // Caramel
        .to('.st-roast-bg', { backgroundColor: '#8B4513', duration: 0.11, ease: 'none' }, 0.68) // Chestnut
        .to('.st-roast-bg', { backgroundColor: '#5C3A21', duration: 0.11, ease: 'none' }, 0.79) // Brown
        .to('.st-roast-bg', { backgroundColor: '#1A100C', duration: 0.10, ease: 'none' }, 0.90); // Dark

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
      roastTl.fromTo('.st-quiet-typography', { opacity: 0, y: '5vh' }, { opacity: 0.6, y: '0vh', duration: 0.10, immediateRender: false }, 0.04)
             .to('.st-quiet-typography', { opacity: 0, duration: 0.04 }, 0.14);

      // --- 0.18-0.38 HEAT ---
      roastTl.to('.st-roast-bean-wrap', 
        { rotation: 3, y: '-3vh', duration: 0.20, ease: 'power1.inOut' }, 0.18);
      roastTl.to('.st-roast-bean-img', 
        { scale: 1.07, duration: 0.20, ease: 'power1.inOut' }, 0.18);
      roastTl.fromTo('.st-heat-distortion', { opacity: 0 }, { opacity: 0.3, duration: 0.10, immediateRender: false }, 0.20)
             .to('.st-heat-distortion', { opacity: 0, duration: 0.08 }, 0.30);

      // --- 0.38-0.55 YELLOW / GOLD ---
      roastTl.to('.st-roast-bean-img', 
        { filter: 'brightness(0.9) contrast(1.1) sepia(0.2)', duration: 0.17, ease: 'none' }, 0.38);
      
      // Secondary typography moves horizontally
      roastTl.fromTo('.st-secondary-typography', 
        { x: '10vw', opacity: 0 }, 
        { x: '-20vw', opacity: 1, duration: 0.10, ease: 'none', immediateRender: false }, 0.38)
        .to('.st-secondary-typography', { x: '-30vw', duration: 0.04, ease: 'none' }, 0.48) // Reduce movement (0.52-0.60)
        .to('.st-secondary-typography', { x: '-35vw', opacity: 0, duration: 0.08, ease: 'power1.out' }, 0.52);

      // --- 0.52-0.68 FIRST CRACK ---
      // 0.52 - 0.60 Tension (motion drops by ~25% conceptually handled above in typography speed, or bean easing)
      roastTl.fromTo('.st-first-crack-text', 
        { scale: 1.00, opacity: 0, letterSpacing: '0em' }, 
        { scale: 1.05, opacity: 1, letterSpacing: '-0.02em', duration: 0.08, ease: 'power2.in', immediateRender: false }, 0.52);

      // 0.60 - Crack Impulse
      const crackStart = 0.60;
      roastTl.to('.st-roast-bean-wrap', { x: '14px', rotation: 4, duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-roast-bean-wrap', { x: '0px', rotation: 0, duration: 0.06, ease: 'elastic.out(1, 0.3)' }, crackStart + 0.02);
      
      roastTl.to('.st-first-crack-text', { scale: 1.15, duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-first-crack-text', { scale: 1.00, opacity: 0, duration: 0.06, ease: 'power2.in' }, crackStart + 0.02);

      // Secondary object impulse (+/-18px)
      roastTl.to('.st-roast-fg-parallax', { x: '-18px', duration: 0.02, ease: 'power4.out' }, crackStart)
             .to('.st-roast-fg-parallax', { x: '18px', duration: 0.03, ease: 'power4.inOut' }, crackStart + 0.02)
             .to('.st-roast-fg-parallax', { x: '0px', duration: 0.03, ease: 'elastic.out(1, 0.3)' }, crackStart + 0.05);

      // --- 0.68-0.90 DEVELOPMENT ---
      roastTl.fromTo('.st-roast-bean-img', 
        { scale: 1.02 },
        { scale: 1.10, filter: 'brightness(0.7) contrast(1.15) sepia(0.3)', duration: 0.22, ease: 'none', immediateRender: false }, 0.68);
      
      // DEVELOPMENT moving slowly
      roastTl.fromTo('.st-development-text', 
        { x: '15vw', opacity: 0 }, 
        { x: '0vw', opacity: 1, duration: 0.05, ease: 'power1.out', immediateRender: false }, 0.68)
        .to('.st-development-text', { x: '-15vw', duration: 0.12, ease: 'none' }, 0.73)
        .to('.st-development-text', { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.85);

      // Sensory notes
      roastTl.fromTo('.st-note-jasmine', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04, immediateRender: false }, 0.70)
             .to('.st-note-jasmine', { opacity: 0, duration: 0.04 }, 0.76);
      roastTl.fromTo('.st-note-caramel', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04, immediateRender: false }, 0.75)
             .to('.st-note-caramel', { opacity: 0, duration: 0.04 }, 0.81);
      roastTl.fromTo('.st-note-cocoa', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04, immediateRender: false }, 0.80)
             .to('.st-note-cocoa', { opacity: 0, duration: 0.04 }, 0.86);

      // --- 0.90-1.00 CHARACTER ---
      roastTl.fromTo('.st-character-text', { scale: 0.95, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.10, ease: 'power2.out', immediateRender: false }, 0.90);

      // --- ROAST -> BREW HANDOFF (0.833 - 1.00) ---
      const h = 0.833;
      const d = 0.167;
      
      // 0-20% final bean -> push in begins (we start scale at 0.833 to hit peak at 1.00 or so)
      roastTl.to('.st-roast-bean-wrap', { scale: 4.0, duration: d * 0.50, ease: 'power2.inOut' }, h + d * 0.20);
      
      // 50% mask opens
      roastTl.fromTo('.st-bean-mask', 
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 }, 
        { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: d * 0.25, ease: 'power2.inOut', immediateRender: false }, h + d * 0.50);
      
      // 65% grounds texture appears
      roastTl.fromTo('.st-grounds-img', 
        { opacity: 0, scale: 1.2 }, 
        { opacity: 1, scale: 1.0, duration: d * 0.20, immediateRender: false }, h + d * 0.65);
      
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
      className={`relative w-full ${isJourney ? '-mt-[140vh]' : ''}`} 
      data-world="roast"
      style={{ zIndex: 5 }}
    >
      <div className="st-roast-pin w-full h-screen relative st-roast-bg overflow-hidden depth-bg">
        
        {/* Background Parallax Layer (0.4x) - Subordinate */}
        <div className="absolute inset-0 w-full h-[150vh] st-roast-bg-parallax opacity-10 pointer-events-none mix-blend-overlay">
          <img
            src={ROAST_IMAGES.bgTexture.url}
            alt={ROAST_IMAGES.bgTexture.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale"
            style={{ objectPosition: ROAST_IMAGES.bgTexture.position }}
          />
        </div>

        {/* Quiet Typography (GREEN) */}
        <div className="absolute top-[10%] md:top-[15%] left-[6%] md:left-[10%] st-quiet-typography pointer-events-none z-10">
          <span className="text-[#8B9D83] text-[12vw] md:text-[8vw] font-display uppercase tracking-tighter mix-blend-difference text-white opacity-80">RAW</span>
          <span className="block text-[#8B9D83] text-[4vw] md:text-[2vw] font-sans uppercase tracking-[0.4em] mt-2 opacity-60">Nature</span>
        </div>

        {/* Secondary Typography (HEAT/YELLOW) */}
        <div className="absolute top-[25vh] md:top-[20vh] left-[50vw] w-[150vw] flex justify-between st-secondary-typography pointer-events-none mix-blend-difference text-white z-10">
          <span className="text-[10vw] md:text-[8vw] font-display opacity-80">WARMTH</span>
          <span className="text-[10vw] md:text-[8vw] font-display opacity-80">RADIANCE</span>
          <span className="text-[10vw] md:text-[8vw] font-display opacity-80">GLOW</span>
        </div>

        {/* DEVELOPMENT Typography */}
        <div className="absolute bottom-[10%] md:top-1/2 right-[5%] md:-translate-y-1/2 st-development-text pointer-events-none mix-blend-difference text-white z-[15]">
          <span className="text-[16vw] md:text-[14vw] font-display uppercase tracking-tighter leading-[0.8] opacity-90 text-right block">DEVELOP</span>
          <span className="text-[16vw] md:text-[14vw] font-display uppercase tracking-tighter leading-[0.8] opacity-90 text-right block">MENT</span>
        </div>

        {/* Sensory Notes - Layered and scattered */}
        <div className="absolute top-[75vh] md:top-[60vh] left-[10vw] md:left-[20vw] st-note-jasmine pointer-events-none z-10 mix-blend-difference text-white">
          <span className="text-[6vw] md:text-[4vw] font-display uppercase tracking-widest opacity-80">JASMINE</span>
        </div>
        <div className="absolute top-[20vh] md:top-[30vh] right-[10vw] md:left-[65vw] st-note-caramel pointer-events-none z-10 mix-blend-difference text-white">
          <span className="text-[7vw] md:text-[4.5vw] font-display uppercase tracking-widest opacity-80">CARAMEL</span>
        </div>
        <div className="absolute top-[65vh] md:top-[70vh] right-[15vw] md:left-[55vw] st-note-cocoa pointer-events-none z-10 mix-blend-difference text-white">
          <span className="text-[8vw] md:text-[5vw] font-display uppercase tracking-widest opacity-80">COCOA</span>
        </div>

        {/* CHARACTER Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 st-character-text pointer-events-none z-20 text-center mix-blend-difference text-white">
          <span className="text-[20vw] md:text-[16vw] font-display uppercase tracking-tighter opacity-95">RICH</span>
        </div>

        {/* FIRST CRACK Typography - Overlapping image */}
        <div className="absolute top-[40%] md:top-1/2 left-[5%] md:left-[25%] md:-translate-x-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none mix-blend-difference text-white z-[25]">
          <div className="text-[18vw] md:text-[12vw] font-display uppercase tracking-tighter leading-[0.85] flex flex-col st-first-crack-text opacity-95">
            <span>FIRST</span>
            <span className="md:ml-12 text-white/80">CRACK</span>
          </div>
        </div>

        {/* The single cross-world bean — primary hero object */}
        <div className="absolute right-[5%] md:right-[15%] top-[15%] md:top-1/2 md:-translate-y-1/2 w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] st-roast-bean-wrap depth-main pointer-events-none z-10">
          <img
            src={ROAST_IMAGES.bean.url}
            alt={ROAST_IMAGES.bean.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-full shadow-2xl st-roast-bean-img"
            style={{ objectPosition: ROAST_IMAGES.bean.position }}
          />
          
          {/* Grounds reveal mask — roast→brew handoff */}
          <div className="absolute inset-0 rounded-full st-bean-mask overflow-hidden opacity-0 pointer-events-none">
             <img
               src={ROAST_IMAGES.grounds.url}
               alt={ROAST_IMAGES.grounds.alt}
               loading="lazy"
               decoding="async"
               className="w-full h-full object-cover st-grounds-img"
               style={{ objectPosition: ROAST_IMAGES.grounds.position }}
             />
          </div>
        </div>
        
        {/* Foreground Detail Parallax (secondary, reduced on mobile) */}
        <div className="absolute top-[80vh] left-[5%] md:left-[10vw] w-[25vw] h-[25vw] md:w-[15vw] md:h-[15vw] st-roast-fg-parallax depth-fg blur-sm opacity-60 z-30 pointer-events-none">
           <img
             src={ROAST_IMAGES.secondaryBean.url}
             alt={ROAST_IMAGES.secondaryBean.alt}
             loading="lazy"
             decoding="async"
             className="w-full h-full object-cover rounded-full brightness-50"
             style={{ objectPosition: ROAST_IMAGES.secondaryBean.position }}
           />
        </div>
      </div>
    </div>
  );
}
