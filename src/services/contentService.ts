import type {
  BlogPost,
  ContentFeedItem,
  FeaturedSelection,
  MediumArticle,
  MediumArticleDetail,
} from "@/types/content";
import { apiFetch } from "./api";

export class ContentService {
  static async fetchFeed() {
    return apiFetch<{ items: ContentFeedItem[]; featured: ContentFeedItem | null }>(
      "/content-feed"
    );
  }

  static async fetchFeaturedSelection() {
    return apiFetch<{ featured: FeaturedSelection | null }>("/admin/featured");
  }

  static async setFeaturedSelection(featured: FeaturedSelection) {
    return apiFetch<{ featured: FeaturedSelection }>("/admin/featured", {
      method: "PUT",
      body: JSON.stringify(featured),
    });
  }

  static async fetchPublishedPost(slug: string) {
    return apiFetch<{ post: BlogPost }>(`/posts/${slug}`);
  }

  static async fetchAdminPosts() {
    return apiFetch<{ posts: BlogPost[] }>("/admin/posts");
  }

  static async createPost(data: {
    slug?: string;
    title: string;
    excerpt: string;
    contentMarkdown: string;
    coverImage?: string | null;
    tags: string[];
    status: "draft" | "published";
  }) {
    return apiFetch<{ post: BlogPost }>("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updatePost(
    id: string,
    data: {
      slug?: string;
      title: string;
      excerpt: string;
      contentMarkdown: string;
      coverImage?: string | null;
      tags: string[];
      status: "draft" | "published";
    }
  ) {
    return apiFetch<{ post: BlogPost }>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async publishPost(id: string) {
    return apiFetch<{ post: BlogPost }>(`/admin/posts/${id}/publish`, {
      method: "POST",
    });
  }

  static async deletePost(id: string) {
    return apiFetch<{ ok: boolean }>(`/admin/posts/${id}`, {
      method: "DELETE",
    });
  }

  static async fetchAdminMedium() {
    return apiFetch<{ medium: MediumArticle[] }>("/admin/medium");
  }

  static async fetchMediumArticleBySlug(slug: string) {
    return apiFetch<{ article: MediumArticleDetail }>(`/articles/${slug}`);
  }

  static async syncMedium() {
    return apiFetch<{ ok: boolean; imported: number }>("/admin/medium/sync", {
      method: "POST",
    });
  }

  static async addManualMedium(data: {
    mediumLink: string;
    title: string;
    excerpt: string;
    coverImage?: string | null;
    tags: string[];
    publishedAt?: string | null;
  }) {
    return apiFetch<{ medium: MediumArticle }>("/admin/medium/manual", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async patchMedium(
    id: string,
    patch: {
      isHidden?: boolean;
      isFeatured?: boolean;
      title?: string;
      excerpt?: string;
      coverImage?: string | null;
      tags?: string[];
      internalSlug?: string | null;
    }
  ) {
    return apiFetch<{ medium: MediumArticle }>(`/admin/medium/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  }
}
