import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { ContentService } from "@/services/contentService";
import type { FeaturedSelection, MediumArticle } from "@/types/content";
import { FormEvent, useEffect, useState } from "react";

export default function AdminMediumPage() {
  const [medium, setMedium] = useState<MediumArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [featured, setFeatured] = useState<FeaturedSelection | null>(null);
  const [slugDrafts, setSlugDrafts] = useState<Record<string, string>>({});
  const [manual, setManual] = useState({
    mediumLink: "",
    title: "",
    excerpt: "",
    coverImage: "",
    tags: "",
  });

  const refresh = async () => {
    const [data, featuredData] = await Promise.all([
      ContentService.fetchAdminMedium(),
      ContentService.fetchFeaturedSelection(),
    ]);
    setMedium(data.medium);
    setSlugDrafts(
      data.medium.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.internalSlug;
        return acc;
      }, {})
    );
    setFeatured(featuredData.featured);
  };

  useEffect(() => {
    refresh().catch((err) => setError(String(err)));
  }, []);

  async function submitManual(event: FormEvent) {
    event.preventDefault();
    await ContentService.addManualMedium({
      mediumLink: manual.mediumLink,
      title: manual.title,
      excerpt: manual.excerpt,
      coverImage: manual.coverImage || null,
      tags: manual.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    setManual({ mediumLink: "", title: "", excerpt: "", coverImage: "", tags: "" });
    await refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Manage Medium</h1>
        <Button
          onClick={async () => {
            setSyncing(true);
            try {
              const result = await ContentService.syncMedium();
              await refresh();
              toast.success("Medium sync completed", {
                description: `Imported ${result.imported} article${
                  result.imported === 1 ? "" : "s"
                } from RSS.`,
              });
            } catch (err) {
              const message = err instanceof Error ? err.message : "Sync failed";
              setError(message);
              toast.error("Medium sync failed", {
                description: message,
              });
            } finally {
              setSyncing(false);
            }
          }}
        >
          {syncing ? "Syncing..." : "Sync Medium RSS"}
        </Button>
      </div>
      {error ? (
        <p className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <form className="space-y-3 rounded-xl border border-border/60 p-4" onSubmit={submitManual}>
        <h2 className="text-lg font-semibold">Manual Add / Override</h2>
        <Input
          placeholder="Medium link"
          value={manual.mediumLink}
          onChange={(e) => setManual((s) => ({ ...s, mediumLink: e.target.value }))}
          required
        />
        <Input
          placeholder="Title"
          value={manual.title}
          onChange={(e) => setManual((s) => ({ ...s, title: e.target.value }))}
          required
        />
        <Input
          placeholder="Excerpt"
          value={manual.excerpt}
          onChange={(e) => setManual((s) => ({ ...s, excerpt: e.target.value }))}
          required
        />
        <Input
          placeholder="Cover image URL"
          value={manual.coverImage}
          onChange={(e) => setManual((s) => ({ ...s, coverImage: e.target.value }))}
        />
        <Input
          placeholder="Tags comma separated"
          value={manual.tags}
          onChange={(e) => setManual((s) => ({ ...s, tags: e.target.value }))}
        />
        <Button type="submit">Save manual entry</Button>
      </form>

      <div className="space-y-2">
        {medium.map((item) => (
          <div
            key={item.id}
            className="space-y-3 rounded-lg border border-border/60 px-3 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.source.toUpperCase()} • {item.mediumLink}
              </p>
                <p className="text-xs text-muted-foreground">
                  Internal URL: {window.location.origin}/articles/{item.internalSlug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={
                    featured?.source === "medium" && featured.id === item.id
                      ? "default"
                      : "outline"
                  }
                  onClick={async () => {
                    await ContentService.setFeaturedSelection({
                      source: "medium",
                      id: item.id,
                    });
                    await refresh();
                  }}
                >
                  {featured?.source === "medium" && featured.id === item.id
                    ? "Featured"
                    : "Set Featured"}
                </Button>
                <Button
                  size="sm"
                  variant={item.isHidden ? "destructive" : "outline"}
                  onClick={async () => {
                    await ContentService.patchMedium(item.id, {
                      isHidden: !item.isHidden,
                    });
                    await refresh();
                  }}
                >
                  {item.isHidden ? "Unhide" : "Hide"}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Input
                className="max-w-sm"
                placeholder="internal-slug"
                value={slugDrafts[item.id] ?? ""}
                onChange={(e) =>
                  setSlugDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
              />
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const rawSlug = (slugDrafts[item.id] ?? "").trim();
                  await ContentService.patchMedium(item.id, {
                    internalSlug: rawSlug.length ? rawSlug : null,
                  });
                  await refresh();
                  toast.success("Internal URL updated", {
                    description: `Updated /articles/${rawSlug || item.internalSlug}`,
                  });
                }}
              >
                Save URL
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  setSlugDrafts((prev) => ({ ...prev, [item.id]: item.internalSlug }));
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
