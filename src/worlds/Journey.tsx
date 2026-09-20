import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '../experience/store';
import Origin from './Origin';
import Roast from './Roast';
import Brew from './Brew';
import Shop from './Shop';

export default function Journey() {
  const setGlobalProgress = useExperienceStore(s => s.setGlobalProgress);
  const scroll = useExperienceStore(s => s.scroll);
  const globalVelocity = useExperienceStore(s => s.globalVelocity);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // POINTER INTERACTION
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    let handlePointerMove: (() => void) | null = null;

    let ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: '#journey-container',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setGlobalProgress(self.progress);
        }
      });

      if (!isTouch && containerRef.current) {
        const motionMult = prefersReducedMotion ? 0.3 : 1.0;
        
        const mainX = gsap.quickTo('.depth-main', 'x', { duration: 0.8, ease: 'power2.out' });
        const mainY = gsap.quickTo('.depth-main', 'y', { duration: 0.8, ease: 'power2.out' });
        const mainRot = gsap.quickTo('.depth-main', 'rotation', { duration: 0.8, ease: 'power2.out' });
        
        // Foreground object: slower spring return
        const fgX = gsap.quickTo('.depth-fg', 'x', { duration: 1.2, ease: 'elastic.out(1, 0.75)' });
        const fgY = gsap.quickTo('.depth-fg', 'y', { duration: 1.2, ease: 'elastic.out(1, 0.75)' });
        const fgRot = gsap.quickTo('.depth-fg', 'rotation', { duration: 1.2, ease: 'elastic.out(1, 0.75)' });

        const heroX = gsap.quickTo('.st-hero-subject-img', 'x', { duration: 0.8, ease: 'power2.out' });
        const heroY = gsap.quickTo('.st-hero-subject-img', 'y', { duration: 0.8, ease: 'power2.out' });
        const heroScale = gsap.quickTo('.st-hero-subject-img', 'scale', { duration: 0.8, ease: 'power2.out' });

        const typeX = gsap.quickTo('.depth-type', 'x', { duration: 0.8, ease: 'power2.out' });

        let lastX = -1000;
        let lastY = -1000;
        let targetX = 0;
        let targetY = 0;

        handlePointerMove = () => {
           const { pointer } = useExperienceStore.getState();
           if (pointer.x === -1000) return;

           if (lastX === -1000) {
             lastX = pointer.x;
             lastY = pointer.y;
             return;
           }

           const dx = (pointer.x - lastX) / window.innerWidth;
           const dy = (pointer.y - lastY) / window.innerHeight;
           
           targetX += dx * 5; 
           targetY += dy * 5;

           lastX = pointer.x;
           lastY = pointer.y;

           // Decay back to 0 (settles when pointer stops)
           targetX *= 0.92;
           targetY *= 0.92;

           // Clamp to [-1, 1]
           const cx = Math.max(-1, Math.min(1, targetX)) * motionMult;
           const cy = Math.max(-1, Math.min(1, targetY)) * motionMult;

           const state = useExperienceStore.getState();
           const isCup = state.activeWorld === 'brew' && state.brewProgress > 0.8;
           const ptrMult = isCup ? 0.4 : 1.0;
           const typeMult = isCup ? 0.3 : 1.0;

           // Main coffee object (max ±6px, ±5px, ±1.5deg)
           mainX(cx * 6 * ptrMult);
           mainY(cy * 5 * ptrMult);
           mainRot(cx * 1.5 * ptrMult);

           // Foreground object (max ±10px, ±8px, ±2deg)
           fgX(cx * 10 * ptrMult);
           fgY(cy * 8 * ptrMult);
           fgRot(cx * 2 * ptrMult);
           
           // Hero image subtle response (x ±3px, y ±2px, scale +0.5%)
           heroX(cx * 3);
           heroY(cy * 2);
           const mag = Math.sqrt(cx*cx + cy*cy);
           heroScale(1 + Math.min(1, mag) * 0.005);

           typeX(cx * -15 * typeMult);
        };

        gsap.ticker.add(handlePointerMove);
      }

      // SPATIAL STAGE (Scroll-linked Parallax)
      const pBg = gsap.utils.toArray('.global-parallax.depth-bg');
      pBg.forEach((el: any) => {
        gsap.to(el, { y: (i, t) => prefersReducedMotion ? 0 : -ScrollTrigger.maxScroll(window) * 0.55, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      const pFg = gsap.utils.toArray('.global-parallax.depth-fg');
      pFg.forEach((el: any) => {
        gsap.to(el, { y: (i, t) => prefersReducedMotion ? 0 : ScrollTrigger.maxScroll(window) * 0.30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      const globalTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#journey-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      });
      globalTl.fromTo('.st-global-travel-text', 
        { y: '-30vh', x: '0px' }, 
        { y: '30vh', x: '10px', ease: 'none' }
      );
    }, containerRef);

    return () => {
      if (handlePointerMove) {
        gsap.ticker.remove(handlePointerMove);
      }
      ctx.revert();
    };
  }, [setGlobalProgress]);

  // SCROLL VELOCITY IMPULSE (React side)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 11. Fast scrolling impulse
    if (Math.abs(globalVelocity) > 5) {
       const intensity = Math.min(1, Math.abs(globalVelocity) / 50);
       gsap.to('.depth-fg', { y: `+=${intensity * 15}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-fg', { y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.depth-type', { x: `+=${(Math.random() > 0.5 ? 1 : -1) * intensity * 8}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-type', { x: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.depth-main', { y: `+=${intensity * 4}px`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.depth-main', { y: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
       
       gsap.to('.st-global-travel-text', { x: `+=${intensity * 15}px`, rotate: `-=${intensity * 2}deg`, duration: 0.1, overwrite: 'auto' });
       gsap.to('.st-global-travel-text', { x: 0, rotate: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
    }
  }, [globalVelocity]);

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
