import { useLenis } from "@/hooks/use-lenis";
import { cn } from "@/lib/utils";
import type Lenis from "lenis";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTopFab() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) {
      const onScroll = () => setVisible(window.scrollY > 400);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const onLenisScroll = (instance: Lenis) => {
      setVisible(instance.scroll > 400);
    };

    lenis.on("scroll", onLenisScroll);
    onLenisScroll(lenis);
    return () => {
      lenis.off("scroll", onLenisScroll);
    };
  }, [lenis]);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={cn(
        "fixed bottom-6 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-lg transition-all duration-300 hover:border-yellow-500/50 hover:text-yellow-500 md:bottom-8 md:right-8",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
