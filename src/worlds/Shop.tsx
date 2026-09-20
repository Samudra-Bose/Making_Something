import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SHOP_IMAGES } from '../assets/images';

gsap.registerPlugin(ScrollTrigger);

interface ShopProps {
  isJourney?: boolean;
}

export default function Shop({ isJourney }: ShopProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);

  const isActive = isJourney || activeFork === 'shop';

  const productInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    
    let reqId: number;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionMult = prefersReducedMotion ? 0.3 : 1.0;
    
    let lastX = -1000;
    let lastY = -1000;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      const { pointer } = useExperienceStore.getState();
      
      if (pointer.x !== -1000) {
        if (lastX === -1000) {
          lastX = pointer.x;
          lastY = pointer.y;
        } else {
          const dx = (pointer.x - lastX) / window.innerWidth;
          const dy = (pointer.y - lastY) / window.innerHeight;
          
          targetX += dx * 5;
          targetY += dy * 5;
          
          lastX = pointer.x;
          lastY = pointer.y;
        }
      }

      // Settle naturally
      targetX *= 0.92;
      targetY *= 0.92;
      
      const cx = Math.max(-1, Math.min(1, targetX)) * motionMult;
      const cy = Math.max(-1, Math.min(1, targetY)) * motionMult;

      if (productInnerRef.current && !isTouch) {
        gsap.set(productInnerRef.current, {
          x: cx * 8,
          y: cy * 6,
          rotationY: cx * 2, // subtle 3D perspective
          rotationX: cy * -2,
          rotationZ: cx * 2
        });
      }
      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(reqId);
  }, [isActive]);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = window;
    
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
        transTl.fromTo('.st-shop-product-wrapper', { y: '50vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, 0.35);
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
          
          end: '+=150%',
          scrub: 1,
          
          onEnter: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('shop');
          },
          onEnterBack: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('shop');
          }
        }
      });

      if (!isJourney) {
        // Standalone fade-in
        shopTl.fromTo('.st-shop-product-wrapper', { y: '35px', scale: 0.9, rotation: -2, opacity: 0 }, { y: '0px', scale: 1.0, rotation: 0, opacity: 1, duration: 0.2, ease: 'power1.out', immediateRender: false }, 0);
      } else {
        // Refine properties left by transTl
        shopTl.fromTo('.st-shop-product-wrapper', { scale: 0.9, rotation: -2 }, { scale: 1.0, rotation: 0, duration: 0.2, ease: 'power1.out', immediateRender: false }, 0);
      }

      // Label resolution
      shopTl.fromTo('.st-shop-label-content', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2, immediateRender: false }, 0.1);

      // Detailed information sequenced quietly
      shopTl.fromTo('.st-shop-name', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2, immediateRender: false }, 0.3);
      shopTl.fromTo('.st-shop-desc', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2, immediateRender: false }, 0.5);
      shopTl.fromTo('.st-shop-price', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2, immediateRender: false }, 0.7);
      shopTl.fromTo('.st-shop-action', { opacity: 0, y: '10px' }, { opacity: 1, y: '0px', duration: 0.2, immediateRender: false }, 0.9);

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${isJourney ? '-mt-[50vh]' : ''}`} 
      data-world="shop"
      style={{ zIndex: 40, backgroundColor: 'transparent' }}
    >
      {/* TRANSITION OVERLAP ZONE */}
      <div className="st-shop-trans w-full h-[50vh] relative pointer-events-none" />

      {/* SHOP HERO */}
      <div className="st-shop-hero w-full min-h-screen relative bg-[#F2F0EB] flex flex-col md:flex-row items-center justify-center px-6 md:px-[10%] pt-24 pb-24 overflow-hidden z-10">
        
        {/* Visual Product Side - Dominant, clean, minimal */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center relative perspective-[1000px]">
          <div className="st-shop-product-wrapper relative w-[75vw] md:w-[35vw] max-w-[450px] aspect-[4/5] shadow-none pointer-events-auto bg-transparent">
            {/* INNER WRAPPER for pointer physics to not fight ScrollTrigger */}
            <div className="w-full h-full st-shop-product-inner transform-style-3d relative" ref={productInnerRef}>
              <img 
                src={SHOP_IMAGES.product.url}
                alt={SHOP_IMAGES.product.alt}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]" 
                style={{ objectPosition: SHOP_IMAGES.product.position }}
              />
              
              {/* Refined editorial label */}
              <div className="st-shop-label-content absolute bottom-[5%] left-[-2%] md:left-[-10%] w-[90%] bg-white/95 p-4 md:p-6 flex flex-col gap-2 z-20 shadow-lg border border-[#3B2516]/10">
                <h3 className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#3B2516]/70">Single Origin</h3>
                <h2 className="font-display text-3xl md:text-4xl tracking-tighter text-[#1A100C] uppercase leading-[0.9]">Ethiopian<br/>Heirloom</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Side - Sequential UI */}
        <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 md:gap-8 z-20 pl-[5%] md:pl-[5%] mt-8 md:mt-0 pointer-events-auto">
          <div className="st-shop-name group">
            <h1 className="font-display text-[14vw] md:text-[6vw] tracking-tighter uppercase text-[#1A100C] leading-[0.8] mix-blend-multiply opacity-95 transition-transform duration-300 group-hover:-translate-y-[2px]">
              Ethiopian<br/><span className="text-[#1A100C]/70">Heirloom</span>
            </h1>
          </div>
          <div className="st-shop-desc">
            <p className="font-sans text-sm md:text-base text-[#1A100C]/70 leading-relaxed max-w-md mix-blend-multiply tracking-wide">
              Cultivated at 2,000 meters in Yirgacheffe, these heirloom beans undergo a slow, fully-washed process. The result is unparalleled clarity with distinct notes of bergamot, jasmine, and wild honey.
            </p>
          </div>
          
          <div className="st-shop-variants flex flex-col gap-4">
             {/* Format Selection */}
             <div className="flex flex-col gap-2">
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A100C]/50">Format</span>
                <div className="flex gap-2">
                   {['Whole Bean', 'Filter Grind', 'Espresso'].map(v => (
                      <button key={v} className="px-4 py-2 border border-[#3B2516]/20 font-sans text-[10px] uppercase tracking-widest text-[#1A100C] hover:bg-[#3B2516]/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A100C]">
                         {v}
                      </button>
                   ))}
                </div>
             </div>
          </div>
          
          <div className="st-shop-price flex items-baseline gap-4 md:gap-6 pt-2">
            <span className="font-display text-5xl md:text-5xl text-[#1A100C] tracking-tighter">$24</span>
            <div className="flex flex-col">
              <span className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#1A100C]/60">250g</span>
            </div>
          </div>
          
          <div className="st-shop-action mt-2 md:mt-4">
            <button 
              className="bg-[#1A100C] text-[#F2F0EB] font-sans uppercase tracking-[0.2em] text-[10px] md:text-xs h-14 md:h-16 px-10 md:px-14 flex items-center justify-center transition-all duration-200 hover:-translate-y-[2px] active:scale-[0.985] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A100C]"
              onClick={() => {
                useExperienceStore.getState().addToCart({
                  id: 'ethiopian-heirloom',
                  name: 'Ethiopian Heirloom',
                  price: 24,
                  quantity: 1
                });
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* SUPPORTING PRODUCTS - Asymmetric Grid */}
      <div className="w-full min-h-screen bg-[#F2F0EB] relative z-10 px-6 md:px-[10%] py-24 flex flex-col items-center justify-start border-t border-[#3B2516]/5">
         {/* Title */}
         <div className="w-full mb-16 md:mb-32">
            <h3 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B2516]/60">Explore the Roastery</h3>
         </div>
         
         <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            {/* Secondary Product - offset right */}
            <div className="md:col-span-5 md:col-start-7 flex flex-col gap-6 md:mt-24 pointer-events-auto group">
               <div className="w-full aspect-[4/5] overflow-hidden bg-transparent relative">
                  <img src={SHOP_IMAGES.product.url} loading="lazy" decoding="async" className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-500 group-hover:scale-[1.02]" style={{ objectPosition: SHOP_IMAGES.product.position }} />
               </div>
               <div>
                  <h4 className="font-display text-2xl uppercase tracking-tighter text-[#1A100C] transition-transform duration-300 group-hover:-translate-y-[2px]">Colombian Supremo</h4>
                  <p className="font-sans text-xs tracking-widest text-[#1A100C]/60 mt-2 uppercase">$22 &middot; 250g</p>
               </div>
            </div>

            {/* Tertiary Product - offset left */}
            <div className="md:col-span-4 md:col-start-2 flex flex-col gap-6 md:-mt-32 pointer-events-auto group">
               <div className="w-full aspect-square overflow-hidden bg-transparent relative">
                  <img src={SHOP_IMAGES.product.url} loading="lazy" decoding="async" className="w-full h-full object-cover mix-blend-multiply opacity-80 transition-transform duration-500 group-hover:scale-[1.02]" style={{ objectPosition: SHOP_IMAGES.product.position }} />
               </div>
               <div>
                  <h4 className="font-display text-xl uppercase tracking-tighter text-[#1A100C] transition-transform duration-300 group-hover:-translate-y-[2px]">Guatemalan Antigua</h4>
                  <p className="font-sans text-xs tracking-widest text-[#1A100C]/60 mt-2 uppercase">$26 &middot; 250g</p>
               </div>
            </div>
         </div>
      </div>

      {/* QUIET ENDING */}
      <div className="w-full h-[60vh] bg-[#F2F0EB] relative z-10 flex flex-col items-center justify-center text-center px-6">
         <span className="font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-[#1A100C]/40 mb-6">Experience Complete</span>
         <h2 className="font-display text-[12vw] md:text-[6vw] uppercase tracking-tighter text-[#1A100C] opacity-90 leading-none">Your Ritual<br/>Awaits</h2>
      </div>
    </div>
  );
}
