import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    const scroller = isJourney ? window : containerRef.current;
    
    // Cleanup old triggers
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger && t.vars.trigger.toString().includes('st-brew')).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      // 1. GRIND (0 - 1)
      const grindTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-grind',
          scroller: scroller,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
             if (isActive) {
               useExperienceStore.getState().setActiveWorld('brew');
               useExperienceStore.getState().setBrewProgress(self.progress * 0.15); 
             }
          }
        }
      });
      // 0.00: beans scale 0.92
      // 0.20: beans rotate 8deg
      // 0.35: camera zooms closer
      // 0.50: whole-bean opacity begins falling
      // 0.60: grounds appear
      // 0.78: grounds become dominant
      // 0.90: grounds settle
      // 1.00: stable grounds
      grindTl.fromTo('.st-grind-beans', { scale: 0.92, rotation: 0 }, { rotation: 8, duration: 0.2, ease: 'none' }, 0);
      grindTl.to('.st-grind-beans', { scale: 1.3, duration: 0.3, ease: 'power1.inOut' }, 0.20);
      grindTl.to('.st-grind-beans', { opacity: 0, duration: 0.28, ease: 'none' }, 0.50);
      grindTl.fromTo('.st-grind-grounds', { opacity: 0, scale: 1.1 }, { opacity: 1, duration: 0.18, ease: 'none' }, 0.60);
      grindTl.to('.st-grind-grounds', { scale: 1.0, duration: 0.22, ease: 'power1.out' }, 0.78);
      
      // 2. WATER (0 - 1)
      const waterTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-water',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.15 + self.progress * 0.15);
          }
        }
      });
      // 0.00: water invisible
      // 0.15: top of stream enters frame
      // 0.35: stream reaches grounds
      // 0.50: surface begins reacting
      // 0.70: water reaches final position
      // 0.85: steam appears
      // 1.00: stable
      waterTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '-50vh', opacity: 1, duration: 0.15, ease: 'none' }, 0.0);
      waterTl.to('.st-water-stream', { y: '0vh', duration: 0.2, ease: 'none' }, 0.15);
      waterTl.fromTo('.st-water-surface', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 0.2, ease: 'power1.out' }, 0.35);
      waterTl.to('.st-water-stream', { y: '10vh', opacity: 0, duration: 0.2, ease: 'power1.in' }, 0.50);
      waterTl.fromTo('.st-water-steam', { opacity: 0 }, { opacity: 0.4, duration: 0.15, ease: 'none' }, 0.85);
      
      // 3. BLOOM (0 - 1)
      const bloomTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-bloom',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.30 + self.progress * 0.15);
          }
        }
      });
      // 0.00: compact grounds
      // 0.20: water contact
      // 0.35: grounds darken
      // 0.45: bloom begins
      // 0.60: bloom scale 1.00 -> 1.35
      // 0.72: max surface expansion
      // 0.80: steam appears
      // 0.90: typography BLOOM reaches max scale
      // 1.00: settles
      bloomTl.to('.st-bloom-grounds', { filter: 'brightness(0.5)', duration: 0.15, ease: 'none' }, 0.20);
      bloomTl.fromTo('.st-bloom-center', { scale: 0.8, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.1, ease: 'power1.out' }, 0.35);
      bloomTl.to('.st-bloom-center', { scale: 1.35, duration: 0.15, ease: 'power1.inOut' }, 0.45);
      bloomTl.to('.st-bloom-center', { scale: 1.5, opacity: 0.9, duration: 0.12, ease: 'power1.out' }, 0.60);
      bloomTl.fromTo('.st-bloom-steam', { opacity: 0 }, { opacity: 0.5, duration: 0.1, ease: 'none' }, 0.80);
      bloomTl.fromTo('.st-bloom-text', { scale: 0.8, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.70);
      bloomTl.to('.st-bloom-text', { scale: 1.1, duration: 0.1, ease: 'power1.inOut' }, 0.90);
      bloomTl.to('.st-bloom-center', { scale: 1.4, duration: 0.1, ease: 'power1.inOut' }, 0.90);

      // 4. POUR (0 - 1)
      const pourTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-pour',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.45 + self.progress * 0.15);
          }
        }
      });
      // Vessel: 0deg -> 8deg, Water path: 100% hidden -> fully revealed, Surface ring: 0.2 -> 1.15 -> 1.0
      pourTl.fromTo('.st-pour-vessel', { rotation: 0 }, { rotation: 8, duration: 1, ease: 'none' }, 0);
      pourTl.fromTo('.st-pour-path', { strokeDashoffset: '301' }, { strokeDashoffset: '0', duration: 1, ease: 'none' }, 0);
      pourTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.2);
      pourTl.to('.st-pour-ring', { scale: 1.0, duration: 0.5, ease: 'power1.inOut' }, 0.5);

      // 5. EXTRACTION (0 - 1)
      const extractTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-extract',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.60 + self.progress * 0.20);
          }
        }
      });
      // Temp first, Ratio second, Time third.
      extractTl.fromTo('.st-extract-temp', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.0);
      extractTl.to('.st-extract-temp', { y: '-20vh', opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.25);

      extractTl.fromTo('.st-extract-ratio', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.33);
      extractTl.to('.st-extract-ratio', { y: '-20vh', opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.58);

      extractTl.fromTo('.st-extract-time', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.66);
      extractTl.to('.st-extract-time', { y: '-10vh', opacity: 0, duration: 0.15, ease: 'power2.in' }, 0.85);

      // 6. CUP (0 - 1)
      const cupTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-cup',
          scroller: scroller,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.80 + self.progress * 0.20);
          }
        }
      });
      // Cup: scale 0.84 -> 1.00, y: 8vh -> 0. Steam opacity: 0 -> 0.55, y: 10px -> -25px.
      cupTl.fromTo('.st-cup-main', { scale: 0.84, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 1, ease: 'none' }, 0);
      cupTl.fromTo('.st-cup-steam-final', { opacity: 0, y: '10px' }, { opacity: 0.55, y: '-25px', duration: 1, ease: 'none' }, 0);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="brew"
      style={{ zIndex: 10, backgroundColor: '#F2F0EB' }}
    >
      {/* 1. GRIND */}
      <div className="st-brew-grind w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#F2F0EB]">
        <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="st-grind-beans absolute inset-0 w-full h-full object-cover mix-blend-multiply brightness-50" />
        <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-grind-grounds absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-multiply" />
      </div>

      {/* 2. WATER */}
      <div className="st-brew-water w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#F2F0EB]">
        <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
        <div className="st-water-stream absolute top-0 w-12 h-[60vh] bg-blue-100/40 blur-[4px] z-20" />
        <div className="st-water-surface absolute bottom-0 w-full h-1 bg-blue-900/10 opacity-0 z-10" />
        <div className="st-water-steam absolute top-[40%] w-[60vw] h-[40vh] bg-white/50 blur-[60px] opacity-0 z-30" />
      </div>

      {/* 3. BLOOM */}
      <div className="st-brew-bloom w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#1A100C]">
        <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-bloom-grounds absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="st-bloom-center absolute w-[40vw] h-[40vw] bg-[#3B2516] rounded-full blur-2xl opacity-0" />
        <div className="st-bloom-steam absolute top-1/3 w-[70vw] h-[50vh] bg-white/10 blur-[60px] opacity-0" />
        <div className="st-bloom-text absolute z-20 text-[18vw] font-display text-white mix-blend-overlay tracking-tighter uppercase pointer-events-none">BLOOM</div>
      </div>

      {/* 4. POUR */}
      <div className="st-brew-pour w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#F2F0EB]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display uppercase tracking-tighter text-[#3B2516] opacity-20 pointer-events-none mix-blend-multiply">POUR</div>
        <div className="absolute top-0 w-12 h-full bg-blue-200/40 blur-[2px] z-10" />
        
        <div className="st-pour-vessel w-[40vw] h-[40vw] rounded-full border-2 border-[#3B2516]/30 relative flex items-center justify-center z-20 bg-[#F2F0EB]">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="48" fill="none" stroke="#3B2516" strokeWidth="2" strokeDasharray="301" className="st-pour-path" />
          </svg>
          <div className="st-pour-ring absolute w-[90%] h-[90%] rounded-full border border-[#3B2516]/50 opacity-0" />
        </div>
      </div>

      {/* 5. EXTRACTION */}
      <div className="st-brew-extract w-full h-screen relative flex items-center justify-center overflow-hidden bg-[#1A100C]">
        <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="st-extract-temp absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">92°C</div>
        <div className="st-extract-ratio absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">1:16</div>
        <div className="st-extract-time absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">03:42</div>
      </div>

      {/* 6. CUP */}
      <div className="st-brew-cup w-full h-screen relative bg-[#D9D3C5] flex items-center justify-center overflow-hidden z-20">
        <div className="st-cup-main w-[50vw] max-w-sm aspect-square relative z-10">
          <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
          <div className="st-cup-steam-final absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/50 blur-[30px] rounded-full pointer-events-none opacity-0" />
        </div>
      </div>

      {/* 7. CUP -> PRODUCT TRANSITION SPACE (Handled by Shop.tsx overlap) */}
      <div className="w-full h-[50vh] relative bg-[#D9D3C5]" />
    </div>
  );
}
