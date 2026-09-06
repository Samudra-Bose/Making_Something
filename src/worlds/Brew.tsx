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
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-brew-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      const brewTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-brew-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=800%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => useExperienceStore.getState().setActiveWorld('brew'),
          onEnterBack: () => useExperienceStore.getState().setActiveWorld('brew'),
          onUpdate: (self) => {
             if (isActive && !isJourney) {
               useExperienceStore.getState().setGlobalProgress(0.55 + self.progress * 0.23);
             }
             // For the extraction percentage (40% to 100%)
             if (self.progress > 0.6 && self.progress < 0.8) {
                const yieldP = 18 + ((self.progress - 0.6) / 0.2) * 4; // 18 to 22%
                const el = document.getElementById('extraction-yield');
                if (el) el.innerText = yieldP.toFixed(1) + '%';
             }
          }
        }
      });

      // Roast -> Brew transition (The Bean becomes the Brew)
      // Reveal brew over Roast
      gsap.set('.st-brew-reveal', { clipPath: 'inset(100% 0 0 0)' });
      brewTl.to('.st-brew-reveal', { clipPath: 'inset(0% 0 0 0)', duration: 1 }, 0);

      // GRIND (1-2)
      // bean rotates -> macro push -> texture fills frame -> grounds emerge -> settle
      brewTl.fromTo('.st-grind-bean', { scale: 1, rotate: 0 }, { scale: 15, rotate: 45, opacity: 0, duration: 2 }, 1)
            .fromTo('.st-grind-grounds', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5 }, 1.5)
            .fromTo('.st-word-grind', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
            .to('.st-word-grind', { opacity: 0, scale: 1.2, duration: 0.5 }, 2.5);

      // WATER (3-4)
      // Water enters from outside, container rises, temp typography independent
      brewTl.to('.st-grind-grounds', { opacity: 0.5, duration: 1 }, 3)
            .fromTo('.st-water-stream', { y: '-100vh' }, { y: '0vh', duration: 1 }, 3)
            .fromTo('.st-water-temp', { x: '50vw', opacity: 0 }, { x: '0vw', opacity: 1, duration: 1 }, 3)
            .to('.st-water-temp', { y: '-20vh', opacity: 0, duration: 1 }, 4)
            .to('.st-word-water', { opacity: 1, duration: 0.5 }, 3.5)
            .to('.st-word-water', { opacity: 0, scale: 1.2, duration: 0.5 }, 4.5);

      // BLOOM (5-6)
      // Water reaches coffee, grounds darken, radial expansion, steam, typography expands
      brewTl.to('.st-grind-grounds', { filter: 'brightness(0.3) sepia(0.5)', duration: 1 }, 5)
            .fromTo('.st-bloom-expansion', { scale: 0, opacity: 0 }, { scale: 20, opacity: 0.8, duration: 1 }, 5)
            .fromTo('.st-word-bloom', { scale: 0.8, opacity: 0 }, { scale: 1.2, opacity: 1, letterSpacing: '0.2em', duration: 1 }, 5)
            .to('.st-word-bloom', { opacity: 0, scale: 1.5, duration: 1 }, 6)
            .to('.st-bloom-expansion', { opacity: 0, duration: 1 }, 6);

      // POUR (6-7)
      // stream moves continuously, vessel rotates, liquid reacts
      brewTl.to('.st-water-stream', { scaleY: 1.5, y: '20vh', duration: 2 }, 6)
            .to('.st-pour-surface', { opacity: 1, scale: 1, rotate: 180, duration: 2 }, 6)
            .fromTo('.st-word-pour', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1 }, 6)
            .to('.st-word-pour', { opacity: 0, duration: 0.5 }, 7);

      // EXTRACTION (7-8)
      // yield % changes (handled in onUpdate), liquid darker, environment calmer
      brewTl.to('.st-pour-surface', { backgroundColor: '#1A100C', duration: 2 }, 7)
            .to('.st-water-stream', { opacity: 0, duration: 0.5 }, 7)
            .fromTo('.st-extract-ui', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 7)
            .to('.st-extract-ui', { opacity: 0, y: -30, duration: 0.5 }, 8);

      // CUP (8-9)
      // camera pulls back, cup dominant, steam rises, settles
      brewTl.to('.st-pour-surface', { scale: 5, opacity: 0, duration: 1 }, 8)
            .fromTo('.st-cup-container', { scale: 2, y: '50vh', opacity: 0 }, { scale: 1, y: '0vh', opacity: 1, duration: 1.5 }, 8)
            .fromTo('.st-cup-steam', { opacity: 0, y: 50 }, { opacity: 0.6, y: -50, duration: 1.5 }, 8.5);

      // BREW -> SHOP Prep (9-10)
      // cup pulls back, packaging begins appearing (transition to shop)
      brewTl.to('.st-cup-container', { scale: 0.5, y: '-20vh', duration: 1 }, 9.5)
            .to('.st-brew-bg', { filter: 'brightness(0.2)', duration: 1 }, 9.5);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'} custom-scrollbar text-drift-foreground bg-drift-bg`} 
      style={{ zIndex: 30 }}
    >
      <div className="st-brew-pin w-full h-screen relative">
        <div className="st-brew-reveal w-full h-full relative overflow-hidden bg-[#D9D3C5] flex items-center justify-center">
          
          <div className="absolute inset-0 z-0 st-brew-bg bg-[#D9D3C5]" />
          
          {/* THE BEAN -> GRIND */}
          <div className="absolute z-10 w-[20vw] h-[20vw] st-grind-bean mix-blend-multiply">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover rounded-full" alt="Coffee Bean Macro" />
          </div>
          
          <div className="absolute inset-0 z-10 st-grind-grounds opacity-0 pointer-events-none">
             <img src="https://images.unsplash.com/photo-1517486448375-9e66db9a6a8b?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-multiply" alt="Coffee Grounds Texture" />
          </div>

          {/* WATER STREAM */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[50vh] bg-blue-100/40 mix-blend-overlay blur-sm z-20 st-water-stream origin-top" />

          {/* WATER TEMP */}
          <div className="absolute right-10 top-1/3 text-6xl font-display text-drift-foreground st-water-temp opacity-0 z-30">93°C</div>

          {/* BLOOM */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#2D1B11] rounded-full blur-2xl st-bloom-expansion opacity-0 z-15" />

          {/* POUR SURFACE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full border border-drift-foreground/20 st-pour-surface opacity-0 z-20 flex items-center justify-center bg-[#5c3a21]/20 backdrop-blur-sm">
             <div className="w-[90%] h-[90%] rounded-full border border-drift-foreground/10" />
             <div className="w-[80%] h-[80%] rounded-full border border-drift-foreground/5" />
          </div>

          {/* EXTRACTION UI */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center st-extract-ui opacity-0 z-30">
            <div className="text-xs font-sans tracking-[0.3em] uppercase text-drift-foreground-muted mb-2">Yield</div>
            <div id="extraction-yield" className="text-8xl font-display text-drift-foreground tabular-nums tracking-tighter">18.0%</div>
          </div>

          {/* THE CUP */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-md max-h-md st-cup-container opacity-0 z-40">
             <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover rounded-full shadow-2xl mix-blend-multiply" alt="Brewed Coffee in Cup" />
             <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/30 blur-[40px] rounded-full st-cup-steam" />
          </div>

          {/* TYPOGRAPHY (PHYSICAL OBJECTS) */}
          <div className="absolute z-50 pointer-events-none mix-blend-difference text-white">
            <h2 className="text-[15vw] font-display uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 st-word-grind">GRIND</h2>
            <h2 className="text-[12vw] font-display uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 st-word-water">WATER</h2>
            <h2 className="text-[18vw] font-display uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 st-word-bloom">BLOOM</h2>
            <h2 className="text-[15vw] font-display uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 st-word-pour">POUR</h2>
          </div>
          
        </div>
      </div>
    </div>
  );
}
