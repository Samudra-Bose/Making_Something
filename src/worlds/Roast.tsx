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

      // Depth Parallax
      roastTl.fromTo('.st-roast-bg-parallax', { y: '0vh' }, { y: '-20vh', duration: 1, ease: 'none' }, 0);
      roastTl.fromTo('.st-roast-fg-parallax', { y: '20vh' }, { y: '-80vh', duration: 1, ease: 'none' }, 0);

      // Background Color Transformation
      // Base: #E3E8E0 (Green), #F2E3C6 (Heat/Yellow), #D4AF37 (Gold), #C68E58 (Caramel), #8B4513 (Chestnut), #3E2723 (Dark Brown), #1A100C (Character)
      roastTl.fromTo('.st-roast-bg', { backgroundColor: '#E3E8E0' }, { backgroundColor: '#E3E8E0', duration: 0.18, ease: 'none' }, 0)
        .to('.st-roast-bg', { backgroundColor: '#F2E3C6', duration: 0.20, ease: 'none' }, 0.18) // HEAT (18-38) -> Warmth
        .to('.st-roast-bg', { backgroundColor: '#D4AF37', duration: 0.17, ease: 'none' }, 0.38) // YELLOW / GOLD (38-55) -> Gold
        // DEVELOPMENT (72-92): gold -> caramel -> chestnut -> dark brown. Wait, 55-72 is first crack, hold color mostly, maybe slight darken.
        .to('.st-roast-bg', { backgroundColor: '#C68E58', duration: 0.17, ease: 'none' }, 0.55) // FIRST CRACK (55-72) -> Caramel
        .to('.st-roast-bg', { backgroundColor: '#8B4513', duration: 0.10, ease: 'none' }, 0.72) // DEV (72-82) -> Chestnut
        .to('.st-roast-bg', { backgroundColor: '#3E2723', duration: 0.10, ease: 'none' }, 0.82) // DEV (82-92) -> Dark Brown
        .to('.st-roast-bg', { backgroundColor: '#1A100C', duration: 0.08, ease: 'none' }, 0.92); // CHARACTER (92-100) -> Dark

      // --- 0.00-0.18 GREEN ---
      // Bean: scale 0.92 -> 1.00, rotation -2deg -> 0, y: 0 -> -1vh
      roastTl.fromTo('.st-roast-bean-wrap', 
        { rotation: -2, y: '0vh' }, 
        { rotation: 0, y: '-1vh', duration: 0.18, ease: 'power1.out' }, 0);
      roastTl.fromTo('.st-roast-bean-img', 
        { scale: 0.92, filter: 'brightness(1.05) contrast(0.95)' }, 
        { scale: 1.00, filter: 'brightness(1.02) contrast(0.98)', duration: 0.18, ease: 'power1.out' }, 0);
      
      // Quiet Typography (Raw Nature)
      roastTl.fromTo('.st-quiet-typography', { opacity: 0, y: '5vh' }, { opacity: 0.6, y: '0vh', duration: 0.08, immediateRender: false }, 0.02)
             .to('.st-quiet-typography', { opacity: 0, duration: 0.08 }, 0.10);

      // --- 0.18-0.38 HEAT ---
      // Bean: scale 1.00 -> 1.06, rotation 0 -> 3deg, y: -1vh -> -3vh
      // Color: Introduce warmer color gradually (handled in bg, adding slight sepia to bean)
      roastTl.to('.st-roast-bean-wrap', 
        { rotation: 3, y: '-3vh', duration: 0.20, ease: 'power1.inOut' }, 0.18);
      roastTl.to('.st-roast-bean-img', 
        { scale: 1.06, filter: 'brightness(1.0) contrast(1.0) sepia(0.1)', duration: 0.20, ease: 'power1.inOut' }, 0.18);

      // --- 0.38-0.55 YELLOW / GOLD ---
      // Bean color: green -> yellow -> gold, Texture: light -> slightly darker
      roastTl.to('.st-roast-bean-img', 
        { filter: 'brightness(0.95) contrast(1.1) sepia(0.2)', duration: 0.17, ease: 'none' }, 0.38);
      
      // Secondary typography: x 0 -> -4vw
      roastTl.fromTo('.st-secondary-typography', 
        { x: '0vw', opacity: 0 }, 
        { x: '-2vw', opacity: 1, duration: 0.08, ease: 'none', immediateRender: false }, 0.38)
        .to('.st-secondary-typography', { x: '-4vw', duration: 0.09, ease: 'none' }, 0.46)
        .to('.st-secondary-typography', { opacity: 0, duration: 0.04, ease: 'power1.out' }, 0.51);

      // --- 0.55-0.72 FIRST CRACK ---
      // 55-61%: reduce all secondary movement by 30% (increase negative space - background elements fade or slow down)
      roastTl.to('.st-roast-bg-parallax', { y: '-14vh', duration: 0.06, ease: 'power2.out' }, 0.55); // Slow down parallax
      roastTl.to('.st-roast-fg-parallax', { opacity: 0.3, duration: 0.06, ease: 'power2.out' }, 0.55); // Increase negative space

      // 61-66%:
      // Bean: x 0 -> 14px, rotation: 0 -> 4deg (from 3)
      roastTl.fromTo('.st-first-crack-text', { scale: 1.00, opacity: 0, x: '0vw' }, { opacity: 1, duration: 0.03, immediateRender: false }, 0.58)
             .to('.st-first-crack-text', { scale: 1.16, x: '-1.5vw', duration: 0.05, ease: 'power3.out' }, 0.61);
      roastTl.fromTo('.st-crack-line-two', { x: '0vw' }, { x: '1.5vw', duration: 0.05, ease: 'power3.out', immediateRender: false }, 0.61);

      roastTl.to('.st-roast-bean-wrap', { x: '14px', rotation: 4, duration: 0.05, ease: 'power4.out' }, 0.61);
      roastTl.to('.st-roast-fg-parallax', { x: '-18px', duration: 0.02, ease: 'power4.out' }, 0.61)
             .to('.st-roast-fg-parallax', { x: '18px', duration: 0.03, ease: 'power4.inOut' }, 0.63);

      // 66-68%: return all impulse values toward normal
      roastTl.to('.st-roast-bean-wrap', { x: '0px', duration: 0.02, ease: 'power2.out' }, 0.66);
      roastTl.to('.st-roast-fg-parallax', { x: '0px', duration: 0.02, ease: 'power2.out' }, 0.66);
      
      // 68-72%: settle
      roastTl.to('.st-first-crack-text', { opacity: 0, duration: 0.04, ease: 'power2.in' }, 0.68);
      
      // --- 0.72-0.92 DEVELOPMENT ---
      // Color (in bg), Bean scale 1.03 -> 1.10 (Wait, it was 1.06 at heat, so maybe it dropped slightly during crack? Let's just scale to 1.10)
      roastTl.to('.st-roast-bean-img', 
        { scale: 1.10, filter: 'brightness(0.7) contrast(1.15) sepia(0.3)', duration: 0.20, ease: 'none' }, 0.72);
      
      // Sensory words sequential (Jasmine -> Caramel -> Cocoa)
      // Jasmine: enters from left, settles
      roastTl.fromTo('.st-note-jasmine', { x: '-5vw', opacity: 0 }, { x: '0vw', opacity: 1, duration: 0.04, immediateRender: false }, 0.72)
             .to('.st-note-jasmine', { opacity: 0, duration: 0.04 }, 0.78);
      // Caramel: enters from right, settles
      roastTl.fromTo('.st-note-caramel', { x: '5vw', opacity: 0 }, { x: '0vw', opacity: 1, duration: 0.04, immediateRender: false }, 0.78)
             .to('.st-note-caramel', { opacity: 0, duration: 0.04 }, 0.84);
      // Cocoa: enters from below, settles
      roastTl.fromTo('.st-note-cocoa', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.04, immediateRender: false }, 0.84)
             .to('.st-note-cocoa', { opacity: 0, duration: 0.04 }, 0.90);

      // --- 0.92-1.00 CHARACTER ---
      // Reduce motion. Increase negative space. One sensory word becomes dominant (RICH). Bean settles.
      roastTl.to('.st-roast-bean-wrap', { rotation: 0, y: '0vh', duration: 0.08, ease: 'power2.out' }, 0.92);
      roastTl.to('.st-roast-fg-parallax', { opacity: 0, duration: 0.08 }, 0.92); // Increase negative space
      roastTl.fromTo('.st-character-text', { scale: 0.95, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.08, ease: 'power2.out', immediateRender: false }, 0.92);

      // --- ROAST -> BREW HANDOFF (Wait, ROAST->BREW: visual order: final bean -> macro bean -> extreme crop -> grounds -> grounds settle)
      // Wait, 92-100% is Character. The handoff should probably happen near the end or overlap?
      // "ROAST -> BREW: Use approximately 50vh. Required visual order: final bean -> macro bean -> extreme crop -> grounds -> grounds settle. Water must not appear until grounds have settled."
      // Since this is the Roast component, we just handle the visual transformation of the bean into grounds. The Brew component handles water.
      
      const h = 0.85; // Let's overlap the zoom with the character phase slightly
      const d = 0.15; // The final 15% of the scroll
      
      // final bean -> macro bean (scale 1.10 -> 2.0) -> extreme crop (scale 2.0 -> 5.0)
      roastTl.to('.st-roast-bean-wrap', { scale: 5.0, duration: d * 0.60, ease: 'power2.in' }, h);
      
      // grounds appear (mask opens over extreme crop)
      roastTl.fromTo('.st-bean-mask', 
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 }, 
        { clipPath: 'circle(100% at 50% 50%)', opacity: 1, duration: d * 0.30, ease: 'power2.inOut', immediateRender: false }, h + d * 0.50);
      
      roastTl.fromTo('.st-grounds-img', 
        { opacity: 0, scale: 1.2 }, 
        { opacity: 1, scale: 1.0, duration: d * 0.20, immediateRender: false }, h + d * 0.50);
      
      roastTl.to('.st-roast-bean-img', { opacity: 0, duration: d * 0.20 }, h + d * 0.70);
      
      // grounds settle
      roastTl.to('.st-bean-mask', { scale: 1.02, duration: d * 0.20, ease: 'power1.out' }, h + d * 0.80);

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

        {/* Sensory Notes - Layered and scattered (DEVELOPMENT) */}
        <div className="absolute top-[50vh] md:top-[40vh] left-[15vw] md:left-[25vw] st-note-jasmine pointer-events-none z-10 mix-blend-difference text-white">
          <span className="text-[6vw] md:text-[4vw] font-display uppercase tracking-widest opacity-80">JASMINE</span>
        </div>
        <div className="absolute top-[60vh] md:top-[50vh] right-[15vw] md:right-[25vw] st-note-caramel pointer-events-none z-10 mix-blend-difference text-white">
          <span className="text-[7vw] md:text-[4.5vw] font-display uppercase tracking-widest opacity-80">CARAMEL</span>
        </div>
        <div className="absolute top-[75vh] md:top-[65vh] left-[50vw] -translate-x-1/2 st-note-cocoa pointer-events-none z-10 mix-blend-difference text-white">
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
            <span className="md:ml-12 text-white/80 st-crack-line-two">CRACK</span>
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
