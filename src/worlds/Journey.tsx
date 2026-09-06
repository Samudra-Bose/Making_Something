import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      smoothWheel: true,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // Global progress tracker
    const st = ScrollTrigger.create({
      trigger: '#journey-container',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setGlobalProgress(self.progress);
      }
    });

    return () => {
      st.kill();
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setGlobalProgress]);

  return (
    <div id="journey-container" className="w-full relative bg-transparent pointer-events-auto overflow-hidden">
      <Origin isJourney={true} />
      {/* 
        To make transitions smooth, they can naturally overlap if they use sticky positioning.
        Roast, Brew, and Shop will render immediately after one another.
      */}
      <Roast isJourney={true} />
      <Brew isJourney={true} />
      <Shop isJourney={true} />
    </div>
  );
}
