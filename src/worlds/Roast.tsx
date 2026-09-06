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
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && (t.vars.trigger === '.st-roast-pin' || t.vars.trigger === '.st-first-crack')).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      const roastTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-roast-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=300%', // 300vh horizontal scene
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

      // Horizontal track moving exactly -70%
      roastTl.to('.st-roast-track', { x: '-70%', duration: 1, ease: 'none' }, 0);
      
      // Stage scales
      roastTl.fromTo('.st-roast-green', { scale: 1.0 }, { scale: 1.03, duration: 0.2 }, 0);
      roastTl.fromTo('.st-roast-yellow', { scale: 1.0 }, { scale: 1.06, duration: 0.2 }, 0.2);
      roastTl.fromTo('.st-roast-gold', { scale: 1.0 }, { scale: 1.08, duration: 0.2 }, 0.4);
      roastTl.fromTo('.st-roast-caramel', { scale: 1.0 }, { scale: 1.05, duration: 0.2 }, 0.6);
      roastTl.fromTo('.st-roast-brown', { scale: 1.0 }, { scale: 1.02, duration: 0.2 }, 0.8);
      
      // 7. FIRST CRACK - EXACT EVENT (60-70% of Roast pinned scene)
      // tension build 55-65%
      roastTl.to('.st-roast-bean', { rotate: '+=72deg', scale: 1.15, duration: 0.1 }, 0.55);
      roastTl.to('.st-first-crack-text', { scale: 1.15, duration: 0.1 }, 0.55);
      
      // Crack point (65-70%) - very fast impulse
      roastTl.to('.st-roast-bean', { x: '1.2vw', rotate: '+=4deg', duration: 0.02 }, 0.65)
             .to('.st-roast-bean', { x: '0vw', rotate: '-=4deg', duration: 0.03 }, 0.67);
      
      roastTl.to('.st-first-crack-text-1', { x: '-1.5vw', duration: 0.02 }, 0.65)
             .to('.st-first-crack-text-2', { x: '1.5vw', duration: 0.02 }, 0.65);
             
      roastTl.fromTo('.st-crack-radial', { scale: 0.4, opacity: 0 }, { scale: 2.0, opacity: 0.8, duration: 0.02 }, 0.65)
             .to('.st-crack-radial', { scale: 1.0, opacity: 0, duration: 0.03 }, 0.67);
             
      // Settle
      roastTl.to('.st-first-crack-text-1', { x: '0vw', duration: 0.05 }, 0.70);
      roastTl.to('.st-first-crack-text-2', { x: '0vw', duration: 0.05 }, 0.70);

      // 8. ROAST -> BREW TRANSITION (Using another pin/spacer for 45vh)
      // I'll create a second pin for the transition or just continue this timeline.
      // 45vh = 45% of 100vh. If we add it to the end of Roast:
      const transTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-roast-trans-trigger',
          scroller: scroller,
          start: 'top top',
          end: '+=45%',
          scrub: 1,
          pin: true
        }
      });
      // 0.20: camera scales to bean. 0.35: bean fills 55%. 0.45: organic mask around bean. 0.55: ground texture replace.
      transTl.to('.st-roast-final-bean', { scale: 5, duration: 0.35 }, 0.0);
      transTl.to('.st-roast-final-mask', { clipPath: 'circle(40% at 50% 50%)', duration: 0.2 }, 0.35);
      transTl.to('.st-roast-grounds-texture', { opacity: 1, duration: 0.1 }, 0.55);
      transTl.to('.st-roast-grounds-texture', { scale: 1.5, y: '20vh', duration: 0.2 }, 0.65);
      transTl.to('.st-roast-water-visual', { opacity: 1, y: '0vh', duration: 0.18 }, 0.82);
    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="roast"
      style={{ zIndex: 5 }} // Lower z-index so Origin masks out over it
    >
      <div className="st-roast-pin w-full h-screen relative bg-[#2D1B11] overflow-hidden">
        {/* Horizontal Track */}
        <div className="st-roast-track absolute top-0 left-0 h-full w-[350vw] flex items-center">
          
          <div className="w-[100vw] h-full flex flex-col justify-center items-center text-[#8B9D83] font-display text-[15vw] uppercase leading-none tracking-tighter st-roast-green depth-back">
            GREEN
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#C5A880] font-display text-[15vw] uppercase leading-none tracking-tighter st-roast-yellow depth-back">
            YELLOW
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#D4AF37] font-display text-[18vw] uppercase leading-none tracking-tighter st-roast-gold depth-back">
            GOLD
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#995c2b] font-display text-[18vw] uppercase leading-none tracking-tighter st-roast-caramel depth-back">
            CARAMEL
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#5c3a21] font-display text-[20vw] uppercase leading-none tracking-tighter st-roast-brown depth-back">
            BROWN
          </div>
          <div className="w-[50vw] h-full flex justify-center items-center text-[#2D1B11] font-display text-[22vw] uppercase leading-none tracking-tighter st-roast-dark depth-back mix-blend-color-dodge">
            DARK
          </div>

          <div className="absolute top-1/2 left-[180vw] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none mix-blend-difference text-white">
            <div className="text-[10vw] font-display uppercase tracking-tighter leading-none flex st-first-crack-text">
              <div className="st-first-crack-text-1">FIRST</div>
              <div className="st-first-crack-text-2">CRACK</div>
            </div>
          </div>
        </div>

        {/* The Bean */}
        <div className="absolute left-[30vw] top-1/2 -translate-y-1/2 w-[30vw] h-[30vw] st-roast-bean mix-blend-luminosity depth-main pointer-events-none">
          <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl" />
        </div>
        
        {/* Radial Crack Element */}
        <div className="absolute top-1/2 left-[30vw] -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-white/20 blur-xl opacity-0 st-crack-radial pointer-events-none" />
      </div>

      <div className="st-roast-trans-trigger w-full h-screen relative bg-[#1A100C] overflow-hidden">
        {/* Bean to brew transition */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[30vw] h-[30vw] st-roast-final-bean relative">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full st-roast-final-mask" />
            <img src="https://images.unsplash.com/photo-1495474472205-51f75f23b1fb?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover rounded-full opacity-0 st-roast-grounds-texture" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-100/10 opacity-0 st-roast-water-visual translate-y-[100%]" />
        </div>
      </div>
    </div>
  );
}
