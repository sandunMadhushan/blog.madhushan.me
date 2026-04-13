import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentService } from "@/services/contentService";
import type { FeaturedSelection, MediumArticle } from "@/types/content";
import { FormEvent, useEffect, useState } from "react";

export default function AdminMediumPage() {
  const [medium, setMedium] = useState<MediumArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [featured, setFeatured] = useState<FeaturedSelection | null>(null);
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
              await ContentService.syncMedium();
              await refresh();
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
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.source.toUpperCase()} • {item.mediumLink}
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
        ))}
      </div>
    </div>
  );
}
