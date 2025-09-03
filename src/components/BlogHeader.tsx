import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const BlogHeader = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="font-bold text-xl text-blog-blue">Madhushan</div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Home</a>
              <a href="#" className="text-blog-blue font-medium">Blog</a>
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Projects</a>
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Contact</a>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-blog-blue/10">
            ☀️
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default BlogHeader;