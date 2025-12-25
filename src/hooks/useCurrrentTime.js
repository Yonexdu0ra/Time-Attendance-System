import formatTime from '@/utils/formatTime';
import { useEffect, useState } from 'react';

function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {


    setCurrentTime(formatTime());

    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

export default useCurrentTime;
