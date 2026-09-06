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

      // 0.00-0.20 hold, 0.20-0.75 transform, 0.75-1.00 release
      const trStart = 0.20;
      const trDur = 0.55; 
      
      // Horizontal track moving exactly -70%
      roastTl.to('.st-roast-track', { x: '-70%', duration: trDur, ease: 'none' }, trStart);
      
      // Stage scales
      roastTl.fromTo('.st-roast-green', { scale: 1.0 }, { scale: 1.03, duration: 0.1 }, trStart);
      roastTl.fromTo('.st-roast-yellow', { scale: 1.0 }, { scale: 1.06, duration: 0.1 }, trStart + 0.1);
      roastTl.fromTo('.st-roast-gold', { scale: 1.0 }, { scale: 1.08, duration: 0.1 }, trStart + 0.2);
      roastTl.fromTo('.st-roast-caramel', { scale: 1.0 }, { scale: 1.05, duration: 0.1 }, trStart + 0.3);
      roastTl.fromTo('.st-roast-brown', { scale: 1.0 }, { scale: 1.02, duration: 0.1 }, trStart + 0.4);

      // Camera Push
      roastTl.fromTo('.st-roast-bean', { scale: 1.00 }, { scale: 1.16, duration: trDur, ease: 'none' }, trStart);
      roastTl.to('.st-roast-bg', { y: '-3vh', duration: trDur, ease: 'none' }, trStart);
      
      // 14. ROAST FIRST CRACK - SPATIAL IMPACT
      const crackStart = 0.60;
      // Before crack (tension build)
      roastTl.to('.st-roast-bean', { x: '12px', duration: 0.05 }, crackStart - 0.05);
      roastTl.fromTo('.st-first-crack-text', { scale: 1.0, letterSpacing: '0em' }, { scale: 1.10, letterSpacing: '-0.05em', duration: 0.05 }, crackStart - 0.05);

      // At crack (0.60)
      roastTl.to('.st-roast-bean', { x: '14px', rotate: '3deg', duration: 0.01 }, crackStart)
             .to('.st-roast-bean', { x: '0px', rotate: '0deg', duration: 0.04 }, crackStart + 0.01);
      
      roastTl.to('.st-first-crack-text', { scale: 1.17, duration: 0.01 }, crackStart)
             .to('.st-first-crack-text', { scale: 1.10, duration: 0.04 }, crackStart + 0.01);
             
      roastTl.fromTo('.st-crack-radial', { scale: 0.4, opacity: 0 }, { scale: 2.0, opacity: 0.8, duration: 0.01 }, crackStart)
             .to('.st-crack-radial', { scale: 1.0, opacity: 0, duration: 0.04 }, crackStart + 0.01);

      // Release
      roastTl.to('.st-first-crack-text', { scale: 1.0, letterSpacing: '0em', duration: 0.1 }, crackStart + 0.05);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="roast"
      style={{ zIndex: 5 }}
    >
      <div className="st-roast-pin w-full h-screen relative bg-[#2D1B11] overflow-hidden st-roast-bg depth-bg">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] opacity-10 st-bg-word pointer-events-none text-[30vw] font-display tracking-tighter text-white">
          ROAST
        </div>

        <div className="st-roast-track absolute top-0 left-0 h-full w-[350vw] flex items-center depth-sec">
          <div className="w-[100vw] h-full flex flex-col justify-center items-center text-[#8B9D83] font-display text-[15vw] uppercase leading-none tracking-tighter st-roast-green">
            GREEN
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#C5A880] font-display text-[15vw] uppercase leading-none tracking-tighter st-roast-yellow">
            YELLOW
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#D4AF37] font-display text-[18vw] uppercase leading-none tracking-tighter st-roast-gold">
            GOLD
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#995c2b] font-display text-[18vw] uppercase leading-none tracking-tighter st-roast-caramel">
            CARAMEL
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#5c3a21] font-display text-[20vw] uppercase leading-none tracking-tighter st-roast-brown">
            BROWN
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#1A100C] font-display text-[22vw] uppercase leading-none tracking-tighter st-roast-dark mix-blend-color-dodge">
            DARK
          </div>

          <div className="absolute top-1/2 left-[180vw] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none mix-blend-difference text-white depth-type">
            <div className="text-[10vw] font-display uppercase tracking-tighter leading-none flex st-first-crack-text">
              <div className="st-first-crack-text-1">FIRST</div>
              <div className="st-first-crack-text-2">CRACK</div>
            </div>
          </div>
        </div>

        {/* The single cross-world bean */}
        <div className="absolute left-[30vw] top-1/2 -translate-y-1/2 w-[35vw] h-[35vw] st-roast-bean mix-blend-luminosity depth-main pointer-events-none drop-shadow-2xl">
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl brightness-75" />
        </div>
        
        <div className="absolute top-1/2 left-[30vw] -translate-y-1/2 w-[45vw] h-[45vw] rounded-full bg-white/20 blur-2xl opacity-0 st-crack-radial pointer-events-none" />
      </div>
    </div>
  );
}
