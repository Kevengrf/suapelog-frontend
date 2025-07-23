
import { useState, useEffect } from 'react';

interface TimeCounterProps {
  startTime: string;
}

const TimeCounter = ({ startTime }: TimeCounterProps) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const calculateElapsedTime = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const difference = now - start;

      if (difference < 0) {
        setElapsedTime('00:00:00');
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((difference / 1000) % 60).toString().padStart(2, '0');
      
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    };

    const intervalId = setInterval(calculateElapsedTime, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, [startTime]);

  return (
    <span className="badge text-bg-warning fs-6">
      {elapsedTime}
    </span>
  );
};

export default TimeCounter;
