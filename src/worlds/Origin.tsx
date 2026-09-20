import React, { useRef, useEffect } from 'react';
import { useExperienceStore } from '../experience/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ORIGIN_IMAGES } from '../assets/images';

gsap.registerPlugin(ScrollTrigger);

interface OriginProps {
  isJourney?: boolean;
}

export default function Origin({ isJourney }: OriginProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFork = useExperienceStore(s => s.activeFork);
  const setScroll = useExperienceStore(s => s.setScroll);
  
  const isActive = isJourney || activeFork === 'origin';

  useEffect(() => {
    if (!containerRef.current || !isActive) return;
    const scroller = window;
    
    // Cleanup any existing scrolltriggers for this pin
    ScrollTrigger.getAll().filter(t => t.vars.trigger === '.st-hero-pin' && t.scroller === scroller).forEach(t => t.kill());

    const mm = gsap.matchMedia(scroller);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. ENTRY LOAD (Staggered timing)
      const introTl = gsap.timeline();
      
      introTl.fromTo('.st-entry-logo', 
        { opacity: 0, y: '-20vh' }, 
        { opacity: 1, y: '0vh', duration: 1.0, ease: 'power3.out', immediateRender: false }, 0);
      
      introTl.fromTo('.st-hero-title-line', 
        { y: '100%' }, 
        { y: '0%', duration: 1.0, stagger: 0.1, ease: 'power3.out', immediateRender: false }, 0.2);

      introTl.fromTo('.st-hero-subject-container',
        { scale: 0.9 },
        { scale: 1.0, duration: 1.2, ease: 'power2.out', immediateRender: false }, 0.1);
        
      introTl.fromTo(['.st-entry-meta-top', '.st-entry-meta-bottom'],
        { opacity: 0, y: '16px' },
        { opacity: 1, y: '0px', duration: 0.8, stagger: 0.1, ease: 'power2.out', immediateRender: false }, 0.4);

      // 2. FIRST 300PX
      const first300Tl = gsap.timeline({
        scrollTrigger: {
          trigger: isJourney ? '.st-hero-pin' : null,
          scroller: scroller,
          start: isJourney ? 'top top' : '0',
          end: isJourney ? '+=300px' : '300px', 
          scrub: true
        }
      });

      // Treating total duration as 300 to map directly to px
      first300Tl.fromTo('.st-hero-subject-container', { scale: 1.0 }, { scale: 1.02, duration: 75, ease: 'none', immediateRender: false }, 0);
      first300Tl.fromTo('.st-hero-title-container', { y: '0vh' }, { y: '-2vh', duration: 45, ease: 'none', immediateRender: false }, 75); // 75 to 120
      first300Tl.fromTo(['.st-entry-meta-top', '.st-entry-meta-bottom'], { y: '0vh' }, { y: '-3vh', duration: 50, ease: 'none', immediateRender: false }, 120); // 120 to 170
      first300Tl.fromTo('.st-hero-subject-container', { scale: 1.02 }, { scale: 1.05, duration: 50, ease: 'none', immediateRender: false }, 170); // 170 to 220
      first300Tl.fromTo('.st-hero-title-container', { scale: 1.0 }, { scale: 1.03, duration: 80, ease: 'none', immediateRender: false }, 220); // 220 to 300
      first300Tl.fromTo('.st-foreground-bean', { x: '0vw' }, { x: '2vw', duration: 80, ease: 'none', immediateRender: false }, 220); // 220 to 300

      // Main Pinned Timeline (400vh for long scroll)
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: isJourney ? '.st-hero-pin' : null,
          scroller: scroller,
          start: isJourney ? 'top top' : '0',
          end: isJourney ? '+=400%' : '400vh', 
          scrub: 1,
          pin: isJourney ? true : false,
          anticipatePin: 1,
          onEnter: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          },
          onEnterBack: () => {
            if (isActive) useExperienceStore.getState().setActiveWorld('origin');
          }
        }
      });
      
      // 3. ORIGIN CAMERA PUSH (over progress 0->1)
      pinTl.fromTo('.st-hero-subject-img',
        { scale: 1.0, objectPosition: '70% 30%' },
        { scale: 1.15, objectPosition: '68% 26%', ease: 'none', duration: 1.0, immediateRender: false }, 0);

      // 4. HEADLINE SPLIT (over progress 0->1)
      pinTl.fromTo('.st-title-line-1', { y: '0vh', x: '0vw' }, { y: '-5vh', x: '-1vw', ease: 'none', duration: 1.0, immediateRender: false }, 0);
      pinTl.fromTo('.st-title-line-2', { y: '0vh', x: '0vw' }, { y: '-7vh', x: '1vw', ease: 'none', duration: 1.0, immediateRender: false }, 0);
      pinTl.fromTo('.st-title-line-3', { y: '0vh', x: '0vw' }, { y: '-9vh', x: '2vw', ease: 'none', duration: 1.0, immediateRender: false }, 0);

      // 5. ORIGIN OBJECT
      pinTl.fromTo('.st-foreground-bean', 
        { x: '-10vw', rotation: -2 },
        { x: '0vw', rotation: 2, ease: 'none', duration: 0.5, immediateRender: false }, 0);
      pinTl.to('.st-foreground-bean', 
        { x: '8vw', rotation: 0, ease: 'none', duration: 0.5, immediateRender: false }, 0.5);

      // 6. ORIGIN -> ROAST TRANSITION
      pinTl.to('.st-hero-subject-container', { scale: 1.04, ease: 'none', duration: 0.15, immediateRender: false }, 0.20);
      pinTl.to('.st-hero-subject-container', { clipPath: 'inset(10% 15% 10% 15%)', ease: 'power1.inOut', duration: 0.10, immediateRender: false }, 0.35);
      pinTl.to('.st-hero-title-container', { opacity: 0, y: '-20vh', ease: 'power1.in', duration: 0.10, immediateRender: false }, 0.45);
      
      // Organic mask starts around focal point revealing Roast background
      pinTl.fromTo('.st-origin-content-wrapper',
        { clipPath: 'circle(150% at 70% 30%)' },
        { clipPath: 'circle(0% at 70% 30%)', ease: 'power2.inOut', duration: 0.45, immediateRender: false }, 0.55);

      // 65% Roast visual appears inside mask (The placeholder opacity fades in)
      pinTl.fromTo('.st-roast-placeholder', { opacity: 0 }, { opacity: 1, ease: 'power1.in', duration: 0.25, immediateRender: false }, 0.65);
      
      // 80% Origin image <= 35% visible (Handled by the shrinking clipPath on wrapper)
      // 90% Roast visual dominant (Placeholder is fully opaque)
      // 100% Origin fully gone (Wrapper clipPath is 0%)

    });

    return () => mm.revert();
  }, [isActive, isJourney]);

  return (
    <div ref={containerRef} className={`relative w-full ${isJourney ? '' : ''}`} data-world="origin" style={{ zIndex: 10 }}>
      <div className="st-hero-pin w-full h-screen relative overflow-hidden bg-transparent">
        <div className="drift-entry-stage w-full h-full relative">
          
          {/* Roast Placeholder (Layered below Origin content) */}
          <div className="absolute inset-0 z-0 pointer-events-none st-roast-placeholder flex items-center justify-center bg-[#E3E8E0]">
            {/* Visual representing roast, matching the clean editorial aesthetic */}
            <div className="absolute top-[20%] right-[10%] text-[#5C3A21]/20 font-display text-[20vw] opacity-30 pointer-events-none">ROAST</div>
          </div>

          {/* Origin Content Wrapper (Subject to organic mask) */}
          <div className="absolute inset-0 z-10 st-origin-content-wrapper overflow-hidden bg-[#F2F0EB]">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* ENTRY VISUALS */}
            <div className="absolute top-[8%] md:top-[12%] left-[6%] md:left-[10%] z-[35] flex flex-col items-start pointer-events-none w-[85%] md:w-[75%]">
              <h1 className="st-entry-logo text-[25vw] md:text-[22vw] font-display uppercase tracking-[-0.04em] leading-none text-drift-foreground mix-blend-difference text-white" style={{ transformOrigin: 'left center' }}>
                DRIFT
              </h1>
              <div className="st-entry-meta-top flex items-center gap-4 md:gap-6 mt-4 md:mt-8">
                <div className="h-[1px] w-12 md:w-24 bg-white/60 mix-blend-difference" />
                <p className="text-[9px] md:text-sm font-sans text-white/90 tracking-[0.25em] uppercase mix-blend-difference">
                  Coffee changes the pace of a room.
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 left-[6%] md:bottom-16 md:left-[10%] z-[35] st-entry-meta-bottom pointer-events-none">
              <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-drift-foreground-muted mix-blend-difference text-white/70">
                Single Origin · Hand Picked
              </p>
            </div>

            {/* ORIGIN HERO VISUALS */}
            <div className="absolute top-[22%] left-[6%] md:left-[8%] z-20 flex flex-col items-start pointer-events-none depth-type st-hero-title-container">
              <div className="text-[14vw] md:text-[13vw] leading-[0.8] font-display uppercase tracking-tighter text-drift-foreground mix-blend-difference opacity-95 text-white">
                <div className="overflow-hidden"><div className="st-hero-title-line st-title-line-1">ETHIOPIAN</div></div>
                <div className="overflow-hidden pl-4 md:pl-12"><div className="st-hero-title-line st-title-line-2">HEIRLOOM</div></div>
                <div className="overflow-hidden pl-8 md:pl-24"><div className="st-hero-title-line st-title-line-3 text-white/70">COFFEE</div></div>
              </div>
            </div>

            {/* Large primary image - Cinematic intentional crop */}
            <div className="absolute top-[10%] md:top-[5%] right-[5%] md:right-[8%] z-10 w-[85vw] md:w-[55vw] h-[75vh] md:h-[90vh] st-hero-subject-container overflow-hidden pointer-events-none shadow-2xl depth-main">
              <img
                src={ORIGIN_IMAGES.hero.url}
                alt={ORIGIN_IMAGES.hero.alt}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                className="w-full h-full object-cover grayscale-[0.1] st-hero-subject-img origin-center"
                style={{ objectPosition: ORIGIN_IMAGES.hero.position }}
              />
            </div>

            {/* Asymmetric Metadata */}
            <div className="absolute inset-0 z-30 pointer-events-none mix-blend-difference text-white st-hero-metadata">
              <div className="absolute bottom-[8%] md:bottom-[12%] right-[10%] md:right-[15%] text-right st-meta-altitude">
                <p className="text-[9px] md:text-[11px] tracking-[0.35em] font-sans uppercase mb-2 md:mb-3 opacity-60">Elevation</p>
                <p className="text-4xl md:text-6xl font-display">1,900M</p>
              </div>
              <div className="absolute top-[65%] md:top-[55%] left-[6%] md:left-[10%] text-left st-meta-varietal">
                <p className="text-[9px] md:text-[11px] tracking-[0.35em] font-sans uppercase mb-2 md:mb-3 opacity-60">Process</p>
                <p className="text-4xl md:text-6xl font-display">Natural</p>
              </div>
            </div>
          </div>

          {/* Cross-world object */}
          <div className="absolute top-[75%] md:top-2/3 right-[25%] md:right-[35%] z-40 w-32 h-32 md:w-56 md:h-56 opacity-95 st-foreground-bean pointer-events-none drop-shadow-2xl depth-fg">
             <img
               src={ORIGIN_IMAGES.greenBean.url}
               alt={ORIGIN_IMAGES.greenBean.alt}
               loading="lazy"
               decoding="async"
               className="w-full h-full object-cover rounded-full mix-blend-darken"
               style={{ objectPosition: ORIGIN_IMAGES.greenBean.position }}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
