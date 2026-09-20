import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BREW_IMAGES } from '../assets/images';

gsap.registerPlugin(ScrollTrigger);

interface BrewProps {
  isJourney?: boolean;
}

export default function Brew({ isJourney }: BrewProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);

  const isActive = isJourney || activeFork === 'brew';

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = window;
    
    // Cleanup old triggers
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-brew-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      const brewTl = gsap.timeline({
        scrollTrigger: {
          trigger: isJourney ? '.st-brew-pin' : null,
          start: isJourney ? 'top top' : '700vh',
          end: isJourney ? '+=600%' : '1300vh',
          pin: isJourney ? true : false,
          scroller: scroller,
          
          scrub: 1,
          
          anticipatePin: 1,
          onEnter: () => {
             if (isActive) useExperienceStore.getState().setActiveWorld('brew');
          },
          onEnterBack: () => {
             if (isActive) useExperienceStore.getState().setActiveWorld('brew');
          },
          onUpdate: (self) => {
             if (isActive) {
               useExperienceStore.getState().setBrewProgress(self.progress); 
             }
          }
        }
      });
      
      // 1. GRIND (0-100% of scene -> 0.0 to 1.0)
      brewTl.fromTo('.st-brew-bg-fill', { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-brew-grind', { scale: 1.0 }, { scale: 1.07, duration: 1.0, ease: 'none', immediateRender: false }, 0);
      brewTl.fromTo('.st-grind-beans', { scale: 0.92, rotation: 0 }, { scale: 1.0, rotation: 10, duration: 1.0, ease: 'none', immediateRender: false }, 0);
      
      brewTl.to('.st-grind-beans', { opacity: 0, duration: 0.25, ease: 'none' }, 0.45);
      brewTl.fromTo('.st-grind-grounds', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.25, ease: 'none', immediateRender: false }, 0.45);
      brewTl.to('.st-grind-grounds', { y: '2vh', duration: 0.3, ease: 'power1.out' }, 0.7);

      brewTl.to('.st-brew-grind', { opacity: 0, duration: 0.1 }, 1.0);

      // 2. WATER (1.0 to 2.0)
      brewTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '-50vh', opacity: 1, duration: 0.2, ease: 'none', immediateRender: false }, 1.15);
      brewTl.to('.st-water-stream', { y: '-20vh', duration: 0.15, ease: 'none' }, 1.35);
      brewTl.to('.st-water-stream', { y: '0vh', duration: 0.15, ease: 'none' }, 1.50);
      brewTl.fromTo('.st-water-surface', { opacity: 0, scaleY: 0.8 }, { opacity: 1, scaleY: 1.0, duration: 0.15, ease: 'power1.out', immediateRender: false }, 1.65);
      brewTl.to('.st-water-stream', { opacity: 0, duration: 0.1, ease: 'power1.in' }, 1.80);
      brewTl.to('.st-water-surface', { scaleY: 1.05, duration: 0.1, ease: 'none' }, 1.80);
      brewTl.fromTo('.st-water-steam', { opacity: 0 }, { opacity: 0.4, duration: 0.1, ease: 'none', immediateRender: false }, 1.90);

      brewTl.to('.st-brew-water', { opacity: 0, duration: 0.1 }, 2.0);

      // 3. BLOOM (2.0 to 3.0)
      brewTl.to('.st-bloom-grounds', { filter: 'brightness(0.5)', duration: 0.2, ease: 'none' }, 2.4);
      brewTl.fromTo('.st-bloom-center', { scale: 1.00, opacity: 0 }, { opacity: 0.9, duration: 0.15, ease: 'none', immediateRender: false }, 2.6);
      brewTl.to('.st-bloom-center', { scale: 1.35, duration: 0.15, ease: 'power1.out' }, 2.6);
      brewTl.to('.st-bloom-center', { scale: 1.05, opacity: 0.7, duration: 0.15, ease: 'power1.inOut' }, 2.85);
      
      brewTl.fromTo('.st-bloom-steam', { opacity: 0 }, { opacity: 0.5, duration: 0.2, ease: 'none', immediateRender: false }, 2.6);
      brewTl.to('.st-bloom-steam', { opacity: 0.35, duration: 0.15, ease: 'none' }, 2.85);

      brewTl.fromTo('.st-bloom-text', { y: '5vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.2, ease: 'power1.out', immediateRender: false }, 2.3);

      brewTl.to('.st-brew-bloom', { opacity: 0, duration: 0.1 }, 3.0);

      // 4. POUR (3.0 to 4.0)
      brewTl.fromTo('.st-pour-vessel', { rotation: 0 }, { rotation: 8, duration: 0.8, ease: 'none', immediateRender: false }, 3.1);
      brewTl.fromTo('.st-pour-path', { strokeDashoffset: '301' }, { strokeDashoffset: '0', duration: 0.8, ease: 'none', immediateRender: false }, 3.1);
      brewTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, 3.3);
      brewTl.to('.st-pour-ring', { scale: 1.0, duration: 0.4, ease: 'power1.inOut' }, 3.6);

      brewTl.fromTo('.st-pour-text', { opacity: 0, x: '-5vw' }, { opacity: 1, x: '0vw', duration: 0.3, ease: 'power1.out', immediateRender: false }, 3.2);

      brewTl.to('.st-brew-pour', { opacity: 0, duration: 0.1 }, 4.0);

      // 5. EXTRACTION (4.0 to 5.0)
      brewTl.fromTo('.st-extract-temp', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.15);
      brewTl.to('.st-extract-temp', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.30);

      brewTl.fromTo('.st-extract-ratio', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.45);
      brewTl.to('.st-extract-ratio', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.60);

      brewTl.fromTo('.st-extract-time', { opacity: 0, y: '5vh' }, { opacity: 1, y: '0vh', duration: 0.15, ease: 'power2.out', immediateRender: false }, 4.75);
      brewTl.to('.st-extract-time', { opacity: 0, y: '-5vh', duration: 0.15, ease: 'power2.in' }, 4.90);
      
      brewTl.fromTo('.st-extract-img', { scale: 1.0 }, { scale: 1.05, duration: 1.0, ease: 'none', immediateRender: false }, 4.0);

      brewTl.to('.st-brew-extract', { opacity: 0, duration: 0.1 }, 5.0);

      // 6. CUP (5.0 to 6.0)
      brewTl.fromTo('.st-cup-main', { scale: 0.84, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 1.0, ease: 'power1.out', immediateRender: false }, 5.0);
      brewTl.fromTo('.st-cup-steam-final', { opacity: 0 }, { opacity: 0.55, duration: 0.5, ease: 'none', immediateRender: false }, 5.5);

      // 7. CUP -> SHOP (6.0 to 7.0)
      brewTl.to('.st-cup-main', { scale: 0.9, duration: 0.75, ease: 'power1.inOut' }, 6.25);
      brewTl.to('.st-brew-cup', { opacity: 0, duration: 0.25, ease: 'none' }, 6.75);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${isJourney ? '-mt-[140vh]' : ''}`} 
      data-world="brew"
      style={{ zIndex: 10 }}
    >
      <div className="st-brew-pin w-full h-screen relative overflow-hidden bg-[#F2F0EB]">
        
        {/* 6. CUP (Base layer) - Massive, Asymmetric */}
        <div className="st-brew-cup absolute inset-0 bg-[#F2F0EB] flex items-center justify-center z-10 overflow-hidden">
          {/* Huge cup taking 50-60% of viewport, slightly off-center */}
          <div className="st-cup-main w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] max-w-[800px] absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] md:right-[-5%] z-10">
            <img
              src={BREW_IMAGES.cup.url}
              alt={BREW_IMAGES.cup.alt}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="w-full h-full object-cover rounded-full mix-blend-multiply opacity-90"
              style={{ objectPosition: BREW_IMAGES.cup.position }}
            />
            <div className="st-cup-steam-final absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/40 blur-[40px] rounded-full pointer-events-none opacity-0" />
          </div>
          {/* Overlapping Typography */}
          <div className="absolute top-[20%] left-[6%] md:left-[10%] z-20 pointer-events-none mix-blend-difference text-white">
            <h2 className="text-[18vw] md:text-[14vw] font-display uppercase tracking-tighter leading-[0.8] opacity-95">RITUAL</h2>
          </div>
        </div>

        {/* 5. EXTRACTION - Large imagery & Typography */}
        <div className="st-brew-extract absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-[#1A100C] z-20 overflow-hidden">
          <img
            src={BREW_IMAGES.extract.url}
            alt={BREW_IMAGES.extract.alt}
            loading="lazy"
            decoding="async"
            className="absolute top-[10%] md:top-0 left-0 w-[90vw] md:w-[60vw] h-[60vh] md:h-full object-cover opacity-50 mix-blend-screen st-extract-img"
            style={{ objectPosition: BREW_IMAGES.extract.position }}
          />
          <div className="absolute bottom-[15%] md:bottom-auto md:top-[15%] right-[10%] text-right z-30 mix-blend-difference text-white">
            <div className="st-extract-temp text-[16vw] md:text-[12vw] font-display opacity-0 tracking-tighter leading-[0.85]">92°C</div>
            <div className="st-extract-ratio text-[16vw] md:text-[12vw] font-display opacity-0 tracking-tighter leading-[0.85] mt-4 md:mt-8">1:16</div>
            <div className="st-extract-time text-[16vw] md:text-[12vw] font-display opacity-0 tracking-tighter leading-[0.85] mt-4 md:mt-8 text-white/70">03:42</div>
          </div>
        </div>

        {/* 4. POUR - Asymmetric focus */}
        <div className="st-brew-pour absolute inset-0 flex items-center justify-center bg-[#F2F0EB] z-30 overflow-hidden">
          <div className="absolute top-[15%] left-[6%] md:left-[10%] z-10 pointer-events-none mix-blend-difference text-white">
            <div className="text-[22vw] md:text-[16vw] font-display uppercase tracking-tighter leading-[0.85] opacity-95">POUR</div>
          </div>
          
          <div className="st-pour-vessel absolute right-[-20%] md:right-[5%] bottom-[-10%] md:bottom-auto md:top-[20%] w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] rounded-full border-[1px] border-[#3B2516]/10 relative flex items-center justify-center z-20 bg-transparent mix-blend-multiply">
             <img
               src={BREW_IMAGES.pourVessel.url}
               alt={BREW_IMAGES.pourVessel.alt}
               loading="lazy"
               decoding="async"
               className="w-full h-full object-cover rounded-full opacity-80"
               style={{ objectPosition: BREW_IMAGES.pourVessel.position }}
             />
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="49" fill="none" stroke="#3B2516" strokeWidth="0.5" strokeDasharray="301" className="st-pour-path opacity-50" />
            </svg>
            <div className="st-pour-ring absolute w-[85%] h-[85%] rounded-full border border-white/30 opacity-0 pointer-events-none" />
          </div>
        </div>

        {/* 3. BLOOM — unique image: pour-over bloom moment */}
        <div className="st-brew-bloom absolute inset-0 flex items-center justify-center bg-[#1A100C] z-40 overflow-hidden">
          <img
            src={BREW_IMAGES.bloom.url}
            alt={BREW_IMAGES.bloom.alt}
            loading="lazy"
            decoding="async"
            className="st-bloom-grounds absolute top-0 right-0 w-[120vw] md:w-[70vw] h-[70vh] md:h-screen object-cover opacity-70"
            style={{ objectPosition: BREW_IMAGES.bloom.position }}
          />
          <div className="st-bloom-center absolute right-[10%] md:right-[20%] w-[80vw] h-[80vw] md:w-[45vw] md:h-[45vw] bg-[#3B2516]/80 rounded-full blur-[80px] opacity-0 mix-blend-screen" />
          <div className="st-bloom-steam absolute top-1/4 right-[5%] w-[80vw] md:w-[50vw] h-[60vh] bg-white/10 blur-[80px] opacity-0" />
          <div className="st-bloom-text absolute bottom-[15%] md:bottom-[20%] left-[6%] md:left-[10%] z-20 text-[20vw] md:text-[16vw] font-display text-white mix-blend-difference tracking-tighter uppercase pointer-events-none leading-[0.8] opacity-95">BLOOM</div>
        </div>

        {/* 2. WATER — unique image: kettle/water introduction */}
        <div className="st-brew-water absolute inset-0 flex items-center justify-center bg-[#F2F0EB] z-50 overflow-hidden">
          <img
            src={BREW_IMAGES.water.url}
            alt={BREW_IMAGES.water.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-[150vw] md:w-full h-full object-cover mix-blend-multiply opacity-30"
            style={{ objectPosition: BREW_IMAGES.water.position }}
          />
          <div className="st-water-stream absolute top-[-10%] right-[30%] md:right-[40%] w-[20vw] md:w-[8vw] h-[80vh] bg-white/40 blur-[8px] z-20 mix-blend-screen" />
          <div className="st-water-surface absolute bottom-0 w-full h-[20vh] bg-gradient-to-t from-white/30 to-transparent opacity-0 z-10 mix-blend-screen" />
          <div className="st-water-steam absolute top-[30%] right-[10%] w-[90vw] md:w-[50vw] h-[50vh] bg-white/30 blur-[60px] opacity-0 z-30" />
        </div>

        {/* 1. GRIND (Top layer) — two distinct images for beans vs grounds */}
        <div className="st-brew-grind absolute inset-0 flex items-center justify-center bg-transparent z-[60] overflow-hidden">
          <div className="st-brew-bg-fill absolute inset-0 bg-[#1A100C]" />
          <img
            src={BREW_IMAGES.grindBeans.url}
            alt={BREW_IMAGES.grindBeans.alt}
            loading="lazy"
            decoding="async"
            className="st-grind-beans absolute bottom-0 left-[-10%] md:left-[-5%] w-[120vw] md:w-[65vw] h-[70vh] md:h-[80vh] object-cover mix-blend-screen opacity-80"
            style={{ objectPosition: BREW_IMAGES.grindBeans.position }}
          />
          <img
            src={BREW_IMAGES.grindGrounds.url}
            alt={BREW_IMAGES.grindGrounds.alt}
            loading="lazy"
            decoding="async"
            className="st-grind-grounds absolute bottom-0 left-[-10%] md:left-[-5%] w-[120vw] md:w-[65vw] h-[70vh] md:h-[80vh] object-cover opacity-0 mix-blend-screen"
            style={{ objectPosition: BREW_IMAGES.grindGrounds.position }}
          />
        </div>
      </div>

      {/* 7. CUP -> PRODUCT TRANSITION SPACE (Handled by Shop.tsx overlap) */}
      <div className="w-full h-[50vh] relative bg-transparent" />
    </div>
  );
}
