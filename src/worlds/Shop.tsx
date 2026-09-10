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

  const productRef = useRef<HTMLDivElement>(null);

  // Mouse interaction state
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const target = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    let reqId: number;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    const render = () => {
      const { pointer } = useExperienceStore.getState();
      
      if (pointer.x !== -1000) {
        mouse.current.x = pointer.x / window.innerWidth;
        mouse.current.y = pointer.y / window.innerHeight;
      }

      target.current.x += (mouse.current.x - target.current.x) * 0.08;
      target.current.y += (mouse.current.y - target.current.y) * 0.08;
      
      if (productRef.current && !isTouch) {
        // x ±8px, y ±6px, rot ±2deg
        const xMove = (target.current.x - 0.5) * 16;
        const yMove = (target.current.y - 0.5) * 12;
        const rotMove = (target.current.x - 0.5) * 4;
        
        gsap.set(productRef.current, {
          x: xMove,
          y: yMove,
          rotation: rotMove
        });
      }
      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(reqId);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = isJourney ? window : containerRef.current;
    
    ScrollTrigger.getAll().filter(t => t.scroller === scroller && t.vars.trigger && t.vars.trigger.toString().includes('st-shop')).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      
      // 1. CUP -> PRODUCT TRANSITION
      if (isJourney) {
        const transTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.st-shop-trans',
            scroller: scroller,
            start: 'top bottom', // when overlap enters viewport
            end: 'bottom bottom',
            scrub: 1
          }
        });
        
        // 0.20: camera pulls backward
        transTl.to('.st-cup-main', { scale: 0.6, y: '-10vh', duration: 0.5, ease: 'power1.inOut' }, 0.20);
        // 0.35: package enters from below
        transTl.fromTo('.st-shop-product-wrapper', { y: '50vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.35);
        // 0.70: cup moves toward background
        transTl.to('.st-cup-main', { opacity: 0, scale: 0.4, duration: 0.3, ease: 'power1.in' }, 0.70);
        // 0.80: package becomes dominant
        // 0.90: label resolves (handled in shopTl below for clarity)
      }

      // 2. SHOP HERO PRODUCT & DETAILS
      const shopTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-shop-hero',
          scroller: scroller,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            if (isActive) useExperienceStore.getState().setActiveWorld('shop');
          }
        }
      });

      if (!isJourney) {
        // Standalone fade-in
        shopTl.fromTo('.st-shop-product-wrapper', { y: '35px', scale: 0.9, rotation: -2, opacity: 0 }, { y: '0px', scale: 1.0, rotation: 0, opacity: 1, duration: 0.2, ease: 'power1.out' }, 0);
      } else {
        // Refine properties left by transTl
        shopTl.fromTo('.st-shop-product-wrapper', { scale: 0.9, rotation: -2 }, { scale: 1.0, rotation: 0, duration: 0.2, ease: 'power1.out' }, 0);
      }

      // Label resolution
      shopTl.fromTo('.st-shop-label-content', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2 }, 0.1);

      // Detailed information sequenced quietly
      shopTl.fromTo('.st-shop-name', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2 }, 0.3);
      shopTl.fromTo('.st-shop-desc', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2 }, 0.5);
      shopTl.fromTo('.st-shop-price', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2 }, 0.7);
      shopTl.fromTo('.st-shop-action', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2 }, 0.9);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      onScroll={(e) => setScroll(e.currentTarget.scrollTop)} 
      className={`relative w-full ${isJourney ? '-mt-[50vh]' : 'h-full overflow-y-auto overflow-x-hidden'}`} 
      data-world="shop"
      style={{ zIndex: 40, backgroundColor: 'transparent' }}
    >
      {/* TRANSITION OVERLAP ZONE */}
      <div className="st-shop-trans w-full h-[50vh] relative pointer-events-none" />

      {/* SHOP HERO */}
      <div className="st-shop-hero w-full h-screen relative bg-[#F2F0EB] flex flex-col md:flex-row items-center justify-center p-8 md:p-20 overflow-hidden">
        
        {/* Visual Product Side */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative">
          <div className="st-shop-product-wrapper relative w-[45vw] max-w-[280px] aspect-[1/1.5] shadow-2xl pointer-events-auto bg-[#D9D3C5]" ref={productRef}>
            <div className="absolute inset-0 mix-blend-multiply opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
            <div className="absolute inset-0 border-[8px] border-[#C5A880]/30 pointer-events-none" />
            
            <div className="st-shop-label-content absolute bottom-12 left-[-20px] w-[calc(100%+40px)] bg-[#F2F0EB] shadow-md p-6 border border-[#3B2516]/5 flex flex-col gap-2">
              <h3 className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#3B2516]/50">Single Origin</h3>
              <h2 className="font-display text-3xl tracking-tighter text-[#1A100C] uppercase leading-[0.9]">Ethiopian<br/>Heirloom</h2>
            </div>
          </div>
        </div>

        {/* Detailed Information Side */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center gap-6 z-20 md:pl-16 max-w-lg pointer-events-auto">
          <div className="st-shop-name">
            <h1 className="font-display text-5xl md:text-7xl tracking-tighter uppercase text-[#1A100C] leading-none">Ethiopian Heirloom</h1>
          </div>
          <div className="st-shop-desc">
            <p className="font-sans text-sm md:text-base text-[#3B2516]/80 leading-relaxed max-w-sm">
              Cultivated at 2,000 meters in Yirgacheffe, these heirloom beans undergo a slow, fully-washed process. The result is unparalleled clarity with distinct notes of bergamot, jasmine, and wild honey.
            </p>
          </div>
          <div className="st-shop-price flex items-center gap-6 border-t border-[#3B2516]/10 pt-6 mt-4">
            <span className="font-display text-4xl text-[#1A100C]">$24</span>
            <span className="font-sans text-xs tracking-[0.15em] uppercase text-[#3B2516]/60">250g Whole Bean</span>
          </div>
          <div className="st-shop-action mt-2">
            <button className="bg-[#1A100C] hover:bg-[#3B2516] text-[#F2F0EB] font-sans uppercase tracking-[0.2em] text-xs h-14 px-12 flex items-center justify-center transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
