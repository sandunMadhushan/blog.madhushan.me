export type PostStatus = "draft" | "published";
export type FeedItemSource = "native" | "medium";
export type FeaturedSource = "native" | "medium";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  coverImage: string | null;
  tags: string[];
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediumArticle {
  id: string;
  mediumLink: string;
  internalSlug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  source: "rss" | "manual";
  isHidden: boolean;
  isFeatured: boolean;
  manualOverride: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediumArticleDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  mediumLink: string;
  source: "rss" | "manual";
}

export interface ContentFeedItem {
  id: string;
  source: FeedItemSource;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
  featured: boolean;
}

export interface FeaturedSelection {
  source: FeaturedSource;
  id: string;
}
