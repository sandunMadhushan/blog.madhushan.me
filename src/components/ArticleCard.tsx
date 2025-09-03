import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
}

const ArticleCard = ({ title, excerpt, date, readTime, tags, image }: ArticleCardProps) => {
  return (
    <article className="group bg-card rounded-2xl overflow-hidden blog-shadow-md hover:blog-shadow-lg blog-transition border border-border/50">
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 blog-transition"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-blog-blue blog-transition">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="border-blog-blue/30 text-blog-blue hover:bg-blog-blue/10"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;