import { ContentService } from "@/services/contentService";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    drafts: 0,
    medium: 0,
    featuredMedium: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [postsRes, mediumRes] = await Promise.all([
        ContentService.fetchAdminPosts(),
        ContentService.fetchAdminMedium(),
      ]);
      const posts = postsRes.posts;
      const medium = mediumRes.medium;
      setStats({
        posts: posts.length,
        drafts: posts.filter((p) => p.status === "draft").length,
        medium: medium.length,
        featuredMedium: medium.filter((m) => m.isFeatured).length,
      });
    };
    load().catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Posts" value={stats.posts} />
        <StatCard label="Draft Posts" value={stats.drafts} />
        <StatCard label="Medium Items" value={stats.medium} />
        <StatCard label="Featured Medium" value={stats.featuredMedium} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
