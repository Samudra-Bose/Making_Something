import { useEffect } from 'react';
import { useExperienceStore } from './store';

export default function ExperienceController() {
  const { setPointer, setPointerVelocity, setScroll } = useExperienceStore();

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

    const onScroll = () => {
      setScroll(window.scrollY);
    };

    // Use requestAnimationFrame for velocity decay
    const tick = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 100) {
        setPointerVelocity(0, 0); // Decay velocity if no movement
      }
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
    };
  }, [setPointer, setPointerVelocity, setScroll]);

  return null;
}
