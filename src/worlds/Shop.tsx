import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-shop-pin',
          scroller: scroller,
          start: 'top top',
          end: '+=200%', 
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (isActive) useExperienceStore.getState().setActiveWorld('shop');
          }
        }
      });
      
      // 9. SECOND MASK FOR BREW -> SHOP
      // The pin wrapper in Shop starts clipped to 0, expanding from center.
      // Wait, if it's pinned, the whole container masks in!
      tl.fromTo('.st-shop-pin-mask', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: 0.3, ease: 'power2.in' }, 0);
      
      // Background text cross-world link
      tl.fromTo('.st-bg-word-shop', { y: '30vh', opacity: 0 }, { y: '0vh', opacity: 0.1, duration: 0.5 }, 0.2);
      
      // 18. SHOP - PHYSICAL PRODUCT
      // scale 0.94 -> 1.0, y 30px -> 0, rotation -2deg -> 0, shadow small -> stronger
      tl.fromTo('.st-shop-product', { scale: 0.94, y: '30px', rotation: -2, filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))' }, { scale: 1.0, y: '0px', rotation: 0, filter: 'drop-shadow(0px 30px 40px rgba(0,0,0,0.5))', duration: 0.6, ease: 'power2.out' }, 0.2);
      
      // Camera Push: Supporting objects y 0 -> -3vh
      tl.to('.st-shop-ui', { y: '-3vh', duration: 0.5, ease: 'none' }, 0.4);
      
      tl.to('.st-shop-ui', { opacity: 1, duration: 0.3 }, 0.5);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[50vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="shop"
      style={{ zIndex: 40 }}
    >
      <div className="st-shop-pin w-full h-screen relative overflow-hidden">
        <div className="st-shop-pin-mask absolute inset-0 w-full h-full bg-[#1A100C] depth-bg flex items-center justify-center">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-0 st-bg-word-shop pointer-events-none text-[30vw] font-display tracking-tighter text-white">
            SHOP
          </div>
          
          {/* Subtle noise/texture overlay for material feel (20. MATERIAL LANGUAGE) */}
          <div className="absolute inset-0 z-[1] opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stucco.png")' }}></div>

          <div className="relative z-10 w-[40vw] max-w-[400px] aspect-[3/4] flex items-center justify-center st-shop-product depth-main">
            <div className="w-full h-full bg-[#D9D3C5] rounded-sm p-8 flex flex-col justify-between border-l-4 border-l-[#C5A880]">
              <div>
                 <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-[#3B2516]/60 mb-2">Single Origin</h3>
                 <h2 className="font-display text-4xl tracking-tighter text-[#1A100C] uppercase leading-none">Ethiopian<br/>Heirloom</h2>
              </div>
              <div className="flex justify-between items-end">
                 <span className="font-display text-2xl text-[#3B2516]">$24</span>
                 <span className="font-sans text-xs uppercase tracking-widest text-[#3B2516]/50">250G</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-0 st-shop-ui z-20 depth-fg">
            <Button className="bg-[#D4AF37] hover:bg-[#C5A880] text-black font-sans uppercase tracking-widest text-xs h-14 px-10 rounded-none">
              Add to Cart <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
