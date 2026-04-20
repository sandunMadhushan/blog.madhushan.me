import BlogFooter from "@/components/BlogFooter";
import BlogHeader from "@/components/BlogHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentService } from "@/services/contentService";
import type { MediumArticleDetail as MediumArticleDetailType } from "@/types/content";
import { ArrowUpRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

export default function MediumArticleDetail() {
  const { slug = "" } = useParams();
  const [article, setArticle] = useState<MediumArticleDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ContentService.fetchMediumArticleBySlug(slug)
      .then((res) => {
        setArticle(res.article);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Article not found");
        setArticle(null);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto max-w-4xl px-6 pb-20 pt-32">
        {!article && !error ? (
          <p className="text-muted-foreground">Loading article...</p>
        ) : null}
        {error ? (
          <div className="space-y-3">
            <p className="text-red-300">{error}</p>
            <Link to="/" className="text-yellow-400 underline">
              Back to homepage
            </Link>
          </div>
        ) : null}

        {article ? (
          <article className="space-y-8">
            <header className="space-y-4">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString()
                  : "Unpublished"}
              </p>
              <h1 className="text-4xl font-bold">{article.title}</h1>
              <p className="text-lg text-muted-foreground">{article.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-border/60">
              <img
                src={article.coverImage || DEFAULT_IMAGE}
                alt={article.title}
                className="h-full max-h-[420px] w-full object-cover"
              />
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <h2 className="mb-2 text-xl font-semibold">Read the full write-up</h2>
              <p className="mb-5 text-muted-foreground">
                You are viewing the project article landing page on this blog. Continue to
                Medium for the full original article.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
                  <a href={article.mediumLink} target="_blank" rel="noreferrer noopener">
                    Read full article on Medium
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to all articles</Link>
                </Button>
              </div>
            </div>
          </article>
        ) : null}
      </main>
      <BlogFooter />
    </div>
  );
}
