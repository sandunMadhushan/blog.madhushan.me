import { Button } from "@/components/ui/button";
import { useLenis } from "@/hooks/use-lenis";
import { Menu, X, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const BlogHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const updateScrolledState = () => {
      const y = lenis ? lenis.scroll : window.scrollY;
      setIsScrolled(y > 50);
    };

    const handleNativeScroll = () => updateScrolledState();
    const handleLenisScroll = () => updateScrolledState();

    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", handleLenisScroll);
    }

    updateScrolledState();

    return () => {
      window.removeEventListener("scroll", handleNativeScroll);
      if (lenis) {
        lenis.off("scroll", handleLenisScroll);
      }
    };
  }, [lenis]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 portfolio-transition ${
        isScrolled ? "glass-effect shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a
              href="/"
              className="text-2xl font-bold text-foreground hover:text-yellow-400 portfolio-transition"
            >
              Sandun Madhushan
            </a>
            <div className="hidden md:flex items-center space-x-8">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-border/50 hover:border-border hover:bg-accent/50"
              >
                <a
                  href="https://madhushan.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Portfolio
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <a href="#" className="text-foreground font-semibold relative">
                Blog
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400"></span>
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col space-y-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-border/50 hover:border-border hover:bg-accent/50 w-fit"
              >
                <a
                  href="https://madhushan.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Portfolio
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <a href="#" className="text-foreground font-semibold">
                Blog
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BlogHeader;
