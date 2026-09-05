import React, { useRef, useEffect } from "react";
import { useExperienceStore } from "../experience/store";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "motion/react";
import { AntiGravity } from "../reactive/AntiGravity";
import { useShockwave } from "../reactive/useShockwave";

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
    
    // Core Narrative Scroll Sequence (0 to 1 progress maps to roastDevelopment)
    const st = ScrollTrigger.create({
      trigger: ".st-roast-narrative",
      scroller: scroller,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setRoastDevelopment(self.progress);
        
        // Fire shockwave precisely at First Crack (progress ~0.5)
        if (self.progress > 0.48 && self.progress < 0.52 && !shockwaveFired.current) {
          triggerShockwave(window.innerWidth / 2, window.innerHeight / 2, 2.5);
          shockwaveFired.current = true;
        } else if (self.progress < 0.45 || self.progress > 0.55) {
          shockwaveFired.current = false;
        }
      }
    });

    const mm = gsap.matchMedia(scroller);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Auto-transition to Brew at the bottom
      ScrollTrigger.create({
        trigger: ".st-transition-trigger",
        scroller: scroller,
        start: "bottom bottom",
        onEnter: () => {
          const state = useExperienceStore.getState();
          if (!state.openForks.includes("brew")) {
            state.openFork("brew");
            setTimeout(() => {
               state.focusFork("brew");
            }, 100);
          }
        }
      });
    });

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      st.kill();
      mm.revert();
    };
  }, [setRoastDevelopment, triggerShockwave]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (activeFork === "roast") {
      setScroll(e.currentTarget.scrollTop);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onScroll={handleScroll}
      className="relative h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar text-drift-foreground bg-transparent"
    >
      {/* Narrative Scroll Container (Height determines the physical length of the roast) */}
      <div className="st-roast-narrative relative" style={{ height: "700vh" }}>
        
        {/* Sticky Background / Atmosphere */}
        <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none flex items-center justify-center -z-10">
           <RoastAtmosphere dev={roastDevelopment} />
        </div>

        {/* --- SECTIONS OVERLAY --- */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between">
          
          {/* SECTION 01 - GREEN (0-15%) */}
          <section className="h-screen flex items-center px-8 lg:px-16 relative">
            <div className="max-w-xl pointer-events-auto z-10">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-8">01 - Green</h4>
              <h2 className="text-5xl md:text-7xl font-display tracking-tight mb-8">This is coffee before transformation.</h2>
              <p className="text-sm md:text-base font-sans text-drift-foreground-muted leading-relaxed">
                Cool. Quiet. Organic. The raw green seed holds the unexpressed potential of {coffeeOrigin}. 
                It is a physical surface waiting for energy.
              </p>
            </div>
            <AntiGravity depth={0.8} className="absolute right-12 lg:right-32 top-1/3 w-64 aspect-[3/4] opacity-80 pointer-events-auto shadow-2xl bg-drift-surface p-2 border border-drift-border">
              <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover filter contrast-125 sepia-[0.3]" alt="Green Beans" />
            </AntiGravity>
          </section>

          {/* SECTION 02 - HEAT (15-35%) */}
          <section className="h-screen flex items-center justify-end px-8 lg:px-16 relative text-right">
            <div className="max-w-xl pointer-events-auto z-10">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-8">02 - Heat</h4>
              <h2 className="text-5xl md:text-7xl font-display tracking-tight mb-8">Energy enters the drum.</h2>
              <p className="text-sm md:text-base font-sans text-drift-foreground-muted leading-relaxed">
                Not a neon explosion, but physical, radiating warmth. The moisture inside the dense cellular structure 
                begins to evaporate. Pressure builds.
              </p>
            </div>
          </section>

          {/* SECTION 03 - YELLOW / CHANGE (35-50%) */}
          <section className="h-screen flex items-center px-8 lg:px-16 relative">
             <div className="max-w-3xl pointer-events-auto z-10">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-8">03 - Yellow Phase</h4>
              <h2 className="text-5xl md:text-7xl font-display tracking-tight mb-8 text-[#907A60]">The Maillard Reaction.</h2>
              <p className="text-sm md:text-base font-sans text-drift-foreground-muted leading-relaxed max-w-lg">
                Green becomes straw. Straw becomes gold. Aromas shift from grassy to toasted bread. 
                Amino acids and reducing sugars degrade into hundreds of new volatile compounds.
              </p>
            </div>
          </section>

          {/* SECTION 04 - FIRST CRACK (50-65%) */}
          <section className="h-screen flex flex-col items-center justify-center px-8 lg:px-16 relative text-center">
             <AntiGravity depth={1.5} className="pointer-events-auto z-10">
               <h2 className="text-[12vw] font-display tracking-tighter leading-none mb-4 mix-blend-difference text-white">FIRST CRACK</h2>
               <p className="text-sm tracking-[0.2em] uppercase font-sans text-drift-foreground-muted mix-blend-difference text-white">The physical structure fractures.</p>
             </AntiGravity>
          </section>

          {/* SECTION 05 - DEVELOPMENT (65-88%) */}
          <section className="min-h-screen flex items-center px-8 lg:px-16 relative">
            <div className="w-full max-w-2xl pointer-events-auto z-10">
              <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-12">05 - Development</h4>
              <h2 className="text-4xl md:text-6xl font-display tracking-tight mb-16">Determine the final character.</h2>
              
              <div className="flex flex-col gap-6">
                <EditorialRoastOption 
                  level="light" 
                  title="Light" 
                  desc="Floral, bright acidity. Origin terroir preserved." 
                  current={roastLevel} 
                  onSelect={setRoastLevel} 
                />
                <EditorialRoastOption 
                  level="medium" 
                  title="Medium" 
                  desc="Caramelized sweetness. Equilibrium." 
                  current={roastLevel} 
                  onSelect={setRoastLevel} 
                />
                <EditorialRoastOption 
                  level="dark" 
                  title="Dark" 
                  desc="Heavy body. Cocoa. Roaster"s imprint." 
                  current={roastLevel} 
                  onSelect={setRoastLevel} 
                />
              </div>
            </div>
          </section>

          {/* SECTION 06 - CHARACTER (88-100%) */}
          <section className="h-screen flex flex-col items-center justify-center px-8 lg:px-16 relative text-center">
             <div className="pointer-events-auto max-w-4xl z-10">
               <h4 className="text-xs font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-12">06 - Character</h4>
               <SensoryNotes level={roastLevel} />
             </div>
          </section>
          
          {/* SECTION 07 - HANDOFF TO BREW */}
          <section className="st-transition-trigger h-[50vh] flex flex-col justify-end pb-32 px-8 lg:px-16 relative text-center">
             <div className="pointer-events-auto w-full z-10">
               <p className="text-sm font-sans tracking-[0.2em] text-drift-foreground-muted uppercase mb-8">The bean is ready.</p>
               <button 
                onClick={() => {
                  const state = useExperienceStore.getState();
                  if (!state.openForks.includes("brew")) {
                    state.openFork("brew");
                  }
                  state.focusFork("brew");
                }}
                className="text-xs font-sans tracking-[0.2em] uppercase text-drift-foreground border-b border-drift-border pb-2 hover:border-drift-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground"
              >
                Continue to Extraction
              </button>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Sub-components
// ---------------------------------------------------------

function EditorialRoastOption({ level, title, desc, current, onSelect }: any) {
  const isSelected = current === level;
  const classes = isSelected ? "border-drift-foreground opacity-100" : "border-drift-border opacity-40 hover:opacity-70";
  return (
    <button 
      onClick={() => onSelect(level)}
      className={"group flex flex-col text-left border-l-2 py-4 pl-6 transition-all duration-500 " + classes + " focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-drift-foreground"}
    >
      <span className="text-2xl font-display mb-2">{title}</span>
      <span className="text-sm font-sans text-drift-foreground-muted tracking-wide">{desc}</span>
    </button>
  );
}

function SensoryNotes({ level }: { level: string }) {
  let notes: string[] = [];
  if (level === "light") notes = ["JASMINE", "CITRUS", "BRIGHT"];
  else if (level === "medium") notes = ["CARAMEL", "STONE FRUIT", "ROUND"];
  else notes = ["COCOA", "TOASTED", "SMOKY"];

  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
      {notes.map((note, i) => (
        <AntiGravity key={note} depth={0.5 + i * 0.2}>
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.2, duration: 0.8 }}
             className="text-4xl md:text-6xl lg:text-7xl font-display text-drift-foreground inline-block"
           >
             {note}
           </motion.span>
        </AntiGravity>
      ))}
    </div>
  );
}

