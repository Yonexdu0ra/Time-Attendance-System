"use client";
import { useEffect, useState } from "react";

export default function useDevtoolDetect() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let flagged = false;
    const mark = () => {
      if (!flagged) {
        flagged = true;
        setOpen(true);
      }
    };

    // 1. Console toString detect (ổn định nhất)
    const loop1 = setInterval(() => {
      const x = /./;
      x.toString = function () {
        mark();
        return "";
      };
      console.debug(x);
    }, 500);

    // 2. debugger timing (nhưng threshold PHẢI cao)
    const loop2 = setInterval(() => {
      const t = performance.now();
      debugger;
      if (performance.now() - t > 300) mark(); // threshold 300ms
    }, 700);

    return () => {
      clearInterval(loop1);
      clearInterval(loop2);
    };
  }, []);

  return open;
}
