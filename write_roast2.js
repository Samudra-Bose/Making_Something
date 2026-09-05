const fs = require('fs');

const code = import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { AntiGravity } from '../reactive/AntiGravity';
import { useShockwave } from '../reactive/useShockwave';

export default function Roast() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const setRoastDevelopment = useExperienceStore((state) => state.setRoastDevelopment);
  const roastDevelopment = useExperienceStore((state) => state.roastDevelopment);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  const setRoastLevel = useExperienceStore((state) => state.setRoastLevel);
  const activeFork = useExperienceStore((state) => state.activeFork);
  const setScroll = useExperienceStore((state) => state.setScroll);
  const triggerShockwave = useShockwave();
  const shockwaveFired = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const scroller = containerRef.current;
    const mm = gsap.matchMedia(scroller);

    // Master Timeline
    let masterTl: gsap.core.Timeline;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-roast-narrative',
          scroller: scroller,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            setRoastDevelopment(self.progress);
            
            // First Crack Shockwave!
            if (self.progress > 0.48 && self.progress < 0.52 && !shockwaveFired.current) {
              triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 2.5);
              shockwaveFired.current = true;
            } else if (self.progress < 0.45 || self.progress > 0.55) {
              shockwaveFired.current = false;
            }
          }
        }
      });

      // SECTION 01: GREEN (0 to 0.15)
      masterTl.to('.st-img-green', { scale: 1.1, opacity: 0, duration: 0.15, ease: 'power1.inOut' }, 0);
      masterTl.to('.st-txt-green', { y: '-100%', opacity: 0, duration: 0.15, ease: 'power2.in' }, 0);
      masterTl.fromTo('.st-txt-heat', { y: '100%', opacity: 0, scale: 0.9 }, { y: '0%', opacity: 1, scale: 1, duration: 0.1 }, 0.05);

      // SECTION 02: HEAT (0.15 to 0.35)
      masterTl.fromTo('.st-img-heat', { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1 }, 0.05);
      masterTl.to('.st-txt-heat', { scale: 1.1, opacity: 0, duration: 0.15 }, 0.2);
      masterTl.fromTo('.st-txt-yellow', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.1 }, 0.25);
      
      // SECTION 03: YELLOW (0.35 to 0.50)
      masterTl.to('.st-img-heat', { scale: 1.1, filter: 'sepia(0.8) hue-rotate(-10deg)', duration: 0.15 }, 0.2);
      masterTl.to('.st-txt-yellow', { opacity: 0, duration: 0.1 }, 0.4);

      // SECTION 04: FIRST CRACK (0.50 to 0.65)
      // Climax moment - sharp mask reveal and text fracture
      masterTl.fromTo('.st-img-crack', 
        { clipPath: 'circle(0% at 50% 50%)', opacity: 1 }, 
        { clipPath: 'circle(150% at 50% 50%)', duration: 0.1, ease: 'expo.in' }, 
      0.45);
      masterTl.fromTo('.st-txt-crack', 
        { letterSpacing: '0em', opacity: 0, scale: 0.8 }, 
        { letterSpacing: '0.2em', opacity: 1, scale: 1.2, duration: 0.1, ease: 'power4.out' }, 
      0.45);
      masterTl.to('.st-txt-crack', { opacity: 0, scale: 1.5, filter: 'blur(10px)', duration: 0.1 }, 0.55);

      // SECTION 05: DEVELOPMENT (0.65 to 0.88)
      masterTl.fromTo('.st-dev-container', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.65);
      masterTl.to('.st-img-crack', { filter: 'brightness(0.6) contrast(1.2)', duration: 0.2 }, 0.65);
      masterTl.to('.st-dev-container', { autoAlpha: 0, y: -50, duration: 0.1 }, 0.85);

      // SECTION 06: CHARACTER (0.88 to 1.0)
      masterTl.fromTo('.st-char-container', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.1 }, 0.88);

      // SECTION 07: HANDOFF TO BREW
      masterTl.fromTo('.st-img-grounds', 
        { opacity: 0, scale: 1.2 }, 
        { opacity: 0.8, scale: 1, duration: 0.12 }, 
      0.88);

      // Auto-transition to Brew at the bottom
      ScrollTrigger.create({
        trigger: '.st-transition-trigger',
        scroller: scroller,
        start: 'bottom bottom',
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes('brew')) {
            state.openFork('brew');
            setTimeout(() => state.focusFork('brew'), 100);
          }
        }
      });
    });

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (masterTl) masterTl.kill();
      mm.revert();
    };
  }, [setRoastDevelopment, triggerShockwave]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (activeFork === 'roast') {
      setScroll(e.currentTarget.scrollTop);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="relative h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar text-drift-foreground bg-drift-bg"
    >
      <div className="st-roast-narrative relative" style={{ height: '700vh' }}>
        
        {/* Sticky Cinematic Stage */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
          
          {/* Background Images / Macro Textures */}
          <div className="absolute inset-0 pointer-events-none -z-20">
            <img 
              src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=2000" 
              alt="Green Beans" 
              className="st-img-green absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <img 
              src="https://images.unsplash.com/photo-1517488629431-6427e028c037?auto=format&fit=crop&q=80&w=2000" 
              alt="Heat" 
              className="st-img-heat absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-overlay"
            />
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=2000" 
              alt="Cracked Roasted Bean" 
              className="st-img-crack absolute inset-0 w-full h-full object-cover opacity-0 filter brightness-90"
            />
            <img 
              src="https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&q=80&w=2000" 
              alt="Grounds Transition" 
              className="st-img-grounds absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-drift-bg/30"></div>
          </div>

          {/* Foreground Typography & Interactive Layers */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center -z-10">
            
            {/* 01 GREEN */}
            <div className="st-txt-green absolute text-center w-full max-w-4xl px-8">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4">01 - Green</h4>
              <h2 className="text-6xl md:text-8xl font-display tracking-tight text-white drop-shadow-2xl">{coffeeOrigin}</h2>
              <div className="mt-8 text-sm md:text-base font-sans text-white/80 leading-relaxed max-w-md mx-auto">
                The seed rests. Dense, cool, packed with unexpressed potential.
              </div>
            </div>

            {/* 02 HEAT */}
            <div className="st-txt-heat absolute text-center w-full max-w-4xl px-8 opacity-0">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4">02 - Heat</h4>
              <h2 className="text-6xl md:text-8xl font-display tracking-tight text-[#ffcda3] drop-shadow-2xl">Endothermic.</h2>
              <div className="mt-8 text-sm md:text-base font-sans text-white/80 leading-relaxed max-w-md mx-auto">
                Energy floods the cellular structure. Moisture begins to turn into vapor.
              </div>
            </div>

            {/* 03 YELLOW */}
            <div className="st-txt-yellow absolute text-center w-full max-w-4xl px-8 overflow-hidden">
              <div className="py-4">
                <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-4">03 - Maillard</h4>
                <h2 className="text-6xl md:text-8xl font-display tracking-tight text-[#c69a6b] drop-shadow-2xl">Transformation.</h2>
              </div>
            </div>

            {/* 04 CRACK */}
            <div className="st-txt-crack absolute text-center w-full max-w-4xl px-8 opacity-0 mix-blend-difference">
              <h2 className="text-[15vw] font-display font-medium text-white leading-none">CRACK</h2>
            </div>

            {/* 05 DEVELOPMENT (Pointer events auto because of buttons) */}
            <div className="st-dev-container absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 invisible">
              <div className="max-w-3xl w-full px-8 pointer-events-auto bg-drift-surface/90 p-12 border border-drift-border shadow-2xl backdrop-blur-md">
                <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-8">05 - Development</h4>
                <h2 className="text-4xl md:text-6xl font-display tracking-tight mb-12">The Roaster's Imprint.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EditorialRoastOption level="light" title="Light" desc="Bright, Floral" current={roastLevel} onSelect={setRoastLevel} />
                  <EditorialRoastOption level="medium" title="Medium" desc="Sweet, Balanced" current={roastLevel} onSelect={setRoastLevel} />
                  <EditorialRoastOption level="dark" title="Dark" desc="Heavy, Cocoa" current={roastLevel} onSelect={setRoastLevel} />
                </div>
              </div>
            </div>

            {/* 06 CHARACTER & 07 HANDOFF */}
            <div className="st-char-container absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 invisible">
               <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-12">06 - Character</h4>
               <SensoryNotes level={roastLevel} />
               <div className="mt-32 pointer-events-auto">
                 <button 
                  onClick={() => {
                    const state = useExperienceStore.getState();
                    if (!state.openForks.includes('brew')) state.openFork('brew');
                    state.focusFork('brew');
                  }}
                  className="text-xs font-sans tracking-[0.2em] uppercase text-drift-foreground border-b border-drift-foreground pb-2 hover:text-drift-foreground-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground bg-drift-bg/50 px-4 pt-2"
                >
                  Proceed to Extraction
                </button>
               </div>
            </div>
            
          </div>
          
          {/* Subtle Progress Indicators overlay */}
          <div className="absolute right-8 bottom-8 text-right font-sans text-xs tracking-widest uppercase text-drift-foreground-muted pointer-events-none">
            <div className="mb-1">Dev: {Math.round(roastDevelopment * 100)}%</div>
            <div className="text-xl font-display text-drift-foreground tabular-nums">
              {Math.floor(22 + roastDevelopment * 200)}°C
            </div>
          </div>

        </div>
        
        {/* Invisible trigger exactly at the bottom to transition to Brew if user keeps scrolling instead of clicking */}
        <div className="st-transition-trigger absolute bottom-0 left-0 w-full h-[1px]"></div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Sub-components
// ---------------------------------------------------------

function EditorialRoastOption({ level, title, desc, current, onSelect }: any) {
  const isSelected = current === level;
  return (
    <button 
      onClick={() => onSelect(level)}
      className={\group flex flex-col text-left border-t-2 pt-4 transition-all duration-500 \ focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground\}
    >
      <span className="text-2xl font-display mb-1">{title}</span>
      <span className="text-xs font-sans text-drift-foreground-muted tracking-widest uppercase">{desc}</span>
    </button>
  );
}

function SensoryNotes({ level }: { level: string }) {
  let notes: string[] = [];
  if (level === 'light') notes = ['JASMINE', 'CITRUS', 'BRIGHT'];
  else if (level === 'medium') notes = ['CARAMEL', 'STONE FRUIT', 'ROUND'];
  else notes = ['COCOA', 'TOASTED', 'SMOKY'];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
      {notes.map((note, i) => (
        <AntiGravity key={note} depth={0.5 + i * 0.2}>
           <motion.span className="text-4xl md:text-6xl lg:text-8xl font-display text-white drop-shadow-xl inline-block">
             {note}
           </motion.span>
        </AntiGravity>
      ))}
    </div>
  );
}
;

fs.writeFileSync('src/worlds/Roast.tsx', code);
