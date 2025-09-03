import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

const ArticleCard = ({
  title,
  excerpt,
  date,
  readTime,
  tags,
  image,
  link,
}: ArticleCardProps) => {
  const [imageSrc, setImageSrc] = useState(image);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.warn(`Image failed to load: ${imageSrc}, using fallback`);
    setImageError(true);
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    }
  };

  return (
    <article className="group bg-card rounded-2xl overflow-hidden blog-shadow-md hover:blog-shadow-lg blog-transition border border-border/50">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="animate-pulse bg-muted-foreground/20 w-full h-full"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 blog-transition ${
              !imageLoaded && !imageError
                ? "opacity-0 hidden"
                : "opacity-100 block"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
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
          <p className="text-muted-foreground mb-4 line-clamp-2">{excerpt}</p>
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
      </a>
    </article>
  );
};

export default ArticleCard;
