import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type CountUpOnViewProps = {
  end: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

export function CountUpOnView({
  end,
  suffix = "",
  durationMs = 1200,
  className,
}: CountUpOnViewProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [end, durationMs]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {value}
      {suffix}
    </span>
  );
}
