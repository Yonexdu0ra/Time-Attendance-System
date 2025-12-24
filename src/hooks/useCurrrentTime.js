import { useEffect, useState } from 'react';

function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };

    setCurrentTime(formatTime());

    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

export default useCurrentTime;
