"use client";

import { useEffect, useState } from "react";

export default function LiveOrderCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Initialize count from localStorage or generate new seed
    const storedSeed = localStorage.getItem("orderCounterSeed");
    let initialCount: number;

    if (storedSeed) {
      initialCount = parseInt(storedSeed, 10);
    } else {
      initialCount = 47 + Math.floor(Math.random() * 15);
      localStorage.setItem("orderCounterSeed", initialCount.toString());
    }

    setCount(initialCount);

    // Increment count every 30 seconds by 1-3 randomly
    const interval = setInterval(() => {
      setCount((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const newCount = prev + increment;
        localStorage.setItem("orderCounterSeed", newCount.toString());
        return newCount;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse-subtle">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-100"></span>
        </span>
        <span className="text-sm font-medium">
          {count} orders in the last 24 hours
        </span>
      </div>
    </div>
  );
}
