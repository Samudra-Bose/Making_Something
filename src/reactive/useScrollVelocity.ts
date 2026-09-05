import { useRef, useEffect, useState } from 'react';

export function useScrollVelocity(scrollPos: number) {
  const [velocity, setVelocity] = useState(0);
  const prevScroll = useRef(scrollPos);
  const prevTime = useRef(performance.now());
  const velocityRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    
    const updateVelocity = () => {
      const currentScroll = scrollPos;
      const currentTime = performance.now();
      const dt = currentTime - prevTime.current;
      
      if (dt > 0) {
        const dist = currentScroll - prevScroll.current;
        const instVelocity = dist / dt; // px per ms
        
        // Smooth the velocity
        velocityRef.current = velocityRef.current * 0.8 + instVelocity * 0.2;
        setVelocity(Math.abs(velocityRef.current));
      }
      
      prevScroll.current = currentScroll;
      prevTime.current = currentTime;
    };
    
    // We update velocity every frame based on the latest scroll position
    updateVelocity();
    
    // Decay velocity if scroll stops changing
    const decay = () => {
        const currentTime = performance.now();
        const dt = currentTime - prevTime.current;
        if (dt > 50) {
            velocityRef.current *= 0.9;
            setVelocity(Math.abs(velocityRef.current));
        }
        rafId = requestAnimationFrame(decay);
    };
    rafId = requestAnimationFrame(decay);
    
    return () => cancelAnimationFrame(rafId);
  }, [scrollPos]);

  return velocity;
}
