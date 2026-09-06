import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '../experience/store';
import Origin from './Origin';
import Roast from './Roast';
import Brew from './Brew';
import Shop from './Shop';
import Lenis from 'lenis';
import { useScrollVelocity } from '../reactive/useScrollVelocity';

export default function Journey() {
  const setGlobalProgress = useExperienceStore(s => s.setGlobalProgress);
  const scroll = useExperienceStore(s => s.scroll);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Velocity impulse tracking
  const rawVelocity = useScrollVelocity(scroll);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: '#journey-container',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setGlobalProgress(self.progress);
      }
    });

    // POINTER INTERACTION
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    let handlePointerMove: ((e: MouseEvent) => void) | null = null;

    if (!isTouch && containerRef.current) {
      const mainX = gsap.quickTo('.depth-main', 'x', { duration: 0.6, ease: 'power3.out' });
      const mainY = gsap.quickTo('.depth-main', 'y', { duration: 0.6, ease: 'power3.out' });
      
      const fgX = gsap.quickTo('.depth-fg', 'x', { duration: 0.4, ease: 'power3.out' });
      const fgY = gsap.quickTo('.depth-fg', 'y', { duration: 0.4, ease: 'power3.out' });
      const fgRot = gsap.quickTo('.depth-fg', 'rotation', { duration: 0.4, ease: 'power3.out' });

      const typeX = gsap.quickTo('.depth-type', 'x', { duration: 0.8, ease: 'power2.out' });

      handlePointerMove = (e: MouseEvent) => {
         const x = (e.clientX / window.innerWidth - 0.5) * 2;
         const y = (e.clientY / window.innerHeight - 0.5) * 2;

         // Evaluate dynamic multiplier every frame
         const isCup = useExperienceStore.getState().activeWorld === 'brew' && useExperienceStore.getState().brewProgress > 0.8;
         const ptrMult = isCup ? 0.4 : 1.0;
         const typeMult = isCup ? 0.3 : 1.0;

         mainX(x * 6 * ptrMult);
         mainY(y * 5 * ptrMult);

         fgX(x * 10 * ptrMult);
         fgY(y * 8 * ptrMult);
         fgRot(x * 2 * ptrMult);

         typeX(x * -15 * typeMult);
      };
      window.addEventListener('mousemove', handlePointerMove);
    }

    // SPATIAL STAGE (Scroll-linked Parallax)
    // Environment: 0.25x, Background: 0.45x, Secondary: 0.75x, Main: 1.0x (default), Typography: 1.10x, Foreground: 1.30x
    // GSAP ScrollTrigger can apply basic y movement to all elements with these classes.
    // However, since many elements are inside pinned containers, standard y-transforms might fight with inner timelines.
    // For elements NOT part of a pinned timeline, we can do this. If they are pinned, it's safer to control them in their respective timelines.
    // For now, let's keep the classes as descriptive markers and only apply global parallax if they have `.global-parallax`.
    const pBg = gsap.utils.toArray('.global-parallax.depth-bg');
    pBg.forEach((el: any) => {
      gsap.to(el, { y: (i, t) => -ScrollTrigger.maxScroll(window) * 0.55, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    const pFg = gsap.utils.toArray('.global-parallax.depth-fg');
    pFg.forEach((el: any) => {
      gsap.to(el, { y: (i, t) => ScrollTrigger.maxScroll(window) * 0.30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    const globalTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#journey-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
    // 19. GLOBAL OBJECT TRAVEL (Typography)
    // Moves slowly down the left edge, rotating slightly over the entire journey
    globalTl.fromTo('.st-global-travel-text', 
      { y: '-30vh', x: '0px' }, 
      { y: '30vh', x: '10px', ease: 'none' }
    );

    return () => {
      if (handlePointerMove) {
        window.removeEventListener('mousemove', handlePointerMove);
      }
      st.kill();
      globalTl.kill();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setGlobalProgress]);

  // SCROLL VELOCITY IMPULSE (React side)
  useEffect(() => {
    // 11. Fast scrolling impulse
    if (Math.abs(rawVelocity) > 5) {
       const intensity = Math.min(1, Math.abs(rawVelocity) / 50);
       gsap.to('.depth-fg', { y: `+=${intensity * 15}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-fg', { y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.depth-type', { x: `+=${(Math.random() > 0.5 ? 1 : -1) * intensity * 8}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-type', { x: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.depth-main', { y: `+=${intensity * 4}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-main', { y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.st-global-travel-text', { x: `+=${intensity * 15}px`, rotate: `-=${intensity * 2}deg`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.st-global-travel-text', { x: 0, rotate: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
    }
  }, [rawVelocity]);

  return (
    <div ref={containerRef} id="journey-container" className="w-full relative bg-transparent pointer-events-auto overflow-hidden">
      
      {/* Global Traveling Typography */}
      <div className="fixed top-1/2 left-6 z-[60] pointer-events-none mix-blend-difference text-white/40 font-display text-4xl sm:text-6xl uppercase tracking-widest origin-left -translate-y-1/2 -rotate-90 opacity-80 depth-type flex items-center gap-8">
        <span className="st-global-travel-text inline-block">DRIFT</span>
        <span className="st-global-travel-text inline-block">COFFEE</span>
      </div>

      <Origin isJourney={true} />
      <Roast isJourney={true} />
      <Brew isJourney={true} />
      <Shop isJourney={true} />
    </div>
  );
}
