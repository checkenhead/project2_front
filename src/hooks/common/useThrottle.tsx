import { useRef } from 'react';

const useThrottle = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatchThrottle = (...args: T) => {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        timer.current = null
        callback(...args);
      }, delay)
    }
  };

  return dispatchThrottle;
};

export default useThrottle;