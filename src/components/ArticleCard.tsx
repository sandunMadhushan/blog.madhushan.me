import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
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
    <article className="group bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden portfolio-shadow hover:portfolio-shadow-lg portfolio-transition border border-border/50 hover:border-yellow-400/30">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="aspect-[16/10] overflow-hidden bg-muted relative">
          {!imageLoaded && !imageError && (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="animate-pulse bg-muted-foreground/20 w-full h-full"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-110 portfolio-transition duration-700 ${
              !imageLoaded && !imageError
                ? "opacity-0 hidden"
                : "opacity-100 block"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 portfolio-transition"></div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 portfolio-transition">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-4 group-hover:text-yellow-400 portfolio-transition leading-tight">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className={`border-opacity-50 hover:bg-opacity-10 portfolio-transition ${
                  index === 0 ? 'border-yellow-400/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10' :
                  index === 1 ? 'border-blue-400/50 text-blue-600 dark:text-blue-400 hover:bg-blue-400/10' :
                  'border-purple-400/50 text-purple-600 dark:text-purple-400 hover:bg-purple-400/10'
                }`}
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