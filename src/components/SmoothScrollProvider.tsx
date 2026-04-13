import { LenisContext } from "@/contexts/lenis-context";
import Lenis from "lenis";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      // Slightly softer, more natural smoothness than the default.
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const value = useMemo(() => lenis, [lenis]);

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  );
}
