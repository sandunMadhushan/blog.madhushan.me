import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blog-blue/5 to-blog-blue-light/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blog-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blog-blue" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join My Developer Journey</h2>
            <p className="text-lg text-muted-foreground">
              Get weekly insights, coding tips, and updates on my latest projects delivered straight to your inbox.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email"
              className="flex-1 h-12 border-blog-blue/20 focus:border-blog-blue"
            />
            <Button className="bg-blog-blue hover:bg-blog-blue-dark text-white h-12 px-8">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No spam, unsubscribe at any time. Join 500+ developers already subscribed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;