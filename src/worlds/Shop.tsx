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
          end: '+=200%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) {
               useExperienceStore.getState().setActiveWorld('shop');
            }
          }
        }
      });

      // 15. SHOP PRODUCT REVEAL (scroll-controlled reveal)
      // product starts: scale 0.92, y 30px, opacity 0.0
      gsap.set('.st-shop-package', { scale: 0.92, y: '30px', opacity: 0, rotate: -2 });
      
      // 0.00 -> 0.20: opacity 0 -> 1
      shopTl.to('.st-shop-package', { opacity: 1, duration: 0.2 }, 0);
      // 0.15 -> 0.45: y 30px -> 0
      shopTl.to('.st-shop-package', { y: '0px', duration: 0.3 }, 0.15);
      // 0.20 -> 0.70: scale 0.92 -> 1.0
      shopTl.to('.st-shop-package', { scale: 1.0, duration: 0.5 }, 0.20);
      // 0.45 -> 0.80: package rotates slightly from -2deg -> 0deg
      shopTl.to('.st-shop-package', { rotate: 0, duration: 0.35 }, 0.45);

      // Color Progression: deep coffee -> paper / charcoal (interpolate dominant environment)
      // Since it overlaps Brew, we can just fade in the paper background.
      shopTl.to('.st-shop-bg', { opacity: 1, duration: 0.5 }, 0);
      
      // Shop UI elements fade in calmly
      shopTl.fromTo('.st-shop-ui', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, 0.8);
    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="shop"
      style={{ zIndex: 40 }}
    >
      <div className="st-shop-pin w-full h-screen relative flex items-center justify-center">
        
        {/* Paper / Charcoal Environment Fade-in */}
        <div className="st-shop-bg absolute inset-0 z-0 bg-[#EBE9E4] opacity-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply" />
        </div>

        <div className="relative z-20 flex flex-col items-center">
          
          <div className="st-shop-package w-[40vw] md:w-[25vw] aspect-[3/4] shadow-2xl flex items-center justify-center overflow-hidden bg-[#222222]">
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=500&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" alt="Coffee Packaging Texture" />
             <div className="text-center p-8 border border-white/20 m-4 relative z-10">
               <div className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-4">Origin</div>
               <div className="text-white text-3xl font-display mb-2">Guji Zone</div>
               <div className="text-white/60 text-[10px] tracking-[0.3em] uppercase mt-8">Whole Bean</div>
             </div>
          </div>

          <div className="st-shop-ui mt-10 text-center flex flex-col items-center gap-4">
            <div className="text-[#333333] text-2xl font-display tabular-nums">$24.00</div>
            <button 
              onClick={() => useExperienceStore.getState().setIsCartOpen(true)}
              className="px-12 py-4 bg-[#333333] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
              Add to Cart
            </button>
          </div>

        </div>
        
      </div>
    </div>
  );
}
