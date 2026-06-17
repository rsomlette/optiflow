"use client";

import { useState, useEffect } from "react";
import { formatElapsed } from "@/lib/utils";

export function useElapsedTime(isoDate: string) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return formatElapsed(isoDate);
}
