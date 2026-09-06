import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperienceStore } from '../experience/store';
import Origin from './Origin';
import Roast from './Roast';
import Brew from './Brew';
import Shop from './Shop';
import Lenis from 'lenis';

export default function Journey() {
  const setGlobalProgress = useExperienceStore(s => s.setGlobalProgress);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 22. SCROLL CONTAINER - NON-NEGOTIABLE
    // ONE continuous primary vertical scroll on normal desktop/mobile
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

    // 18. POINTER INTERACTION (Desktop only)
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    let xTo: gsap.QuickToFunc;
    let yTo: gsap.QuickToFunc;
    let rotTo: gsap.QuickToFunc;

    if (!isTouch && containerRef.current) {
      xTo = gsap.quickTo('.st-foreground-bean, .st-roast-bean', 'x', { duration: 0.6, ease: 'power3.out' });
      yTo = gsap.quickTo('.st-foreground-bean, .st-roast-bean', 'y', { duration: 0.6, ease: 'power3.out' });
      rotTo = gsap.quickTo('.st-foreground-bean, .st-roast-bean', 'rotation', { duration: 0.6, ease: 'power3.out' });

      const handlePointerMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        xTo(nx * 10);
        yTo(ny * 8);
        rotTo(nx * 2);
      };

      window.addEventListener('mousemove', handlePointerMove);
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        st.kill();
        lenis.destroy();
        gsap.ticker.remove(lenis.raf);
      };
    }

    return () => {
      st.kill();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setGlobalProgress]);

  return (
    <div ref={containerRef} id="journey-container" className="w-full relative bg-transparent pointer-events-auto overflow-hidden">
      <Origin isJourney={true} />
      <Roast isJourney={true} />
      <Brew isJourney={true} />
      <Shop isJourney={true} />
    </div>
  );
}
