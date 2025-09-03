import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const BlogHero = () => {
  return (
    <section className="bg-gradient-to-br from-blog-blue/5 to-blog-blue-light/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blog-blue to-blog-blue-dark bg-clip-text text-transparent">
          Tech Thoughts & Insights
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Sharing my journey as an aspiring software engineer through code, concepts, and experiences.
        </p>
        <div className="max-w-md mx-auto relative">
          <Input 
            placeholder="Search articles..."
            className="pl-10 h-12 border-blog-blue/20 focus:border-blog-blue"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
      </div>
    </section>
  );
};

export default BlogHero;