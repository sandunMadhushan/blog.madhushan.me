import { Button } from "@/components/ui/button";
import ArticleCard from "./ArticleCard";
import { useEffect, useState } from "react";
import { MediumService } from "@/services/mediumService";

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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blog-blue"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-blog-blue/30 text-blog-blue hover:bg-blog-blue/10">
              All Topics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blog-blue">
              Tech
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blog-blue">
              Career
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" className="border-blog-blue text-blog-blue hover:bg-blog-blue hover:text-white">
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticleGrid;