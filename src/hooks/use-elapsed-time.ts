"use client";

import { useState, useEffect } from "react";
import { formatElapsed } from "@/lib/utils";

export function useElapsedTime(isoDate: string) {
  const [elapsed, setElapsed] = useState(() => formatElapsed(isoDate));

  useEffect(() => {
    setElapsed(formatElapsed(isoDate));
    const interval = setInterval(() => {
      setElapsed(formatElapsed(isoDate));
    }, 60000);
    return () => clearInterval(interval);
  }, [isoDate]);

  return elapsed;
}
