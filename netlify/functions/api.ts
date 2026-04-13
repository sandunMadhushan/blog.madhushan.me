import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";
import { z } from "zod";
import {
  clearSessionCookie,
  createSessionCookie,
  destroySession,
  getSessionAdmin,
  loginAdmin,
} from "./lib/auth";
import {
  DEFAULT_COVER_IMAGE,
  estimateReadTime,
  extractExcerpt,
  extractImage,
  fetchMediumRss,
  toDisplayDate,
  toSlug,
} from "./lib/content";
import { sql } from "./lib/db";

const json = (
  statusCode: number,
  body: unknown,
  headers?: Record<string, string>
): HandlerResponse => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...headers,
  },
  body: JSON.stringify(body),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const postSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  contentMarkdown: z.string().min(20),
  coverImage: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

const mediumManualSchema = z.object({
  mediumLink: z.string().url(),
  title: z.string().min(3),
  excerpt: z.string().min(10),
  coverImage: z.string().url().nullable().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().datetime().nullable().optional(),
});

const mediumPatchSchema = z.object({
  isHidden: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  title: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  coverImage: z.string().url().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

type DbPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

type DbMedium = {
  id: string;
  medium_link: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  tags: string[];
  source: "rss" | "manual";
  is_hidden: boolean;
  is_featured: boolean;
  manual_override_json: Record<string, unknown> | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const mapPost = (post: DbPost) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  contentMarkdown: post.content_markdown,
  coverImage: post.cover_image,
  tags: post.tags || [],
  status: post.status,
  publishedAt: post.published_at,
  createdAt: post.created_at,
  updatedAt: post.updated_at,
});

const mapMedium = (item: DbMedium) => ({
  id: item.id,
  mediumLink: item.medium_link,
  title: item.title,
  excerpt: item.excerpt,
  coverImage: item.cover_image,
  tags: item.tags || [],
  source: item.source,
  isHidden: item.is_hidden,
  isFeatured: item.is_featured,
  manualOverride: item.manual_override_json,
  publishedAt: item.published_at,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const readBody = (event: HandlerEvent): unknown => {
  if (!event.body) return {};
  return JSON.parse(event.body);
};

async function requireAdmin(event: HandlerEvent) {
  const admin = await getSessionAdmin(event);
  if (!admin) return null;
  return admin;
}

const toFeedItem = (item: DbMedium | DbPost, source: "medium" | "native") => {
  const date =
    source === "medium"
      ? toDisplayDate((item as DbMedium).published_at)
      : toDisplayDate((item as DbPost).published_at);
  return {
    id: item.id,
    source,
    title: item.title,
    excerpt: item.excerpt,
    date,
    readTime:
      source === "medium"
        ? "5 min read"
        : estimateReadTime((item as DbPost).content_markdown),
    tags: item.tags || [],
    image: item.cover_image || DEFAULT_COVER_IMAGE,
    link:
      source === "medium"
        ? (item as DbMedium).medium_link
        : `/posts/${(item as DbPost).slug}`,
    featured: source === "medium" ? (item as DbMedium).is_featured : false,
  };
};

async function syncMediumArticles() {
  const rssItems = await fetchMediumRss();
  for (const rssItem of rssItems) {
    const excerpt = extractExcerpt(rssItem.description);
    const coverImage = extractImage(rssItem.description);
    const tags = (rssItem.categories || []).slice(0, 5);
    await sql`
      insert into medium_articles (
        medium_link, title, excerpt, cover_image, tags, source, published_at
      ) values (
        ${rssItem.link},
        ${rssItem.title},
        ${excerpt},
        ${coverImage},
        ${tags},
        'rss',
        ${new Date(rssItem.pubDate).toISOString()}
      )
      on conflict (medium_link) do update set
        title = excluded.title,
        excerpt = excluded.excerpt,
        cover_image = coalesce(medium_articles.cover_image, excluded.cover_image),
        tags = excluded.tags,
        published_at = excluded.published_at
    `;
  }
}

async function handleAdmin(event: HandlerEvent, path: string): Promise<HandlerResponse> {
  if (event.httpMethod === "POST" && path === "/admin/login") {
    const parsed = loginSchema.safeParse(readBody(event));
    if (!parsed.success) return json(400, { error: parsed.error.flatten() });
    const auth = await loginAdmin(parsed.data.username, parsed.data.password);
    if (!auth) return json(401, { error: "Invalid credentials" });
    return json(
      200,
      { admin: auth.admin },
      { "Set-Cookie": createSessionCookie(auth.token) }
    );
  }

  if (event.httpMethod === "POST" && path === "/admin/logout") {
    await destroySession(event);
    return json(200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
  }

  const admin = await requireAdmin(event);
  if (!admin) return json(401, { error: "Unauthorized" });
  if (event.httpMethod === "GET" && path === "/admin/me") {
    return json(200, { admin });
  }

  if (event.httpMethod === "GET" && path === "/admin/posts") {
    const posts = await sql<DbPost[]>`
      select * from posts order by updated_at desc
    `;
    return json(200, { posts: posts.map(mapPost) });
  }

  if (event.httpMethod === "POST" && path === "/admin/posts") {
    const parsed = postSchema.safeParse(readBody(event));
    if (!parsed.success) return json(400, { error: parsed.error.flatten() });
    const post = parsed.data;
    const slug = post.slug ? toSlug(post.slug) : toSlug(post.title);
    const status = post.status;
    const publishedAt = status === "published" ? new Date().toISOString() : null;
    const rows = await sql<DbPost[]>`
      insert into posts (slug, title, excerpt, content_markdown, cover_image, tags, status, published_at)
      values (${slug}, ${post.title}, ${post.excerpt}, ${post.contentMarkdown}, ${post.coverImage ?? null}, ${post.tags}, ${status}, ${publishedAt})
      returning *
    `;
    return json(201, { post: mapPost(rows[0]) });
  }

  if (event.httpMethod === "PUT" && path.startsWith("/admin/posts/")) {
    const id = path.replace("/admin/posts/", "");
    const parsed = postSchema.safeParse(readBody(event));
    if (!parsed.success) return json(400, { error: parsed.error.flatten() });
    const post = parsed.data;
    const status = post.status;
    const rows = await sql<DbPost[]>`
      update posts set
        slug = ${toSlug(post.slug || post.title)},
        title = ${post.title},
        excerpt = ${post.excerpt},
        content_markdown = ${post.contentMarkdown},
        cover_image = ${post.coverImage ?? null},
        tags = ${post.tags},
        status = ${status},
        published_at = case
          when ${status} = 'published' and published_at is null then now()
          when ${status} = 'draft' then null
          else published_at
        end
      where id = ${id}
      returning *
    `;
    if (!rows[0]) return json(404, { error: "Post not found" });
    return json(200, { post: mapPost(rows[0]) });
  }

  if (event.httpMethod === "POST" && path.endsWith("/publish")) {
    const id = path.replace("/admin/posts/", "").replace("/publish", "");
    const rows = await sql<DbPost[]>`
      update posts
      set status = 'published', published_at = coalesce(published_at, now())
      where id = ${id}
      returning *
    `;
    if (!rows[0]) return json(404, { error: "Post not found" });
    return json(200, { post: mapPost(rows[0]) });
  }

  if (event.httpMethod === "DELETE" && path.startsWith("/admin/posts/")) {
    const id = path.replace("/admin/posts/", "");
    await sql`delete from posts where id = ${id}`;
    return json(200, { ok: true });
  }

  if (event.httpMethod === "GET" && path === "/admin/medium") {
    const medium = await sql<DbMedium[]>`
      select * from medium_articles order by published_at desc nulls last
    `;
    return json(200, { medium: medium.map(mapMedium) });
  }

  if (event.httpMethod === "POST" && path === "/admin/medium/sync") {
    await syncMediumArticles();
    return json(200, { ok: true });
  }

  if (event.httpMethod === "POST" && path === "/admin/medium/manual") {
    const parsed = mediumManualSchema.safeParse(readBody(event));
    if (!parsed.success) return json(400, { error: parsed.error.flatten() });
    const body = parsed.data;
    const rows = await sql<DbMedium[]>`
      insert into medium_articles (
        medium_link, title, excerpt, cover_image, tags, source, published_at
      ) values (
        ${body.mediumLink},
        ${body.title},
        ${body.excerpt},
        ${body.coverImage ?? null},
        ${body.tags},
        'manual',
        ${body.publishedAt ?? null}
      )
      on conflict (medium_link) do update set
        title = excluded.title,
        excerpt = excluded.excerpt,
        cover_image = excluded.cover_image,
        tags = excluded.tags,
        source = 'manual',
        published_at = excluded.published_at
      returning *
    `;
    return json(201, { medium: mapMedium(rows[0]) });
  }

  if (event.httpMethod === "PUT" && path.startsWith("/admin/medium/")) {
    const id = path.replace("/admin/medium/", "");
    const parsed = mediumPatchSchema.safeParse(readBody(event));
    if (!parsed.success) return json(400, { error: parsed.error.flatten() });
    const patch = parsed.data;
    const manualOverride = JSON.stringify({
      title: patch.title,
      excerpt: patch.excerpt,
      coverImage: patch.coverImage,
      tags: patch.tags,
    });
    const rows = await sql<DbMedium[]>`
      update medium_articles set
        is_hidden = coalesce(${patch.isHidden}, is_hidden),
        is_featured = coalesce(${patch.isFeatured}, is_featured),
        title = coalesce(${patch.title}, title),
        excerpt = coalesce(${patch.excerpt}, excerpt),
        cover_image = coalesce(${patch.coverImage ?? null}, cover_image),
        tags = coalesce(${patch.tags}, tags),
        manual_override_json = ${manualOverride}::jsonb
      where id = ${id}
      returning *
    `;
    if (!rows[0]) return json(404, { error: "Medium article not found" });
    return json(200, { medium: mapMedium(rows[0]) });
  }

  return json(404, { error: "Not found" });
}

async function handlePublic(event: HandlerEvent, path: string): Promise<HandlerResponse> {
  if (event.httpMethod === "GET" && path === "/posts") {
    const status = event.queryStringParameters?.status || "published";
    const posts = await sql<DbPost[]>`
      select * from posts where status = ${status} order by published_at desc nulls last, created_at desc
    `;
    return json(200, { posts: posts.map(mapPost) });
  }

  if (event.httpMethod === "GET" && path.startsWith("/posts/")) {
    const slug = path.replace("/posts/", "");
    const posts = await sql<DbPost[]>`
      select * from posts where slug = ${slug} and status = 'published' limit 1
    `;
    if (!posts[0]) return json(404, { error: "Post not found" });
    return json(200, { post: mapPost(posts[0]) });
  }

  if (event.httpMethod === "GET" && path === "/content-feed") {
    const nativePosts = await sql<DbPost[]>`
      select * from posts
      where status = 'published'
      order by published_at desc nulls last
      limit 30
    `;
    const mediumPosts = await sql<DbMedium[]>`
      select * from medium_articles
      where is_hidden = false
      order by published_at desc nulls last
      limit 30
    `;

    const combined = [
      ...nativePosts.map((item) => ({
        ...toFeedItem(item, "native"),
        publishedAtTs: item.published_at ? Date.parse(item.published_at) : 0,
      })),
      ...mediumPosts.map((item) => ({
        ...toFeedItem(item, "medium"),
        publishedAtTs: item.published_at ? Date.parse(item.published_at) : 0,
      })),
    ]
      .sort((a, b) => b.publishedAtTs - a.publishedAtTs)
      .map(({ publishedAtTs, ...rest }) => rest);

    const featured =
      combined.find((item) => item.featured) ||
      combined[0] || {
        id: "fallback",
        source: "medium",
        title: "No published content yet",
        excerpt: "Use /admin to sync Medium or publish your first post.",
        date: "Today",
        readTime: "1 min read",
        tags: ["Setup"],
        image: DEFAULT_COVER_IMAGE,
        link: "#",
        featured: false,
      };

    return json(200, { items: combined, featured });
  }

  return json(404, { error: "Not found" });
}

export const handler: Handler = async (event) => {
  try {
    const rawPath = event.path
      .replace(/^\/.netlify\/functions\/api/, "")
      .replace(/^\/api/, "");
    const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

    if (path.startsWith("/admin")) {
      return await handleAdmin(event, path);
    }

    return await handlePublic(event, path);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return json(500, { error: message });
  }
};
