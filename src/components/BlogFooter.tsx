import { Github, Linkedin, Twitter } from "lucide-react";

const BlogFooter = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="font-bold text-xl text-blog-blue mb-4">Madhushan</div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Full-Stack Developer crafting beautiful digital experiences and sharing knowledge through code.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Projects</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">React</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">TypeScript</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Fullstack</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-blog-blue blog-transition">Career</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Sandun Madhushan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;