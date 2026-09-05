import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AntiGravity } from '../reactive/AntiGravity';

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
      
      // 1. ORIGIN -> ROAST TRANSITION & HORIZONTAL SEQUENCE
      const roastTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-roast-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=600%', // Long pin for horizontal progression
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => useExperienceStore.getState().setActiveWorld('roast'),
          onEnterBack: () => useExperienceStore.getState().setActiveWorld('roast'),
          onUpdate: (self) => {
            if (isActive && !isJourney) {
              useExperienceStore.getState().setGlobalProgress(0.25 + self.progress * 0.30);
            }
          }
        }
      });

      // Initially, Roast container is hidden via clip-path
      gsap.set('.st-roast-reveal', { clipPath: 'circle(0% at 50% 50%)' });
      
      // 0-10%: Transition Reveal (Origin -> Roast)
      roastTl.to('.st-roast-reveal', { clipPath: 'circle(150% at 50% 50%)', duration: 1 })
             .fromTo('.st-roast-bg', { scale: 1.2 }, { scale: 1, duration: 1 }, 0);

      // 10-80%: Horizontal Roast Sequence
      // We will move the inner track horizontally
      roastTl.to('.st-roast-track', { x: '-80vw', duration: 7 }, 1)
             .to('.st-roast-bean', { rotate: 360, duration: 7 }, 1)
             .to('.st-roast-bg', { filter: 'sepia(80%) hue-rotate(-20deg) saturate(2) brightness(0.6)', duration: 7 }, 1)
             // Typographic choreography
             .to('.st-roast-word-green', { opacity: 0, x: -100, duration: 1 }, 1)
             .to('.st-roast-word-yellow', { opacity: 1, scale: 1.1, duration: 1 }, 2)
             .to('.st-roast-word-yellow', { opacity: 0, scale: 0.9, duration: 1 }, 3)
             .to('.st-roast-word-gold', { opacity: 1, scale: 1.2, duration: 1 }, 4)
             .to('.st-roast-word-gold', { opacity: 0, scale: 0.9, duration: 1 }, 5)
             .to('.st-roast-word-brown', { opacity: 1, scale: 1.3, duration: 1 }, 6)
             .to('.st-roast-word-brown', { opacity: 0, scale: 0.9, duration: 1 }, 7);

      // 80-100%: Setup for First Crack
      roastTl.to('.st-roast-bean', { scale: 1.2, duration: 2 }, 8)
             .to('.st-roast-bg', { scale: 1.05, duration: 2 }, 8);


      // 2. FIRST CRACK MOMENT
      const crackTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-first-crack',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 0, // No scrub smoothing to make it feel abrupt
          pin: true
        }
      });

      // Build tension
      crackTl.fromTo('.st-crack-text', { letterSpacing: '-0.05em', scale: 0.9 }, { letterSpacing: '0.1em', scale: 1, duration: 1 })
             // Abrupt crack
             .to('.st-crack-text', { scale: 1.5, letterSpacing: '0.5em', filter: 'blur(2px)', duration: 0.1, ease: 'rough' })
             .to('.st-crack-bg', { scale: 1.2, filter: 'contrast(1.5) brightness(1.2)', duration: 0.1 })
             .to('.st-crack-particles', { opacity: 1, scale: 1.5, duration: 0.1 })
             // Settle
             .to('.st-crack-text', { scale: 1.2, letterSpacing: '0.2em', filter: 'blur(0px)', duration: 0.8 })
             .to('.st-crack-bg', { scale: 1.1, filter: 'contrast(1) brightness(0.8)', duration: 0.8 })
             .to('.st-crack-particles', { opacity: 0, scale: 2, duration: 0.8 });

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="roast"
      style={{ zIndex: 20 }} // Higher z-index to overlay Origin
    >
      <div className="st-roast-pin w-full h-screen relative">
        <div className="st-roast-reveal w-full h-full relative overflow-hidden bg-[#2D1B11]">
          
          {/* Background */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop"
               className="w-full h-full object-cover st-roast-bg mix-blend-overlay opacity-60"
               alt=""
             />
             <div className="absolute inset-0 bg-gradient-to-r from-[#8B9D83] via-[#C5A880] to-[#3B2516] mix-blend-multiply opacity-80" />
          </div>

          {/* Horizontal Track */}
          <div className="st-roast-track absolute inset-0 z-10 flex items-center w-[200vw]">
            
            {/* The Bean (Moves with track but rotates) */}
            <div className="absolute left-[30vw] top-1/2 -translate-y-1/2 w-[30vw] h-[30vw] st-roast-bean mix-blend-luminosity">
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl" />
            </div>

            {/* Typography Stations */}
            <div className="w-[100vw] h-full flex flex-col justify-center items-center text-[#EAE7E0] font-display text-[15vw] uppercase leading-none tracking-tighter opacity-80 st-roast-word-green">
              GREEN
            </div>
            <div className="absolute left-[40vw] text-[#EAE7E0] font-display text-[15vw] uppercase leading-none tracking-tighter opacity-0 st-roast-word-yellow mix-blend-overlay">
              YELLOW
            </div>
            <div className="absolute left-[60vw] text-[#EAE7E0] font-display text-[18vw] uppercase leading-none tracking-tighter opacity-0 st-roast-word-gold mix-blend-overlay">
              GOLD
            </div>
            <div className="absolute left-[80vw] text-[#EAE7E0] font-display text-[20vw] uppercase leading-none tracking-tighter opacity-0 st-roast-word-brown">
              BROWN
            </div>

          </div>

        </div>
      </div>

      {/* First Crack Section */}
      <div className="st-first-crack w-full h-screen relative bg-[#1A100C] overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 z-0 opacity-40">
           <img 
               src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2000&auto=format&fit=crop"
               className="w-full h-full object-cover st-crack-bg filter brightness-50"
               alt=""
             />
         </div>
         <div className="st-crack-particles absolute inset-0 z-10 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,200,100,0.2)_0%,transparent_70%)]" />
         
         <div className="z-20 text-[#F2F0EB] font-display text-[12vw] uppercase tracking-tighter leading-none flex gap-4 st-crack-text mix-blend-difference">
           <div>FIRST</div>
           <div>CRACK</div>
         </div>
      </div>
      
    </div>
  );
}
