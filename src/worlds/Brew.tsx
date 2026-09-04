import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { useExperienceStore } from '../experience/store';

export default function Brew() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const coffeeOrigin = useExperienceStore((state) => state.coffeeOrigin);
  const roastLevel = useExperienceStore((state) => state.roastLevel);
  
  const brewMethod = useExperienceStore((state) => state.brewMethod);
  const brewTemperature = useExperienceStore((state) => state.brewTemperature);
  const brewRatio = useExperienceStore((state) => state.brewRatio);
  const brewProgress = useExperienceStore((state) => state.brewProgress);
  
  const setBrewMethod = useExperienceStore((state) => state.setBrewMethod);
  const setBrewTemperature = useExperienceStore((state) => state.setBrewTemperature);
  const setBrewRatio = useExperienceStore((state) => state.setBrewRatio);
  const setBrewProgress = useExperienceStore((state) => state.setBrewProgress);
  const setPointerVelocity = useExperienceStore((state) => state.setPointerVelocity);

  // Recommendations based on Roast Level
  const getRecommendation = () => {
    switch(roastLevel) {
      case 'light': return { method: 'v60', temp: 96, ratio: 16 };
      case 'medium': return { method: 'v60', temp: 93, ratio: 15 };
      case 'medium-dark': return { method: 'espresso', temp: 91, ratio: 2 };
      case 'dark': return { method: 'french-press', temp: 88, ratio: 12 };
      default: return { method: 'v60', temp: 94, ratio: 15 };
    }
  };

  useEffect(() => {
    // Apply recommended initial settings
    const rec = getRecommendation();
    setBrewMethod(rec.method as any);
    setBrewTemperature(rec.temp);
    setBrewRatio(rec.ratio);
  }, [roastLevel]); // Update if roast changes

  // Scroll sequence choreography
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scroll trigger for the ritual progression
    const scrollSections = gsap.utils.toArray('.brew-stage') as HTMLElement[];
    
    scrollSections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        scroller: containerRef.current, // Target the pane scroll container
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          // Progress across the entire brew sequence
          const totalProgress = (i + self.progress) / scrollSections.length;
          setBrewProgress(totalProgress);
        },
        onEnter: () => {
          gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        },
        onLeaveBack: () => {
          // Fade out slightly when scrolling up
          gsap.to(section, { opacity: 0.3, y: 20, duration: 1, ease: 'power3.out' });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.scroller === containerRef.current) t.kill();
      });
    };
  }, []);

  // Pour interaction (directional flow)
  const handlePourPointerMove = (e: React.PointerEvent) => {
    if (e.buttons > 0) { // If pointer down/dragging
      // Emulate turbulence and flow
      setPointerVelocity(e.movementX * 3, e.movementY * 3);
      
      // Dispatch a pour event that ReactiveField could optionally listen to
      window.dispatchEvent(new CustomEvent('drift:pour', { 
        detail: { x: e.clientX, y: e.clientY, intensity: Math.abs(e.movementY) } 
      }));
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar pb-[50vh]">
      
      {/* Intro / Hero */}
      <div className="brew-stage min-h-[70vh] flex flex-col justify-center px-8 lg:px-16 pt-24">
        <h2 className="text-4xl lg:text-6xl font-display font-medium tracking-tight mb-6">Ritual</h2>
        <div className="flex flex-col gap-2 text-drift-foreground-muted font-sans text-sm tracking-widest uppercase">
          <p>Selected: <span className="text-drift-foreground">{coffeeOrigin}</span></p>
          <p>Profile: <span className="text-drift-foreground">{roastLevel}</span></p>
        </div>
      </div>

      {/* Preparation / Method Selection */}
      <div className="brew-stage min-h-[80vh] flex flex-col justify-center px-8 lg:px-16 opacity-30 translate-y-8">
        <h3 className="text-xs tracking-[0.25em] text-drift-foreground-muted uppercase mb-12">01. Prepare</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          {(['v60', 'espresso', 'french-press'] as const).map(method => {
            const isSelected = brewMethod === method;
            const isRecommended = getRecommendation().method === method;
            
            return (
              <motion.button
                key={method}
                onClick={() => setBrewMethod(method)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-start p-6 rounded border transition-all duration-500 ${
                  isSelected 
                    ? 'border-drift-accent/50 bg-drift-accent/10 shadow-[0_10px_30px_rgba(196,159,125,0.1)]' 
                    : 'border-drift-border/50 hover:border-drift-border bg-transparent'
                }`}
              >
                <span className="text-xs tracking-widest uppercase text-drift-foreground-muted mb-4 flex items-center justify-between w-full">
                  {method}
                  {isRecommended && <span className="text-[10px] text-drift-accent">Rec</span>}
                </span>
                <span className="font-display text-xl">
                  {method === 'v60' ? 'Pour Over' : method === 'espresso' ? 'Pressure' : 'Immersion'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Variables: Temperature & Ratio */}
      <div className="brew-stage min-h-[80vh] flex flex-col justify-center px-8 lg:px-16 opacity-30 translate-y-8">
        <h3 className="text-xs tracking-[0.25em] text-drift-foreground-muted uppercase mb-12">02. Calibration</h3>
        
        <div className="flex flex-col md:flex-row gap-16 max-w-4xl">
          {/* Temperature */}
          <div className="flex-1">
            <div className="text-xs tracking-widest uppercase text-drift-foreground-muted mb-4">Water Temp</div>
            <div className="font-display text-5xl lg:text-7xl tabular-nums text-drift-accent tracking-tighter flex items-end">
              {brewTemperature}<span className="text-2xl lg:text-4xl text-drift-foreground-muted mb-2 ml-1">°C</span>
            </div>
            <input 
              type="range" 
              min="85" max="100" 
              value={brewTemperature} 
              onChange={(e) => setBrewTemperature(parseInt(e.target.value))}
              className="w-full mt-8 accent-drift-accent bg-drift-surface-hover h-1 rounded-full appearance-none outline-none" 
            />
          </div>
          
          {/* Ratio */}
          <div className="flex-1">
            <div className="text-xs tracking-widest uppercase text-drift-foreground-muted mb-4">Ratio (Coffee : Water)</div>
            <div className="font-display text-5xl lg:text-7xl tabular-nums text-drift-accent tracking-tighter">
              1 : {brewRatio}
            </div>
            <input 
              type="range" 
              min="2" max="20" step="0.5"
              value={brewRatio} 
              onChange={(e) => setBrewRatio(parseFloat(e.target.value))}
              className="w-full mt-8 accent-drift-accent bg-drift-surface-hover h-1 rounded-full appearance-none outline-none" 
            />
          </div>
        </div>
      </div>

      {/* The Pour / Interaction */}
      <div className="brew-stage min-h-[90vh] flex flex-col justify-center items-center px-8 lg:px-16 opacity-30 translate-y-8">
        <h3 className="text-xs tracking-[0.25em] text-drift-foreground-muted uppercase mb-8 self-start w-full max-w-3xl">03. The Pour</h3>
        
        <motion.div 
          className="w-full max-w-3xl aspect-[16/9] border border-drift-border/30 rounded flex items-center justify-center relative cursor-ns-resize overflow-hidden group"
          onPointerMove={handlePourPointerMove}
          whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-drift-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <div className="text-center pointer-events-none z-10">
            <div className="font-display text-2xl md:text-4xl text-drift-foreground/50 group-hover:text-drift-foreground transition-colors duration-500">
              Hold and drag to pour
            </div>
            <div className="text-xs font-sans tracking-[0.2em] uppercase text-drift-foreground-muted mt-4">
              Movement creates turbulence
            </div>
          </div>
        </motion.div>
      </div>

      {/* Extraction Visualization */}
      <div className="brew-stage min-h-[90vh] flex flex-col justify-center px-8 lg:px-16 opacity-30 translate-y-8 relative">
        <h3 className="text-xs tracking-[0.25em] text-drift-foreground-muted uppercase mb-12">04. Extraction</h3>
        
        <div className="font-display text-7xl lg:text-9xl text-drift-accent tabular-nums tracking-tighter opacity-80 mix-blend-screen">
          {Math.min(100, Math.floor(brewProgress * 130))}%
        </div>
        <div className="text-sm font-sans tracking-widest uppercase text-drift-foreground-muted mt-4">
          Dissolving sensory compounds
        </div>
        
        <div className="w-full h-1 bg-drift-surface-hover mt-12 max-w-2xl rounded overflow-hidden">
          <motion.div 
            className="h-full bg-drift-accent" 
            style={{ width: `${Math.min(100, brewProgress * 130)}%` }}
            layout
          />
        </div>
      </div>

      {/* Finish */}
      <div className="brew-stage min-h-[70vh] flex flex-col justify-center px-8 lg:px-16 opacity-30 translate-y-8">
        <h2 className="text-4xl lg:text-6xl font-display font-medium tracking-tight mb-6">The Cup</h2>
        <p className="max-w-md text-drift-foreground-muted font-sans leading-relaxed">
          The ritual resolves. Aroma, body, and acidity stabilize into their final form.
        </p>
        <div className="mt-12">
          <button className="text-xs font-sans tracking-[0.2em] uppercase text-drift-accent border-b border-drift-accent/30 pb-1 hover:border-drift-accent transition-colors">
            Experience Shop
          </button>
        </div>
      </div>

    </div>
  );
}
