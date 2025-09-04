import { Button } from "@/components/ui/button";
import ArticleCard from "./ArticleCard";
import { useEffect, useState } from "react";
import { MediumService } from "@/services/mediumService";
import { Loader2, Filter } from "lucide-react";

interface MediumPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

const ArticleGrid = () => {
  const [articles, setArticles] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Topics");

  const filters = ["All Topics", "Tech", "Career", "Learning", "Development"];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const posts = await MediumService.fetchPosts();
        setArticles(posts);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-20" id="articles">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Loading amazing content...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20" id="articles">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="portfolio-text-gradient">Articles</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into my thoughts on technology, career growth, and software development
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 text-muted-foreground mr-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by:</span>
          </div>
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-6 py-2 portfolio-transition ${
                activeFilter === filter
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "border-border hover:border-yellow-400 hover:text-yellow-400"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article, index) => (
            <div
              key={index}
              className="opacity-0 animate-in fade-in-50 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <ArticleCard {...article} />
            </div>
          ))}
        </div>

        {/* Load more button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-border hover:border-yellow-400 hover:text-yellow-400 h-12 px-8 text-lg font-semibold rounded-xl portfolio-transition"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticleGrid;