import { useEffect, useState } from 'react';

export default function useTimeProgress(expired, tick = 1000) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const now = Date.now();
    const timeEnd = new Date(expired).getTime();
    const totalDuration = timeEnd - now;
    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - now;
      const newProgress = Math.min(elapsed / totalDuration, 1);
      setProgress(isNaN(newProgress) ? 1 : newProgress);
    }
    updateProgress();
    const interval = setInterval(updateProgress, tick);

    return () => clearInterval(interval);
  }, [expired, tick]);

  return progress;
}
