"use client";

import React, { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  duration?: number; // default 200ms
}

export default function AnimatedNumber({
  value,
  format = (val) => String(Math.round(val)),
  className = "",
  duration = 200,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const animationFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = previousValueRef.current;
    const endVal = value;

    if (startVal === endVal) {
      setDisplayValue(value);
      return;
    }

    // Cancel existing animation if value changes mid-animation
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Simple ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentVal = startVal + (endVal - startVal) * easeProgress;
      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        previousValueRef.current = endVal;
        animationFrameIdRef.current = null;
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [value, duration]);

  return <span className={className}>{format(displayValue)}</span>;
}
