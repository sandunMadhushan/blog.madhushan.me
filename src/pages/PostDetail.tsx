import BlogFooter from "@/components/BlogFooter";
import BlogHeader from "@/components/BlogHeader";
import { ContentService } from "@/services/contentService";
import type { BlogPost } from "@/types/content";
import rehypeSanitize from "rehype-sanitize";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";

export default function PostDetail() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ContentService.fetchPublishedPost(slug)
      .then((res) => setPost(res.post))
      .catch((err) => setError(err instanceof Error ? err.message : "Not found"));
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="container mx-auto max-w-3xl px-6 pb-20 pt-32">
        {!post && !error ? <p className="text-muted-foreground">Loading post...</p> : null}
        {error ? (
          <div className="space-y-3">
            <p className="text-red-300">{error}</p>
            <Link to="/" className="text-yellow-400 underline">
              Back to homepage
            </Link>
          </div>
        ) : null}
        {post ? (
          <article className="space-y-6">
            <header className="space-y-3">
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : "Draft"}
              </p>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            </header>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {post.contentMarkdown}
              </ReactMarkdown>
            </div>
          </article>
        ) : null}
      </main>
      <BlogFooter />
    </div>
  );
}
