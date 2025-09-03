import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const FeaturedPost = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4 bg-blog-blue/10 text-blog-blue hover:bg-blog-blue/20">
            Featured
          </Badge>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Classroom to Codebase: My Transition Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              How I'm bridging the gap between academic knowledge and real-world software engineering practices.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="border-blog-blue/30 text-blog-blue">Career</Badge>
              <Badge variant="outline" className="border-blog-blue/30 text-blog-blue">Learning</Badge>
              <Badge variant="outline" className="border-blog-blue/30 text-blog-blue">Advice</Badge>
            </div>
            <Button className="bg-blog-blue hover:bg-blog-blue-dark text-white group">
              Read full story
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 blog-transition" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden blog-shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Featured Post"
                className="w-full h-full object-cover hover:scale-105 blog-transition"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;