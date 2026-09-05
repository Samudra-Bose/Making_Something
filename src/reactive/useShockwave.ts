import { useCallback } from 'react';

export function useShockwave() {
  const triggerShockwave = useCallback((x: number, y: number, intensity: number = 1) => {
    window.dispatchEvent(
      new CustomEvent('drift:ripple', {
        detail: { x, y, intensity }
      })
    );
  }, []);

  return triggerShockwave;
}