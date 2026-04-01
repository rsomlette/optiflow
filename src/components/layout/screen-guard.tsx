"use client";

import { useEffect, useState } from "react";

const MIN_WIDTH = 768;
const MIN_HEIGHT = 500;

export function ScreenGuard({ children }: { children: React.ReactNode }) {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    function check() {
      setIsTooSmall(
        window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT
      );
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isTooSmall) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-8 text-center">
        <div>
          <div className="text-4xl mb-4">📱↔️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Please use a larger screen
          </h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            OptiFlow is designed for tablets in landscape mode or desktop
            screens. Please rotate your device or use a larger display.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