function RoastAtmosphere({ dev }: { dev: number }) {
  // Physical representation of the roast inside the sticky container.
  
  // Color shifting: Green (0-0.2) -> Yellow/Straw (0.3-0.5) -> Caramel (0.6-0.8) -> Dark Brown (0.8-1.0)
  let r = 160, g = 175, b = 150; // Greenish
  
  if (dev > 0.2) {
    const f = Math.min(1, (dev - 0.2) * 4); // 0-1 over 0.2-0.45
    r = 160 + (210 - 160) * f;
    g = 175 + (180 - 175) * f;
    b = 150 + (100 - 150) * f;
  }
  if (dev > 0.5) {
    const f = Math.min(1, (dev - 0.5) * 2.5); // 0-1 over 0.5-0.9
    r = 210 + (60 - 210) * f;
    g = 180 + (40 - 180) * f;
    b = 100 + (25 - 100) * f;
  }

  const bgColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
  const scale = 1 + dev * 0.3;
  const rotation = dev * 45;

  // Tension during First Crack
  const crackTension = dev > 0.45 && dev < 0.55 ? Math.sin((dev - 0.45) * 10 * Math.PI) : 0;
  const jitterX = (Math.random() - 0.5) * crackTension * 10;
  const jitterY = (Math.random() - 0.5) * crackTension * 10;

  return (
    <div className="w-full h-full relative flex items-center justify-center opacity-30 transition-opacity duration-1000">
      <motion.div 
        className="w-[150vw] h-[150vh] blur-[100px] rounded-full absolute mix-blend-multiply"
        style={{
          backgroundColor: bgColor,
          scale: scale + crackTension * 0.1,
          rotate: rotation,
          x: jitterX,
          y: jitterY
        }}
      />
      
      {/* Editorial Roast Temperature Readout */}
      <div className="absolute left-8 bottom-8 font-sans text-xs tracking-widest uppercase text-drift-foreground-muted">
        <div className="mb-1">Internal Temp</div>
        <div className="text-2xl font-display text-drift-foreground tabular-nums">
          {Math.floor(22 + dev * 200)}°C
        </div>
      </div>
      
      {/* Editorial Development Time */}
      <div className="absolute right-8 bottom-8 text-right font-sans text-xs tracking-widest uppercase text-drift-foreground-muted">
        <div className="mb-1">Time</div>
        <div className="text-2xl font-display text-drift-foreground tabular-nums">
          {String(Math.floor(dev * 12)).padStart(2, "0")}:{String(Math.floor((dev * 12 * 60) % 60)).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

