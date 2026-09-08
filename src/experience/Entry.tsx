import { useEffect } from 'react';
import { useExperienceStore } from './store';

export default function Entry() {
  const setHasEntered = useExperienceStore((state) => state.setHasEntered);

  useEffect(() => {
    // Bypass static entry to achieve seamless continuous scroll
    setHasEntered(true);
    useExperienceStore.getState().openFork('journey');
    useExperienceStore.getState().expandFork('journey');
  }, [setHasEntered]);

  return null;
}
