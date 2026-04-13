import { ScrollReveal } from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentService } from "@/services/contentService";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface FeedPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

const FeaturedPost = () => {
  const [featuredPost, setFeaturedPost] = useState<FeedPost | null>(null);

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const data = await ContentService.fetchFeed();
        setFeaturedPost(data?.featured || null);
      } catch (error) {
        console.error("FeaturedPost: Error fetching featured post:", error);
        setFeaturedPost(null);
      }
    };

    fetchFeaturedPost();
  }, []);

  const title = featuredPost?.title ?? "From Classroom to";
  const subtitle = featuredPost ? null : "Codebase";
  const excerpt =
    featuredPost?.excerpt ??
    "How I'm bridging the gap between academic knowledge and real-world software engineering practices. A deep dive into the transition from student to professional developer.";
  const tags = featuredPost?.tags ?? ["Career", "Learning", "Advice"];
  const imageUrl =
    featuredPost?.image ??
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  const link = featuredPost?.link ?? "/admin";

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <ScrollReveal className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4" />
            <span className="font-semibold">Featured Article</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
              {subtitle ? (
                <span className="portfolio-text-gradient block">{subtitle}</span>
              ) : null}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {excerpt}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-yellow-400/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 px-4 py-2 text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-lg font-semibold rounded-xl portfolio-transition group"
            >
              <a
                href={link}
                target={link.startsWith("http") ? "_blank" : undefined}
                rel={link.startsWith("http") ? "noreferrer" : undefined}
              >
                Read Full Story
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 portfolio-transition" />
              </a>
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
              
              <div className="aspect-[4/3] rounded-2xl overflow-hidden portfolio-shadow-lg relative group">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 portfolio-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 portfolio-transition"></div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FeaturedPost;