import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ShopProps {
  isJourney?: boolean;
}

export default function Shop({ isJourney }: ShopProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);

  const isActive = isJourney || activeFork === 'shop';

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = isJourney ? window : containerRef.current;
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger === '.st-shop-pin').forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      const shopTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-shop-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=400%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => useExperienceStore.getState().setActiveWorld('shop'),
          onEnterBack: () => useExperienceStore.getState().setActiveWorld('shop'),
          onUpdate: (self) => {
            if (isActive && !isJourney) {
               useExperienceStore.getState().setGlobalProgress(0.78 + self.progress * 0.22);
            }
          }
        }
      });

      // Shop reveal overlaps Brew
      gsap.set('.st-shop-reveal', { clipPath: 'inset(100% 0 0 0)' });
      
      // 0-10%: Reveal over Brew
      shopTl.to('.st-shop-reveal', { clipPath: 'inset(0% 0 0 0)', duration: 1 }, 0);

      // 10-40%: Packaging appears, rotates, label readable
      shopTl.fromTo('.st-shop-package', 
              { scale: 0.5, y: '50vh', rotateY: -90, rotateX: 20, opacity: 0 }, 
              { scale: 1, y: '0vh', rotateY: 0, rotateX: 0, opacity: 1, duration: 3 }, 1)
            .to('.st-shop-bg', { backgroundColor: '#EBE9E4', duration: 3 }, 1) // paper / charcoal feel
            .fromTo('.st-shop-title', { y: '20vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 2 }, 2);

      // 40-70%: Product centers, Shop takes over
      shopTl.to('.st-shop-package', { x: '-20vw', scale: 0.9, duration: 3 }, 4)
            .fromTo('.st-shop-details', { x: '10vw', opacity: 0 }, { x: '0vw', opacity: 1, duration: 2 }, 5)
            .to('.st-shop-title', { x: '10vw', y: '-30vh', scale: 0.5, opacity: 0.5, duration: 3 }, 4);

      // 70-100%: Further scroll reveals purchase action
      shopTl.fromTo('.st-shop-action', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2 }, 7);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[100vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="shop"
      style={{ zIndex: 40 }}
    >
      <div className="st-shop-pin w-full h-screen relative">
        <div className="st-shop-reveal w-full h-full relative overflow-hidden st-shop-bg bg-[#2D1B11] flex items-center justify-center">
          
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
             {/* Grain / Paper Texture */}
             <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
          </div>

          <h2 className="st-shop-title absolute z-10 text-[18vw] font-display uppercase tracking-tighter text-[#333333] mix-blend-multiply opacity-20 pointer-events-none">
            DRIFT
          </h2>

          <div className="st-shop-package absolute z-20 w-[40vw] md:w-[25vw] aspect-[3/4] shadow-2xl flex items-center justify-center overflow-hidden bg-[#222222]">
             {/* Simulating the package */}
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" alt="Coffee Packaging Texture" />
             <div className="text-center p-8 border border-white/20 m-4 relative z-10">
               <div className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-4">Origin</div>
               <div className="text-white text-3xl font-display mb-2">Guji Zone</div>
               <div className="text-white/60 text-[10px] tracking-[0.3em] uppercase mt-8">Whole Bean</div>
             </div>
          </div>

          <div className="st-shop-details absolute right-[15vw] top-1/2 -translate-y-1/2 z-30 max-w-sm opacity-0 flex flex-col gap-6">
             <div>
               <div className="text-[#333333] text-sm tracking-[0.3em] uppercase mb-2">The Final Form</div>
               <div className="text-[#333333] text-5xl font-display leading-tight">Ethiopian<br/>Heirloom</div>
             </div>
             
             <p className="text-[#555555] leading-relaxed">
               Carefully processed, roasted to equilibrium, and sealed for peak character. Available now.
             </p>

             <div className="text-[#333333] text-3xl font-display tabular-nums mt-4">$24.00</div>

             <div className="st-shop-action mt-8">
                <button 
                  onClick={() => useExperienceStore.getState().setIsCartOpen(true)}
                  className="px-10 py-5 bg-[#333333] text-white text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors w-full sm:w-auto"
                >
                  Add to Cart
                </button>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
