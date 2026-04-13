import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentService } from "@/services/contentService";
import type { BlogPost, FeaturedSelection, PostStatus } from "@/types/content";
import { FormEvent, useEffect, useMemo, useState } from "react";

const emptyDraft = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  contentMarkdown: "",
  coverImage: "",
  tagsRaw: "",
  status: "draft" as PostStatus,
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featured, setFeatured] = useState<FeaturedSelection | null>(null);

  const isEditing = Boolean(editing.id);

  const refresh = async () => {
    const [data, featuredData] = await Promise.all([
      ContentService.fetchAdminPosts(),
      ContentService.fetchFeaturedSelection(),
    ]);
    setPosts(data.posts);
    setFeatured(featuredData.featured);
  };

  useEffect(() => {
    refresh().catch((err) => setError(String(err)));
  }, []);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => Date.parse(b.updatedAt || "") - Date.parse(a.updatedAt || "")
      ),
    [posts]
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        slug: editing.slug || undefined,
        title: editing.title,
        excerpt: editing.excerpt,
        contentMarkdown: editing.contentMarkdown,
        coverImage: editing.coverImage || null,
        tags: editing.tagsRaw
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        status: editing.status,
      };
      if (isEditing) {
        await ContentService.updatePost(editing.id, payload);
      } else {
        await ContentService.createPost(payload);
      }
      setEditing(emptyDraft);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Posts</h1>
      {error ? (
        <p className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <form className="space-y-3 rounded-xl border border-border/60 p-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Title"
            value={editing.title}
            onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
            required
          />
          <Input
            placeholder="Slug (optional)"
            value={editing.slug}
            onChange={(e) => setEditing((s) => ({ ...s, slug: e.target.value }))}
          />
        </div>
        <Input
          placeholder="Excerpt"
          value={editing.excerpt}
          onChange={(e) => setEditing((s) => ({ ...s, excerpt: e.target.value }))}
          required
        />
        <Input
          placeholder="Cover image URL"
          value={editing.coverImage}
          onChange={(e) => setEditing((s) => ({ ...s, coverImage: e.target.value }))}
        />
        <Input
          placeholder="Tags comma separated"
          value={editing.tagsRaw}
          onChange={(e) => setEditing((s) => ({ ...s, tagsRaw: e.target.value }))}
        />
        <textarea
          className="min-h-[220px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Markdown content"
          value={editing.contentMarkdown}
          onChange={(e) =>
            setEditing((s) => ({ ...s, contentMarkdown: e.target.value }))
          }
          required
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={editing.status}
            onChange={(e) =>
              setEditing((s) => ({ ...s, status: e.target.value as PostStatus }))
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update post" : "Create post"}
          </Button>
          {isEditing ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(emptyDraft)}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-2">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
          >
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-sm text-muted-foreground">
                {post.status.toUpperCase()} • {post.slug}
              </p>
            </div>
            <div className="flex gap-2">
              {post.status === "draft" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await ContentService.publishPost(post.id);
                    await refresh();
                  }}
                >
                  Publish
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await ContentService.setFeaturedSelection({
                    source: "native",
                    id: post.id,
                  });
                  await refresh();
                }}
              >
                {featured?.source === "native" && featured.id === post.id
                  ? "Featured"
                  : "Set Featured"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setEditing({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    contentMarkdown: post.contentMarkdown,
                    coverImage: post.coverImage || "",
                    tagsRaw: post.tags.join(", "),
                    status: post.status,
                  })
                }
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  await ContentService.deletePost(post.id);
                  await refresh();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
