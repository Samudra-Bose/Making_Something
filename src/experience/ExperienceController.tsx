import { useEffect } from 'react';
import { useExperienceStore } from './store';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ExperienceController is the SINGLE source of truth for pointer and scroll tracking.
// It manages the global Lenis instance to provide a unified scroll experience.

export default function ExperienceController() {
  const { setPointer, setPointerVelocity, setScroll, setGlobalVelocity } = useExperienceStore();

  // Pointer tracking
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      setPointer(e.clientX, e.clientY);
      
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const vx = (e.clientX - lastX) / dt;
        const vy = (e.clientY - lastY) / dt;
        setPointerVelocity(vx, vy);
      }
      
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      setPointer(touch.clientX, touch.clientY);
    };

    // Velocity decay when no movement
    const tick = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 120) {
        setPointerVelocity(0, 0);
      }
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(frameId);
    };
  }, [setPointer, setPointerVelocity]);

  // Global Scroll tracking (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
    });

    lenis.on('scroll', (e: any) => {
      setScroll(e.scroll);
      setGlobalVelocity(e.velocity);
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [setScroll, setGlobalVelocity]);

  return null;
}
