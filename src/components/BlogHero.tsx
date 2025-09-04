import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowDown } from "lucide-react";

const BlogHero = () => {
  const scrollToArticles = () => {
    const articlesSection = document.getElementById("articles");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Main heading with gradient text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-foreground">Tech Insights &</span>
            <span className="block portfolio-text-gradient">
              Developer Stories
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Sharing my journey as a software engineer through code, concepts,
            and experiences. Exploring the intersection of technology and
            innovation.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-12 relative group">
            <Input
              placeholder="Search articles..."
              className="pl-12 h-14 text-lg border-2 border-border/50 focus:border-yellow-400 bg-card/50 backdrop-blur-sm portfolio-transition rounded-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-yellow-400 portfolio-transition" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-lg font-semibold rounded-xl portfolio-transition"
            >
              Latest Articles
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-border hover:border-yellow-400 hover:text-yellow-400 h-12 px-8 text-lg font-semibold rounded-xl portfolio-transition"
              asChild
            >
              <a
                href="https://madhushan.me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Me
              </a>
            </Button>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToArticles}
            className="animate-bounce hover:text-yellow-400 portfolio-transition"
            aria-label="Scroll to articles"
          >
            <ArrowDown className="w-6 h-6 mx-auto" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
