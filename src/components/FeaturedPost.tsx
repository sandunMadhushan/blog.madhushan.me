import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

const FeaturedPost = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4" />
            <span className="font-semibold">Featured Article</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              From Classroom to 
              <span className="portfolio-text-gradient block">Codebase</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              How I'm bridging the gap between academic knowledge and real-world software engineering practices. 
              A deep dive into the transition from student to professional developer.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <Badge variant="outline" className="border-yellow-400/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 px-4 py-2 text-sm">
                Career
              </Badge>
              <Badge variant="outline" className="border-blue-400/30 text-blue-600 dark:text-blue-400 hover:bg-blue-400/10 px-4 py-2 text-sm">
                Learning
              </Badge>
              <Badge variant="outline" className="border-purple-400/30 text-purple-600 dark:text-purple-400 hover:bg-purple-400/10 px-4 py-2 text-sm">
                Advice
              </Badge>
            </div>
            
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-lg font-semibold rounded-xl portfolio-transition group"
            >
              Read Full Story
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 portfolio-transition" />
            </Button>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
              
              <div className="aspect-[4/3] rounded-2xl overflow-hidden portfolio-shadow-lg relative group">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Featured Post"
                  className="w-full h-full object-cover group-hover:scale-105 portfolio-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 portfolio-transition"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;