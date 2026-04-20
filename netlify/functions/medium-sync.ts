import type { Handler } from "@netlify/functions";
import { extractExcerpt, extractImage, fetchMediumRss } from "./lib/content";
import { sql } from "./lib/db";

export const handler: Handler = async () => {
  try {
    const items = await fetchMediumRss();
    for (const item of items) {
      await sql`
        insert into medium_articles (
          medium_link, title, excerpt, cover_image, tags, source, manual_override_json, published_at
        ) values (
          ${item.link},
          ${item.title},
          ${extractExcerpt(item.description)},
          ${extractImage(item.description)},
          ${(item.categories || []).slice(0, 5)},
          'rss',
          ${JSON.stringify({
            internalSlug: item.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
              .slice(0, 120),
          })}::jsonb,
          ${new Date(item.pubDate).toISOString()}
        )
        on conflict (medium_link) do update set
          title = excluded.title,
          excerpt = excluded.excerpt,
          cover_image = coalesce(medium_articles.cover_image, excluded.cover_image),
          tags = excluded.tags,
          published_at = excluded.published_at
      `;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, imported: items.length }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
