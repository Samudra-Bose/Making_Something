import { useEffect } from 'react';
import { useExperienceStore } from './store';

// ExperienceController is the SINGLE source of truth for pointer tracking.
// It does NOT listen to window scroll — AppShell is overflow-hidden so window never scrolls.
// Each world container reports its own scroll via setScroll().

export default function ExperienceController() {
  const { setPointer, setPointerVelocity } = useExperienceStore();

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

  return null;
}
