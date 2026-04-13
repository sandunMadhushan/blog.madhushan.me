export const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

export type RssItem = {
  title: string;
  description: string;
  pubDate: string;
  categories?: string[];
  link: string;
};

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function extractExcerpt(description: string): string {
  const text = description.replace(/<[^>]*>/g, "").trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

export function extractImage(description: string): string | null {
  const imgMatch = description.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
  return imgMatch ? normalizeImageUrl(imgMatch[1]) : null;
}

export function estimateReadTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function toDisplayDate(value: string | Date | null): string {
  if (!value) return "Unpublished";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function fetchMediumRss(): Promise<RssItem[]> {
  const rssUrl =
    process.env.MEDIUM_RSS_URL ||
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sandunmadhushan";
  const response = await fetch(rssUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch Medium feed (${response.status})`);
  }
  const payload = await response.json();
  if (!payload || payload.status !== "ok" || !Array.isArray(payload.items)) {
    throw new Error("Invalid Medium feed response");
  }
  return payload.items as RssItem[];
}

export function normalizeImageUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const url = input.trim();
  if (!url) return null;

  // Google Drive share link formats -> direct content URL
  // https://drive.google.com/file/d/<id>/view?usp=sharing
  const filePathMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (filePathMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${filePathMatch[1]}`;
  }

  // https://drive.google.com/open?id=<id>
  // https://drive.google.com/uc?id=<id>
  // https://drive.google.com/thumbnail?id=<id>&sz=w2000
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("drive.google.com")) {
      const id = parsed.searchParams.get("id");
      if (id) {
        return `https://drive.google.com/uc?export=view&id=${id}`;
      }
    }
  } catch {
    // Keep original URL if parsing fails
  }

  return url;
}
