import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ORIGIN_IMAGES } from '../assets/images';

gsap.registerPlugin(ScrollTrigger);

interface OriginProps {
  isJourney?: boolean;
}

export default function Origin({ isJourney }: OriginProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const isActive = isJourney || activeFork === 'origin';

  // 0.35x pointer movement for background material
  useEffect(() => {
    let handlePointerMove: (() => void) | null = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && containerRef.current) {
        const bgX = gsap.quickTo('.st-entry-bg-material', 'x', { duration: 0.8, ease: 'power2.out' });
        const bgY = gsap.quickTo('.st-entry-bg-material', 'y', { duration: 0.8, ease: 'power2.out' });
        
        let lastX = -1000;
        let lastY = -1000;
        let targetX = 0;
        let targetY = 0;

        handlePointerMove = () => {
           const { pointer } = useExperienceStore.getState();
           if (pointer.x === -1000) return;
           if (lastX === -1000) { lastX = pointer.x; lastY = pointer.y; return; }
           
           const dx = (pointer.x - lastX) / window.innerWidth;
           const dy = (pointer.y - lastY) / window.innerHeight;
           targetX += dx * 5; 
           targetY += dy * 5;
           lastX = pointer.x; 
           lastY = pointer.y;
           
           targetX *= 0.92; 
           targetY *= 0.92;
           
           const cx = Math.max(-1, Math.min(1, targetX));
           const cy = Math.max(-1, Math.min(1, targetY));
           
           // Journey.tsx moves .depth-main by cx * 6. We want 0.35x of that.
           bgX(cx * 2.1);
           bgY(cy * 2.1);
        };
        gsap.ticker.add(handlePointerMove);
    }
    return () => {
        if (handlePointerMove) gsap.ticker.remove(handlePointerMove);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = window;
    
    ScrollTrigger.getAll().filter(t => t.vars.trigger === '.st-hero-pin' && t.scroller === scroller).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: isJourney ? '.st-hero-pin' : null,
          scroller: scroller,
          start: isJourney ? 'top top' : '0',
          end: isJourney ? '+=600%' : '600vh',
          scrub: true,
          pin: isJourney ? true : false,
          anticipatePin: 1,
          onEnter: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          },
          onEnterBack: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          }
        }
      });
      
      // The pin timeline represents 0.0 to 1.0 of the scroll space.
      // 1. ENTRY (0.00 -> 0.12)
      pinTl.fromTo('.st-entry-logo', { scale: 1, y: '0vh' }, { scale: 0.95, y: '-2vh', duration: 0.12, ease: 'none', immediateRender: false }, 0);
      pinTl.fromTo('.st-entry-headline-group', { y: '0vh' }, { y: '-5vh', duration: 0.12, ease: 'none', immediateRender: false }, 0);
      pinTl.fromTo('.st-entry-subject-img', { scale: 0.94 }, { scale: 1.00, duration: 0.12, ease: 'none', immediateRender: false }, 0);
      pinTl.fromTo('.st-entry-meta', { y: '0vh' }, { y: '-2vh', duration: 0.12, ease: 'none', immediateRender: false }, 0);

      // 2. ENTRY -> ORIGIN TRANSITION (0.12 -> 0.32 approx 35-45vh of transition space)
      // Progress map: 
      // 0.00 of trans = 0.12 absolute
      // 0.20 of trans = 0.16 absolute
      // 0.35 of trans = 0.19 absolute
      // 0.45 of trans = 0.21 absolute
      // 0.55 of trans = 0.23 absolute
      // 0.65 of trans = 0.25 absolute
      // 0.78 of trans = 0.276 absolute
      // 0.90 of trans = 0.30 absolute
      // 1.00 of trans = 0.32 absolute
      
      // 0.20 trans (0.16): Entry headline shifts upward 4vh
      pinTl.to('.st-entry-headline-group', { y: '-9vh', duration: 0.116, ease: 'none', immediateRender: false }, 0.16);
      
      // 0.35 trans (0.19): hero material scales +8% (1.00 -> 1.08)
      pinTl.to('.st-entry-subject-img', { scale: 1.08, duration: 0.13, ease: 'none', immediateRender: false }, 0.19);
      
      // 0.45 trans (0.21): Origin image begins appearing behind Entry material
      pinTl.fromTo('.st-origin-composition', { opacity: 0 }, { opacity: 0.35, duration: 0.02, ease: 'none', immediateRender: false }, 0.21); // reaches 0.35 at 0.55 trans (0.23)
      pinTl.to('.st-origin-composition', { opacity: 0.70, duration: 0.02, ease: 'none', immediateRender: false }, 0.23); // reaches 0.70 at 0.65 trans (0.25)
      pinTl.to('.st-origin-composition', { opacity: 1.00, duration: 0.05, ease: 'none', immediateRender: false }, 0.25); // reaches 1.00 at 0.90 trans (0.30)
      
      // 0.78 trans (0.276): Entry headline exits
      pinTl.to('.st-entry-headline-group', { opacity: 0, y: '-20vh', duration: 0.044, ease: 'power2.in', immediateRender: false }, 0.276);

      // We clip away the entry image starting at 0.19 to reveal Origin underneath
      pinTl.to('.st-entry-bg-material', { opacity: 0, duration: 0.05, immediateRender: false }, 0.23);
      pinTl.fromTo('.st-entry-subject-container', 
          { clipPath: 'inset(0% 0% 0% 0%)' }, 
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.13, ease: 'power2.inOut', immediateRender: false }, 0.19); // fully clipped by 0.32

      pinTl.to('.st-entry-logo', { opacity: 0, duration: 0.044, ease: 'none', immediateRender: false }, 0.276);
      pinTl.to('.st-entry-meta', { opacity: 0, duration: 0.044, ease: 'none', immediateRender: false }, 0.276);

      // 3. ORIGIN HERO (0.32 -> 0.85)
      // 0.00-0.15 almost still (0.32 -> 0.3995)
      // 0.15-0.40 camera push (0.3995 -> 0.532)
      pinTl.fromTo('.st-origin-subject-img', { scale: 1.00 }, { scale: 1.06, duration: 0.1325, ease: 'none', immediateRender: false }, 0.3995);
      pinTl.fromTo('.st-title-line-1', { y: '0vh', x: '0vw' }, { y: '-4vh', x: '0vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.3995);
      pinTl.fromTo('.st-title-line-2', { y: '0vh', x: '0vw' }, { y: '-4.32vh', x: '0vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.3995); 
      pinTl.fromTo('.st-title-line-3', { y: '0vh', x: '0vw' }, { y: '-4.6vh', x: '0vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.3995); 

      // 0.40-0.65 (0.532 -> 0.6645)
      pinTl.to('.st-origin-subject-img', { scale: 1.10, duration: 0.1325, ease: 'none', immediateRender: false }, 0.532);
      pinTl.to('.st-title-line-1', { y: '-8vh', x: '-1.5vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.532);
      pinTl.to('.st-title-line-2', { y: '-8.64vh', x: '1vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.532);
      pinTl.to('.st-title-line-3', { y: '-9.2vh', x: '0vw', duration: 0.1325, ease: 'none', immediateRender: false }, 0.532);

      // 0.65-0.85 (0.6645 -> 0.7705)
      pinTl.to('.st-origin-subject-img', { scale: 1.15, duration: 0.106, ease: 'none', immediateRender: false }, 0.6645);
      pinTl.fromTo('.st-meta-altitude', { x: '0vw' }, { x: '3vw', duration: 0.106, ease: 'none', immediateRender: false }, 0.6645);
      pinTl.fromTo('.st-meta-varietal', { y: '0vh' }, { y: '-3vh', duration: 0.106, ease: 'none', immediateRender: false }, 0.6645);
      
      // Origin Object
      pinTl.fromTo('.st-foreground-bean', { x: '-10vw', rotation: -2 }, { x: '0vw', rotation: 2, duration: 0.265, ease: 'none', immediateRender: false }, 0.32);
      pinTl.to('.st-foreground-bean', { x: '7vw', rotation: 0, duration: 0.1855, ease: 'none', immediateRender: false }, 0.585);
      pinTl.to('.st-foreground-bean', { x: '3vw', duration: 0.0795, ease: 'power2.out', immediateRender: false }, 0.7705);

      // 0.85-1.00 (0.7705 -> 0.85)
      pinTl.fromTo('.st-origin-subject-img', { objectPosition: '65% 25%' }, { objectPosition: '68% 28%', duration: 0.0795, ease: 'none', immediateRender: false }, 0.7705);

      // 4. ORIGIN -> ROAST (0.85 -> 1.00)
      pinTl.to('.st-origin-subject-img', { scale: 1.4, duration: 0.15, ease: 'power2.in', immediateRender: false }, 0.85);
      pinTl.fromTo('.st-origin-content-wrapper',
        { clipPath: 'circle(150% at 68% 28%)' },
        { clipPath: 'circle(0% at 68% 28%)', ease: 'power2.inOut', duration: 0.10, immediateRender: false }, 0.90);
        
      pinTl.fromTo('.st-roast-placeholder', { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.85);
      pinTl.to('.st-roast-placeholder', { opacity: 1, duration: 0.1, immediateRender: false }, 0.90);
    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div ref={containerRef} className={`relative w-full ${isJourney ? '' : ''}`} data-world="origin" style={{ zIndex: 10 }}>
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-transparent">
        <div className="drift-entry-stage w-full h-full relative">
          
          <div className="absolute inset-0 z-0 pointer-events-none st-roast-placeholder flex items-center justify-center bg-[#E3E8E0]">
            <div className="absolute top-[20%] right-[10%] text-[#5C3A21]/20 font-display text-[20vw] opacity-30 pointer-events-none">ROAST</div>
          </div>

          <div className="absolute inset-0 z-10 st-origin-content-wrapper overflow-hidden ">
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* ORIGIN COMPOSITION */}
            <div className="st-origin-composition absolute inset-0 z-10">
               <div className="absolute top-[10%] right-[5%] z-10 w-[85vw] md:w-[60vw] h-[80vh] overflow-hidden pointer-events-none shadow-2xl depth-main st-origin-subject-container">
                 <img
                   src={ORIGIN_IMAGES.hero.url}
                   alt={ORIGIN_IMAGES.hero.alt}
                   loading="eager"
                   className="w-full h-full object-cover grayscale-[0.1] st-origin-subject-img origin-center"
                   style={{ objectPosition: '65% 25%' }}
                 />
               </div>
               <div className="absolute top-[25%] left-[8%] z-20 flex flex-col items-start pointer-events-none depth-type st-hero-title-container mix-blend-difference text-white">
                  <div className="text-[14vw] leading-[0.8] font-display uppercase tracking-tighter">
                    <div className="st-title-line-1">ETHIOPIAN</div>
                    <div className="pl-12 st-title-line-2">HEIRLOOM</div>
                    <div className="pl-24 st-title-line-3 text-white/70">COFFEE</div>
                  </div>
               </div>
               <div className="absolute bottom-[12%] right-[15%] text-right st-meta-altitude mix-blend-difference text-white">
                 <p className="text-[11px] tracking-[0.35em] font-sans uppercase mb-3 opacity-60">Elevation</p>
                 <p className="text-6xl font-display">1,900M</p>
               </div>
               <div className="absolute top-[55%] left-[10%] text-left st-meta-varietal mix-blend-difference text-white">
                 <p className="text-[11px] tracking-[0.35em] font-sans uppercase mb-3 opacity-60">Process</p>
                 <p className="text-6xl font-display">Natural</p>
               </div>
            </div>

            {/* ENTRY COMPOSITION */}
            <div className="st-entry-composition absolute inset-0 z-20 pointer-events-none ">
              {/* Background Material layer for Entry */}
              <div className="st-entry-bg-material absolute top-0 right-0 w-[60vw] h-full opacity-30 pointer-events-none overflow-hidden mix-blend-multiply">
                 <img
                   src={ORIGIN_IMAGES.hero.url}
                   alt=""
                   className="w-full h-full object-cover blur-sm"
                   style={{ objectPosition: '80% 20%' }}
                 />
              </div>

              <h1 className="st-entry-logo absolute top-[12%] left-[10%] text-[22vw] font-display uppercase tracking-[-0.04em] leading-none text-drift-foreground mix-blend-difference text-white">
                DRIFT
              </h1>
              
              <div className="st-entry-headline-group absolute bottom-[15%] left-[10%] mix-blend-difference text-white">
                 <div className="h-[1px] w-24 bg-white/60 mb-8" />
                 <p className="text-sm font-sans tracking-[0.25em] uppercase">Coffee changes the pace of a room.</p>
              </div>

              <div className="st-entry-meta absolute bottom-16 right-[10%] mix-blend-difference text-white/70">
                 <p className="text-xs tracking-[0.3em] uppercase">Single Origin</p>
              </div>

              {/* Main material: depth-main */}
              <div className="st-entry-subject-container absolute top-[15%] right-[10%] w-[50vw] h-[70vh] overflow-hidden shadow-2xl depth-main bg-drift-bg">
                 <img
                   src={ORIGIN_IMAGES.hero.url}
                   alt="Entry Material"
                   className="w-full h-full object-cover grayscale-[0.2] st-entry-subject-img origin-center"
                   style={{ objectPosition: '70% 30%' }}
                 />
              </div>
            </div>

            {/* Foreground Detail: depth-fg */}
            <div className="absolute top-[66%] right-[35%] z-40 w-56 h-56 st-foreground-bean pointer-events-none drop-shadow-2xl depth-fg">
               <img
                 src={ORIGIN_IMAGES.greenBean.url}
                 alt={ORIGIN_IMAGES.greenBean.alt}
                 className="w-full h-full object-cover rounded-full mix-blend-darken"
                 style={{ objectPosition: ORIGIN_IMAGES.greenBean.position }}
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





