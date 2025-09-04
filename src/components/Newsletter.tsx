import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Users } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-muted/50 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join My <span className="portfolio-text-gradient">Developer Journey</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Get weekly insights, coding tips, and updates on my latest projects delivered straight to your inbox. 
              No spam, just valuable content for fellow developers.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span className="font-semibold">500+ developers</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-muted-foreground">
                <span className="font-semibold">Weekly updates</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-muted-foreground">
                <span className="font-semibold">No spam</span>
              </div>
            </div>
          </div>

          {/* Newsletter form */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 portfolio-shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Enter your email address"
                  className="h-14 pl-12 text-lg border-2 border-border/50 focus:border-yellow-400 bg-background/50 rounded-xl portfolio-transition"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white h-14 px-8 text-lg font-semibold rounded-xl portfolio-transition shadow-lg group"
              >
                Subscribe
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 portfolio-transition" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6 text-center">
              Join the community of developers who trust my insights. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;