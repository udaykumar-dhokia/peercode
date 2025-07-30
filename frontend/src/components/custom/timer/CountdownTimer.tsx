import { useEffect, useState } from "react";
import { Icons } from "../../../assets/icons/icons";
import { motion } from "motion/react";

interface CountdownTimerProps {
  start: string | Date | null;
  duration: number;
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({
  start,
  duration,
  onExpire,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!start || !duration) return;

    const startTime = new Date(start).getTime();
    const endTime = startTime + duration * 60 * 1000;

    const update = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        onExpire?.();
        clearInterval(intervalId);
      } else {
        setTimeLeft(remaining);
      }
    };

    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [start, duration, onExpire]);

  const formatTime = (ms: number | null) => {
    if (ms === null || ms <= 0) return "00:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <span
      className={`font-mono text-lg text-black flex gap-2 items-center ${className}`}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "anticipate",
        }}
      >
        <Icons.Counter />
      </motion.span>
      <p>{formatTime(timeLeft)}</p>
    </span>
  );
}
