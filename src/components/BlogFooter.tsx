import { Github, Linkedin, Twitter, Mail, Heart, ExternalLink } from "lucide-react";

const BlogFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-muted/30 to-background border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">
                Sandun <span className="portfolio-text-gradient">Madhushan</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Full-Stack Developer passionate about creating beautiful digital experiences 
                and sharing knowledge through code and storytelling.
              </p>
            </div>
            
            {/* Social links */}
            <div className="flex gap-4">
              <a 
                href="https://github.com/sandunMadhushan" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-yellow-400/50 hover:bg-yellow-400/10 portfolio-transition group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 portfolio-transition" />
              </a>
              <a 
                href="https://linkedin.com/in/sandun-madhushan" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-400/50 hover:bg-blue-400/10 portfolio-transition group"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 portfolio-transition" />
              </a>
              <a 
                href="https://twitter.com/sandunmadhushan" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-purple-400/50 hover:bg-purple-400/10 portfolio-transition group"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 portfolio-transition" />
              </a>
              <a 
                href="mailto:sandunmadhushan@gmail.com"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-green-400/50 hover:bg-green-400/10 portfolio-transition group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 portfolio-transition" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground portfolio-transition flex items-center gap-2 group">
                  <span>Home</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 portfolio-transition" />
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground portfolio-transition flex items-center gap-2 group">
                  <span>About</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 portfolio-transition" />
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground portfolio-transition flex items-center gap-2 group">
                  <span>Projects</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 portfolio-transition" />
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground portfolio-transition flex items-center gap-2 group">
                  <span>Contact</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 portfolio-transition" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Categories</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-yellow-400 portfolio-transition">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-blue-400 portfolio-transition">
                  Mobile Apps
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-400 portfolio-transition">
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-green-400 portfolio-transition">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-pink-400 portfolio-transition">
                  Personal Growth
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>&copy; {currentYear} Sandun Madhushan. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using React & TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;