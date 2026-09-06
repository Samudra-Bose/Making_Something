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
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger && t.vars.trigger.toString().includes('st-brew')).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      // 8. ONE FULL-SCREEN MASK TRANSITION (ROAST -> BREW)
      const grindTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-grind-water',
          scroller: scroller,
          start: 'top top',
          end: '+=245%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
             if (isActive) {
               useExperienceStore.getState().setActiveWorld('brew');
               useExperienceStore.getState().setBrewProgress(self.progress * 0.4); 
             }
          }
        }
      });
      
      // 0.00-0.15 hold, 0.15-0.85 transform, 0.85-1.00 release
      
      // 0.15-0.30: bean centered, scale +15%
      grindTl.fromTo('.st-grind-beans', { scale: 1.0 }, { scale: 1.15, duration: 0.15, ease: 'none' }, 0.15);
      
      // 0.30-0.45: circular mask expands
      grindTl.to('.st-grind-beans-container', { clipPath: 'circle(100% at 50% 50%)', duration: 0.15, ease: 'power2.in' }, 0.30);
      
      // 0.45-0.60: macro coffee texture fills mask
      grindTl.to('.st-grind-beans', { scale: 3.0, opacity: 0, duration: 0.15, ease: 'none' }, 0.45);
      
      // 0.60-0.75: grounds texture appears inside
      grindTl.fromTo('.st-grind-grounds', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.0, duration: 0.15, ease: 'power1.out' }, 0.60);
      
      // 0.75-0.85: grounds settle (water moves down)
      grindTl.to('.st-grind-grounds', { y: '5vh', duration: 0.10, ease: 'power1.inOut' }, 0.75);

      // Water stream believable acceleration
      grindTl.fromTo('.st-water-stream', { y: '-100vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.2, ease: 'power2.in' }, 0.65);
      grindTl.to('.st-water-surface', { scale: 10, opacity: 0.8, duration: 0.1, ease: 'power2.out' }, 0.85);
      grindTl.to('.st-water-level', { y: '-30vh', duration: 0.1 }, 0.85);
      grindTl.to('.st-water-steam', { opacity: 0.5, duration: 0.1 }, 0.85);

      // Background cross-world text
      grindTl.fromTo('.st-bg-word-brew', { y: '30vh', opacity: 0 }, { y: '0vh', opacity: 0.1, duration: 0.5 }, 0.15);


      // 11. BLOOM & 15. ADD PHYSICAL RESPONSE
      const bloomTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-bloom',
          scroller: scroller,
          start: 'top top',
          end: '+=160%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.4 + self.progress * 0.2);
          }
        }
      });
      // Camera Push
      bloomTl.fromTo('.st-bloom-grounds', { scale: 1.0 }, { scale: 1.12, duration: 1, ease: 'none' }, 0);
      bloomTl.to('.st-bloom-grounds', { y: '-4vh', duration: 1, ease: 'none' }, 0);
      bloomTl.to('.st-bloom-text', { y: '-8vh', duration: 1, ease: 'none' }, 0);

      bloomTl.to('.st-bloom-grounds', { filter: 'brightness(0.3)', duration: 0.15 }, 0.20);
      bloomTl.fromTo('.st-bloom-center', { scale: 1.0 }, { scale: 1.35, duration: 0.15, ease: 'power2.out' }, 0.45);
      bloomTl.to('.st-bloom-steam', { opacity: 0.55, duration: 0.15 }, 0.75);
      bloomTl.to('.st-bloom-center', { scale: 2.0, opacity: 0, duration: 0.15 }, 0.90);
      bloomTl.fromTo('.st-bloom-text', { scale: 0.90 }, { scale: 1.10, duration: 1 }, 0);


      // 12. POUR & 16. FEEL WEIGHTED
      const pourTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-pour',
          scroller: scroller,
          start: 'top top',
          end: '+=180%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.6 + self.progress * 0.2);
          }
        }
      });
      pourTl.to('.st-pour-vessel', { rotate: 8, duration: 1 }, 0);
      pourTl.fromTo('.st-pour-path', { strokeDashoffset: '100%' }, { strokeDashoffset: '0%', duration: 1, ease: 'power1.inOut' }, 0);
      pourTl.fromTo('.st-pour-ring', { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 0.8, duration: 0.5, ease: 'power2.out' }, 0.5);
      pourTl.to('.st-pour-ring', { opacity: 0, duration: 0.5 }, 1.0);
      pourTl.fromTo('.st-pour-text', { x: '-5vw' }, { x: '3vw', duration: 1 }, 0);


      // 13. CUP & 17. CREATE STILLNESS
      const cupTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-cup',
          scroller: scroller,
          start: 'top 50%',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
             if (isActive) useExperienceStore.getState().setBrewProgress(0.8 + self.progress * 0.2);
          }
        }
      });
      cupTl.fromTo('.st-cup-main', { scale: 0.82, y: '8vh' }, { scale: 1.0, y: '0vh', duration: 1, ease: 'power2.out' }, 0);
      cupTl.fromTo('.st-cup-steam-final', { opacity: 0, y: '10px' }, { opacity: 0.3, y: '-15px', duration: 1, ease: 'none' }, 0); // Very subtle steam

      // 14. BREW -> SHOP (50vh transition space at bottom)
      const transTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-shop-trans',
          scroller: scroller,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1
        }
      });
      // 0.00: cup centered
      // 0.20: cup scale +8%
      transTl.to('.st-cup-main', { scale: 1.08, duration: 0.20 }, 0.00);
      // 0.35: camera pulls backward, 0.70: cup moves toward background
      transTl.to('.st-cup-main', { scale: 0.4, y: '-10vh', opacity: 0, duration: 0.35 }, 0.35);
      // 0.45: package enters from below, 0.60: package reaches center
      transTl.fromTo('.st-shop-package', { y: '60vh', opacity: 0, rotate: -5 }, { y: '0vh', opacity: 1, rotate: -2, duration: 0.15 }, 0.45);
      // 0.78: package becomes dominant
      transTl.to('.st-shop-package', { scale: 1.05, duration: 0.18 }, 0.60);
      // 0.85: package label becomes readable
      transTl.fromTo('.st-shop-package .text-center', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.70);
      // 0.95: Shop typography enters
      transTl.fromTo('.st-shop-ui', { opacity: 0, y: '20px' }, { opacity: 1, y: '0px', duration: 0.05 }, 0.95);
    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="brew"
    >
      {/* GRIND & WATER */}
      <div className="st-brew-grind-water w-full h-screen relative bg-[#F2F0EB] overflow-hidden depth-bg">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] opacity-0 st-bg-word-brew pointer-events-none text-[30vw] font-display tracking-tighter text-[#333]">
          BREW
        </div>

        <div className="st-grind-camera w-full h-full relative flex items-center justify-center">
           <div className="st-grind-beans-container absolute inset-0 flex items-center justify-center" style={{ clipPath: 'circle(15% at 50% 50%)' }}>
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="st-grind-beans absolute inset-0 w-full h-full object-cover mix-blend-multiply brightness-50" />
              <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-grind-grounds absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-multiply" />
           </div>
           
           <div className="st-water-stream absolute top-0 w-8 h-[60vh] bg-blue-100/30 blur-sm z-20" />
           <div className="st-water-surface absolute bottom-0 w-full h-1 bg-blue-900/10 opacity-0 z-10" />
           <div className="st-water-level absolute inset-x-0 bottom-[-30vh] h-[30vh] bg-[#3B2516]/40 z-10" />
           <div className="st-water-steam absolute top-[40%] w-[50vw] h-[30vh] bg-white/40 blur-[50px] opacity-0 z-30" />
        </div>
      </div>

      {/* BLOOM */}
      <div className="st-brew-bloom w-full h-screen relative bg-[#1A100C] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="st-bloom-grounds absolute inset-0 w-full h-full object-cover opacity-50 depth-main" />
        <div className="st-bloom-center absolute w-[30vw] h-[30vw] bg-[#3B2516] rounded-full blur-xl opacity-80" />
        <div className="st-bloom-steam absolute top-1/3 w-[60vw] h-[40vh] bg-white/10 blur-[60px] opacity-0" />
        <div className="st-bloom-text absolute z-20 text-[18vw] font-display text-white mix-blend-overlay tracking-tighter uppercase depth-type">BLOOM</div>
      </div>

      {/* POUR */}
      <div className="st-brew-pour w-full h-screen relative bg-[#F2F0EB] flex items-center justify-center overflow-hidden">
         <div className="st-pour-text absolute top-1/3 left-10 text-[12vw] font-display uppercase tracking-tighter text-[#3B2516]/20 depth-type">POUR</div>
         <div className="st-pour-vessel w-[40vw] h-[40vw] rounded-full border border-[#3B2516]/30 relative flex items-center justify-center depth-main">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="48" fill="none" stroke="#3B2516" strokeWidth="2" strokeDasharray="301" className="st-pour-path" />
            </svg>
            <div className="st-pour-ring absolute w-[90%] h-[90%] rounded-full border border-[#3B2516]/50 opacity-0" />
         </div>
      </div>

      {/* CUP */}
      <div className="st-brew-cup w-full h-screen relative bg-[#D9D3C5] flex flex-col items-center justify-center overflow-hidden z-20">
         <div className="st-cup-mask-wrapper absolute inset-0 flex items-center justify-center">
           <div className="st-cup-main w-[50vw] max-w-sm aspect-square relative depth-main">
              <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl mix-blend-multiply" />
              <div className="st-cup-steam-final absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/40 blur-[40px] rounded-full pointer-events-none opacity-0" />
           </div>
         </div>
      </div>

      {/* TRANSITION TO SHOP */}
      <div className="st-brew-shop-trans w-full h-[50vh] relative bg-transparent overflow-hidden flex items-center justify-center z-10">
         {/* Blank space to overlap with Shop.tsx -mt-[50vh] */}
      </div>
    </div>
  );
}
