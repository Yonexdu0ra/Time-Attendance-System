import { useState, useEffect, useCallback } from 'react';

function useTimeCountDown(initialTargetDate) {
  const [targetDate, setTargetDate] = useState(initialTargetDate ? new Date(initialTargetDate) : null);
  const [startTime, setStartTime] = useState(targetDate ? new Date().getTime() : 0);
  const [state, setState] = useState({ difference: 0, progress: 0 });

  const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return { difference: 0, progress: 0 };
    const now = new Date().getTime();
    const targetTime = targetDate.getTime();
    const difference = targetTime - now;
    const totalDuration = targetTime - startTime;

    return {
      difference: difference > 0 ? difference : 0,
      progress: totalDuration > 0 ? Math.min(100, ((now - startTime) / totalDuration) * 100) : 100,
    };
  }, [targetDate, startTime]);

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setState(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, targetDate]);

  const setNewTargetDate = (date) => {
    const newDate = new Date(date);
    setTargetDate(newDate);
    setStartTime(new Date().getTime()); // reset startTime ngay khi đổi target
  };

  const timeLeft = {
    days: Math.floor(state.difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((state.difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((state.difference / 1000 / 60) % 60),
    seconds: Math.floor((state.difference / 1000) % 60),
    progress: state.progress,
  };

  return { ...timeLeft, setTargetDate: setNewTargetDate };
}

export default useTimeCountDown;
