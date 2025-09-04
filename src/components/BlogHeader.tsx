import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

const BlogHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

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
              onClick={toggleTheme}
              className="hover:bg-yellow-400/10 hover:text-yellow-400 portfolio-transition"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

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
