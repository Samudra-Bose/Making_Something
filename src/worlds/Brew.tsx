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
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-brew-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      const brewTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=900%', // 900vh total
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
             if (isActive) {
               useExperienceStore.getState().setActiveWorld('brew');
               useExperienceStore.getState().setBrewProgress(self.progress); 
             }
          }
        }
      });
      
      // We have 9 units total.
      // 0 - 2.0 (Grind)
      // 2.0 - 3.5 (Water)
      // 3.5 - 5.0 (Bloom)
      // 5.0 - 6.5 (Pour)
      // 6.5 - 8.0 (Extract)
      // 8.0 - 9.0 (Cup)

      // 1. GRIND (0 to 2/9 = 0.222)
      // Fade in background to overlap Roast's handoff
      brewTl.fromTo('.st-brew-bg-fill', { opacity: 0 }, { opacity: 1, duration: 0.044, ease: 'none' }, 0);
      brewTl.fromTo('.st-grind-beans', { scale: 0.92, rotation: 0 }, { rotation: 8, duration: 0.044, ease: 'none' }, 0);
      brewTl.to('.st-grind-beans', { scale: 1.3, duration: 0.067, ease: 'power1.inOut' }, 0.044);
      brewTl.to('.st-grind-beans', { opacity: 0, duration: 0.062, ease: 'none' }, 0.111);
      brewTl.fromTo('.st-grind-grounds', { opacity: 0, scale: 1.1 }, { opacity: 1, duration: 0.04, ease: 'none' }, 0.133);
      brewTl.to('.st-grind-grounds', { scale: 1.0, duration: 0.049, ease: 'power1.out' }, 0.173);

      // Transition Grind -> Water
      brewTl.to('.st-brew-grind', { opacity: 0, duration: 0.02 }, 0.222);

      // 2. WATER (2.0 to 3.5 = 0.222 to 0.389)
      brewTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '-50vh', opacity: 1, duration: 0.025, ease: 'none' }, 0.222);
      brewTl.to('.st-water-stream', { y: '0vh', duration: 0.033, ease: 'none' }, 0.247);
      brewTl.fromTo('.st-water-surface', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2, duration: 0.033, ease: 'power1.out' }, 0.280);
      brewTl.to('.st-water-stream', { y: '10vh', opacity: 0, duration: 0.033, ease: 'power1.in' }, 0.305);
      brewTl.fromTo('.st-water-steam', { opacity: 0 }, { opacity: 0.4, duration: 0.025, ease: 'none' }, 0.364);
      
      // Transition Water -> Bloom
      brewTl.to('.st-brew-water', { opacity: 0, duration: 0.02 }, 0.389);

      // 3. BLOOM (3.5 to 5.0 = 0.389 to 0.556)
      brewTl.to('.st-bloom-grounds', { filter: 'brightness(0.5)', duration: 0.025, ease: 'none' }, 0.422);
      brewTl.fromTo('.st-bloom-center', { scale: 0.8, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 0.017, ease: 'power1.out' }, 0.447);
      brewTl.to('.st-bloom-center', { scale: 1.35, duration: 0.025, ease: 'power1.inOut' }, 0.464);
      brewTl.to('.st-bloom-center', { scale: 1.5, opacity: 0.9, duration: 0.02, ease: 'power1.out' }, 0.489);
      brewTl.fromTo('.st-bloom-steam', { opacity: 0 }, { opacity: 0.5, duration: 0.017, ease: 'none' }, 0.522);
      brewTl.fromTo('.st-bloom-text', { scale: 0.8, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.033, ease: 'power1.out' }, 0.506);
      brewTl.to('.st-bloom-text', { scale: 1.1, duration: 0.017, ease: 'power1.inOut' }, 0.539);
      brewTl.to('.st-bloom-center', { scale: 1.4, duration: 0.017, ease: 'power1.inOut' }, 0.539);

      // Transition Bloom -> Pour
      brewTl.to('.st-brew-bloom', { opacity: 0, duration: 0.02 }, 0.556);

      // 4. POUR (5.0 to 6.5 = 0.556 to 0.722)
      brewTl.fromTo('.st-pour-vessel', { rotation: 0 }, { rotation: 8, duration: 0.167, ease: 'none' }, 0.556);
      brewTl.fromTo('.st-pour-path', { strokeDashoffset: '301' }, { strokeDashoffset: '0', duration: 0.167, ease: 'none' }, 0.556);
      brewTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.589);
      brewTl.to('.st-pour-ring', { scale: 1.0, duration: 0.083, ease: 'power1.inOut' }, 0.639);

      // Transition Pour -> Extraction
      brewTl.to('.st-brew-pour', { opacity: 0, duration: 0.02 }, 0.722);

      // 5. EXTRACTION (6.5 to 8.0 = 0.722 to 0.889)
      brewTl.fromTo('.st-extract-temp', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.025, ease: 'power2.out' }, 0.722);
      brewTl.to('.st-extract-temp', { y: '-20vh', opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.764);

      brewTl.fromTo('.st-extract-ratio', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.025, ease: 'power2.out' }, 0.777);
      brewTl.to('.st-extract-ratio', { y: '-20vh', opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.819);

      brewTl.fromTo('.st-extract-time', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.025, ease: 'power2.out' }, 0.832);
      brewTl.to('.st-extract-time', { y: '-10vh', opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.864);

      // Transition Extraction -> Cup
      brewTl.to('.st-brew-extract', { opacity: 0, duration: 0.02 }, 0.889);

      // 6. CUP (8.0 to 9.0 = 0.889 to 1.000)
      brewTl.fromTo('.st-cup-main', { scale: 0.84, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 0.111, ease: 'none' }, 0.889);
      brewTl.fromTo('.st-cup-steam-final', { opacity: 0, y: '10px' }, { opacity: 0.55, y: '-25px', duration: 0.111, ease: 'none' }, 0.889);
    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[140vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="brew"
      style={{ zIndex: 10 }}
    >
      <div className="st-brew-pin w-full h-screen relative overflow-hidden bg-[#F2F0EB]">
        
        {/* 6. CUP (Base layer) */}
        <div className="st-brew-cup absolute inset-0 bg-[#D9D3C5] flex items-center justify-center z-10">
          <div className="st-cup-main w-[50vw] max-w-sm aspect-square relative z-10">
            <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
            <div className="st-cup-steam-final absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/50 blur-[30px] rounded-full pointer-events-none opacity-0" />
          </div>
        </div>

        {/* 5. EXTRACTION */}
        <div className="st-brew-extract absolute inset-0 flex items-center justify-center bg-[#1A100C] z-20">
          <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="st-extract-temp absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">92°C</div>
          <div className="st-extract-ratio absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">1:16</div>
          <div className="st-extract-time absolute text-[20vw] font-display text-[#E6E2D6] opacity-0 tracking-tighter leading-none mix-blend-difference">03:42</div>
        </div>

        {/* 4. POUR */}
        <div className="st-brew-pour absolute inset-0 flex items-center justify-center bg-[#F2F0EB] z-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-display uppercase tracking-tighter text-[#3B2516] opacity-20 pointer-events-none mix-blend-multiply">POUR</div>
          <div className="absolute top-0 w-12 h-full bg-blue-200/40 blur-[2px] z-10" />
          
          <div className="st-pour-vessel w-[40vw] h-[40vw] rounded-full border-2 border-[#3B2516]/30 relative flex items-center justify-center z-20 bg-[#F2F0EB]">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="48" fill="none" stroke="#3B2516" strokeWidth="2" strokeDasharray="301" className="st-pour-path" />
            </svg>
            <div className="st-pour-ring absolute w-[90%] h-[90%] rounded-full border border-[#3B2516]/50 opacity-0" />
          </div>
        </div>

        {/* 3. BLOOM */}
        <div className="st-brew-bloom absolute inset-0 flex items-center justify-center bg-[#1A100C] z-40">
          <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-bloom-grounds absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="st-bloom-center absolute w-[40vw] h-[40vw] bg-[#3B2516] rounded-full blur-2xl opacity-0" />
          <div className="st-bloom-steam absolute top-1/3 w-[70vw] h-[50vh] bg-white/10 blur-[60px] opacity-0" />
          <div className="st-bloom-text absolute z-20 text-[18vw] font-display text-white mix-blend-overlay tracking-tighter uppercase pointer-events-none">BLOOM</div>
        </div>

        {/* 2. WATER */}
        <div className="st-brew-water absolute inset-0 flex items-center justify-center bg-[#F2F0EB] z-50">
          <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
          <div className="st-water-stream absolute top-0 w-12 h-[60vh] bg-blue-100/40 blur-[4px] z-20" />
          <div className="st-water-surface absolute bottom-0 w-full h-1 bg-blue-900/10 opacity-0 z-10" />
          <div className="st-water-steam absolute top-[40%] w-[60vw] h-[40vh] bg-white/50 blur-[60px] opacity-0 z-30" />
        </div>

        {/* 1. GRIND (Top layer) */}
        <div className="st-brew-grind absolute inset-0 flex items-center justify-center bg-transparent z-[60]">
          <div className="st-brew-bg-fill absolute inset-0 bg-[#1A100C]" />
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="st-grind-beans absolute inset-0 w-full h-full object-cover mix-blend-multiply brightness-50" />
          <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-grind-grounds absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-multiply" />
        </div>
      </div>

      {/* 7. CUP -> PRODUCT TRANSITION SPACE (Handled by Shop.tsx overlap) */}
      <div className="w-full h-[50vh] relative bg-transparent" />
    </div>
  );
}
