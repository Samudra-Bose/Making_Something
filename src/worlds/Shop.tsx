import React, { useRef, useEffect, useState } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SHOP_IMAGES } from '../assets/images';

gsap.registerPlugin(ScrollTrigger);

interface ShopProps {
  isJourney?: boolean;
}

type Format = 'Whole Bean' | 'Filter Grind' | 'Espresso';

const FORMATS: Format[] = ['Whole Bean', 'Filter Grind', 'Espresso'];

export default function Shop({ isJourney }: ShopProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const productWrapperRef = useRef<HTMLDivElement>(null);
  const productInnerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const isActive = isJourney || activeFork === 'shop';

  const [selectedFormat, setSelectedFormat] = useState<Format>('Whole Bean');
  const [cartAnimating, setCartAnimating] = useState(false);

  // ── Pointer physics (inner wrapper only, no conflict with scroll) ─────────────
  useEffect(() => {
    if (!isActive) return;

    let reqId: number;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch) return; // disable on mobile

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionMult = prefersReducedMotion ? 0.2 : 1.0;

    let lastX = -9999;
    let lastY = -9999;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      const { pointer } = useExperienceStore.getState();

      if (pointer.x !== -9999 && pointer.x !== -1000) {
        if (lastX === -9999) {
          lastX = pointer.x;
          lastY = pointer.y;
        } else {
          const dx = (pointer.x - lastX) / window.innerWidth;
          const dy = (pointer.y - lastY) / window.innerHeight;
          targetX += dx * 4;
          targetY += dy * 4;
          lastX = pointer.x;
          lastY = pointer.y;
        }
      }

      // Damped decay — returns to zero when pointer stops
      targetX *= 0.90;
      targetY *= 0.90;

      // Hard limits: x ±8px, y ±6px, rotation ±2deg
      const cx = Math.max(-1, Math.min(1, targetX)) * motionMult;
      const cy = Math.max(-1, Math.min(1, targetY)) * motionMult;

      if (productInnerRef.current) {
        gsap.set(productInnerRef.current, {
          x: cx * 8,
          y: cy * 6,
          rotationY: cx * 2,
          rotationX: cy * -2,
          rotationZ: cx * 2,
        });
      }

      reqId = requestAnimationFrame(render);
    };

    reqId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqId);
  }, [isActive]);

  // ── ScrollTrigger animations ───────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = window;

    ScrollTrigger.getAll()
      .filter(t => t.vars.trigger && t.vars.trigger.toString().includes('st-shop'))
      .forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {

      // 1. CUP → PRODUCT TRANSITION (Journey mode only)
      if (isJourney) {
        const transTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.st-shop-trans',
            scroller,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
        // 0%: cup dominant (handled by Brew exit)
        // 20%: cup +5% scale handled by Brew
        // 35%: camera pulls back
        transTl.to('.st-cup-main', { scale: 0.6, y: '-10vh', duration: 0.35, ease: 'power1.inOut' }, 0.20);
        // 45%: package enters from below
        transTl.fromTo('.st-shop-product-wrapper',
          { y: '40vh', opacity: 0, scale: 0.90, rotation: -2 },
          { y: '0vh', opacity: 1, scale: 1.0, rotation: 0, duration: 0.35, ease: 'power2.out', immediateRender: false },
          0.35
        );
        // 75%: cup recedes
        transTl.to('.st-cup-main', { opacity: 0, scale: 0.4, duration: 0.25, ease: 'power1.in' }, 0.60);
        // 90–100%: package dominant, Shop takes control
      }

      // 2. SHOP HERO — product reveal & information sequence
      const shopTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.st-shop-hero',
          scroller,
          end: '+=150%',
          scrub: 1,
          onEnter: () => { if (isActive) useExperienceStore.getState().setActiveWorld('shop'); },
          onEnterBack: () => { if (isActive) useExperienceStore.getState().setActiveWorld('shop'); },
        },
      });

      if (!isJourney) {
        // Standalone: hero entry — scale 0.90, y 35px, rotation -2deg → settled
        shopTl.fromTo('.st-shop-product-wrapper',
          { y: '35px', scale: 0.90, rotation: -2, opacity: 0 },
          { y: '0px', scale: 1.0, rotation: 0, opacity: 1, duration: 0.25, ease: 'power1.out', immediateRender: false },
          0
        );
      }

      // Product label
      shopTl.fromTo('.st-shop-label-content',
        { opacity: 0, y: '8px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        isJourney ? 0.05 : 0.2
      );

      // Sequential information reveal — each after previous is established
      shopTl.fromTo('.st-shop-name',
        { opacity: 0, y: '12px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        0.35
      );
      shopTl.fromTo('.st-shop-desc',
        { opacity: 0, y: '12px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        0.55
      );
      shopTl.fromTo('.st-shop-price',
        { opacity: 0, y: '12px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        0.70
      );
      shopTl.fromTo('.st-shop-format',
        { opacity: 0, y: '12px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        0.82
      );
      shopTl.fromTo('.st-shop-action',
        { opacity: 0, y: '12px' },
        { opacity: 1, y: '0px', duration: 0.2, ease: 'power1.out', immediateRender: false },
        0.94
      );

      // 3. SUPPORTING PRODUCTS — staggered reveal, not simultaneous
      ScrollTrigger.create({
        trigger: '.st-shop-secondary',
        scroller,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.st-shop-secondary',
            { scale: 0.96, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
          );
        },
      });

      ScrollTrigger.create({
        trigger: '.st-shop-tertiary',
        scroller,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo('.st-shop-tertiary',
            { y: '20px', opacity: 0 },
            { y: '0px', opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 }
          );
        },
      });

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  // ── Add to Cart interaction ────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (cartAnimating) return;
    setCartAnimating(true);

    // Product: scale 1 → 0.985 → 1
    if (productWrapperRef.current) {
      gsap.to(productWrapperRef.current, {
        scale: 0.985,
        duration: 0.1,
        ease: 'power1.in',
        onComplete: () => {
          gsap.to(productWrapperRef.current!, { scale: 1, duration: 0.15, ease: 'power1.out' });
        },
      });
    }

    // Button: y 0 → 1px → 0
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        y: 1,
        duration: 0.1,
        ease: 'power1.in',
        onComplete: () => {
          gsap.to(btnRef.current!, { y: 0, duration: 0.12, ease: 'power1.out' });
        },
      });
    }

    useExperienceStore.getState().addToCart({
      id: `ethiopian-heirloom-${selectedFormat.toLowerCase().replace(' ', '-')}`,
      name: `Ethiopian Heirloom — ${selectedFormat}`,
      price: 24,
      quantity: 1,
    });

    setTimeout(() => setCartAnimating(false), 400);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isJourney ? '-mt-[50vh]' : ''}`}
      data-world="shop"
      style={{ zIndex: 40, backgroundColor: 'transparent' }}
    >
      {/* TRANSITION OVERLAP ZONE */}
      <div className="st-shop-trans w-full h-[50vh] relative pointer-events-none" />

      {/* ── SHOP HERO ─────────────────────────────────────────────────────── */}
      <div className="st-shop-hero w-full min-h-screen relative bg-[#F2F0EB] overflow-hidden z-10">
        
        {/* Contact shadow — grounding the product */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#E8E4DC]/60 to-transparent pointer-events-none z-0" />

        <div className="relative w-full h-full min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-[8%] pt-20 pb-16 md:py-0 gap-8 md:gap-0">

          {/* ── PRODUCT SIDE ─────────────────────────────────────────────── */}
          <div className="w-full md:w-1/2 h-[55vw] md:h-screen flex items-center justify-center relative"
               style={{ perspective: '1200px' }}>
            {/* OUTER: scroll transform lives here */}
            <div
              ref={productWrapperRef}
              className="st-shop-product-wrapper relative w-[75vw] md:w-[34vw] max-w-[420px] aspect-[4/5] pointer-events-auto"
              style={{ opacity: isJourney ? 1 : 0 }}
            >
              {/* INNER: pointer physics lives here — no conflict with ScrollTrigger */}
              <div
                ref={productInnerRef}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={SHOP_IMAGES.product.url}
                  alt={SHOP_IMAGES.product.alt}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                  style={{ objectPosition: SHOP_IMAGES.product.position }}
                />

                {/* Subtle contact shadow beneath product */}
                <div className="absolute -bottom-4 left-[10%] right-[10%] h-8 bg-[#3B2516]/15 blur-[12px] rounded-full" />

                {/* Editorial label — no glass card */}
                <div className="st-shop-label-content absolute bottom-[6%] left-[-4%] md:left-[-12%] w-[92%] bg-[#F2F0EB] px-5 py-4 flex flex-col gap-1 z-20 border-t border-[#3B2516]/10">
                  <h3 className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#3B2516]/60">Single Origin · Ethiopia</h3>
                  <h2 className="font-display text-2xl md:text-3xl tracking-tighter text-[#1A100C] uppercase leading-[0.9]">Ethiopian<br/>Heirloom</h2>
                </div>
              </div>
            </div>
          </div>

          {/* ── INFORMATION SIDE ─────────────────────────────────────────── */}
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-5 md:gap-7 z-20 md:pl-[4%] pointer-events-auto">

            {/* Product name */}
            <div className="st-shop-name" style={{ opacity: 0 }}>
              <h1 className="font-display text-[13vw] md:text-[5.5vw] tracking-tighter uppercase text-[#1A100C] leading-[0.82] mix-blend-multiply">
                Ethiopian<br/><span className="text-[#1A100C]/65">Heirloom</span>
              </h1>
            </div>

            {/* Description */}
            <div className="st-shop-desc" style={{ opacity: 0 }}>
              <p className="font-sans text-sm md:text-[15px] text-[#1A100C]/65 leading-relaxed max-w-[380px] tracking-wide">
                Cultivated at 2,000m in Yirgacheffe. Slow, fully-washed process. Distinct notes of bergamot, jasmine, and wild honey.
              </p>
            </div>

            {/* Price */}
            <div className="st-shop-price flex items-baseline gap-4" style={{ opacity: 0 }}>
              <span className="font-display text-[10vw] md:text-[4vw] text-[#1A100C] tracking-tighter leading-none">$24</span>
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#1A100C]/50">250g</span>
            </div>

            {/* Format selection */}
            <div className="st-shop-format flex flex-col gap-2" style={{ opacity: 0 }}>
              <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#1A100C]/45">Format</span>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFormat(f)}
                    className={[
                      'h-10 px-4 font-sans text-[10px] uppercase tracking-widest transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A100C]',
                      selectedFormat === f
                        ? 'bg-[#1A100C] text-[#F2F0EB]'
                        : 'border border-[#3B2516]/25 text-[#1A100C]/70 hover:border-[#3B2516]/50',
                    ].join(' ')}
                    style={{ transitionDuration: '200ms' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="st-shop-action" style={{ opacity: 0 }}>
              <button
                ref={btnRef}
                onClick={handleAddToCart}
                className="bg-[#1A100C] text-[#F2F0EB] font-sans uppercase tracking-[0.2em] text-[10px] h-14 px-12 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A100C] active:scale-[0.985]"
              >
                {cartAnimating ? 'Added' : 'Add to Cart'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── SUPPORTING PRODUCTS — Asymmetric, different sizes ─────────────────── */}
      <div className="w-full min-h-[80vh] bg-[#F2F0EB] relative z-10 px-6 md:px-[8%] py-20 md:py-32 overflow-hidden">
        <div className="w-full mb-14 md:mb-24">
          <h3 className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#3B2516]/50">Explore the Roastery</h3>
        </div>

        {/* Asymmetric grid — primary visual dominance preserved */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">

          {/* Secondary — medium, offset right */}
          <div className="st-shop-secondary md:col-span-5 md:col-start-7 flex flex-col gap-5 md:mt-20 pointer-events-auto group"
               style={{ opacity: 0 }}>
            <div className="w-full aspect-[4/5] overflow-hidden bg-transparent relative">
              <img
                src={SHOP_IMAGES.product.url}
                loading="lazy"
                decoding="async"
                alt="Colombian Supremo"
                className="w-full h-full object-cover mix-blend-multiply opacity-75 transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: SHOP_IMAGES.product.position }}
              />
            </div>
            <div>
              <h4 className="font-display text-xl md:text-2xl uppercase tracking-tighter text-[#1A100C] transition-transform duration-300 group-hover:-translate-y-[2px]">Colombian Supremo</h4>
              <p className="font-sans text-[10px] tracking-widest text-[#1A100C]/55 mt-2 uppercase">$22 &middot; 250g</p>
            </div>
          </div>

          {/* Tertiary — smaller, offset left, lower */}
          <div className="st-shop-tertiary md:col-span-3 md:col-start-2 flex flex-col gap-4 md:-mt-24 pointer-events-auto group"
               style={{ opacity: 0 }}>
            <div className="w-full aspect-square overflow-hidden bg-transparent relative">
              <img
                src={SHOP_IMAGES.product.url}
                loading="lazy"
                decoding="async"
                alt="Guatemalan Antigua"
                className="w-full h-full object-cover mix-blend-multiply opacity-70 transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ objectPosition: SHOP_IMAGES.product.position }}
              />
            </div>
            <div>
              <h4 className="font-display text-base md:text-lg uppercase tracking-tighter text-[#1A100C] transition-transform duration-300 group-hover:-translate-y-[2px]">Guatemalan Antigua</h4>
              <p className="font-sans text-[10px] tracking-widest text-[#1A100C]/55 mt-2 uppercase">$26 &middot; 250g</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── QUIET ENDING ───────────────────────────────────────────────────────── */}
      <div className="w-full h-[65vh] bg-[#F2F0EB] relative z-10 flex flex-col items-center justify-center text-center px-6">
        <span className="font-sans text-[9px] tracking-[0.45em] uppercase text-[#1A100C]/35 mb-8">Experience Complete</span>
        <h2 className="font-display text-[11vw] md:text-[5.5vw] uppercase tracking-tighter text-[#1A100C] opacity-88 leading-none">
          Your Ritual<br/>Awaits
        </h2>
      </div>
    </div>
  );
}
