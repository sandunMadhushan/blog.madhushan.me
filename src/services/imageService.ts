import { CONFIG } from "@/config/config";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
}

export class ImageService {
  private static readonly imageCache = new Map<string, string>();

  // Fallback images categorized by topic
  private static readonly topicImages = {
    "web development":
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "mobile development":
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "machine learning":
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    healthcare:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    education:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    career:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    programming:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    coding:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    software:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    technology:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    development:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    learning:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    growth:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    motivation:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    personal:
      "https://images.unsplash.com/photo-1494022299300-899b96e49893?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    default:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  };

  /**
   * Get an image for an article based on its title and tags
   */
  static async getImageForArticle(
    title: string,
    tags: string[] = []
  ): Promise<string> {
    // Check cache first
    const cacheKey = `${title}-${tags.join(",")}`;
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    try {
      // Try to get image from Unsplash API (if access key is available)
      if (CONFIG.UNSPLASH_ACCESS_KEY) {
        const unsplashImage = await this.searchUnsplashImage(title, tags);
        if (unsplashImage) {
          this.imageCache.set(cacheKey, unsplashImage);
          return unsplashImage;
        }
      }

      // Fallback to topic-based images
      const topicImage = this.getTopicBasedImage(title, tags);
      this.imageCache.set(cacheKey, topicImage);
      return topicImage;
    } catch (error) {
      console.error("Error getting image for article:", error);
      const fallbackImage = this.topicImages.default;
      this.imageCache.set(cacheKey, fallbackImage);
      return fallbackImage;
    }
  }

  /**
   * Search for relevant images using Unsplash API
   */
  private static async searchUnsplashImage(
    title: string,
    tags: string[]
  ): Promise<string | null> {
    try {
      // Create search query from title and tags
      const searchTerms = this.extractSearchTerms(title, tags);
      const query = searchTerms.join(" ");

      const response = await fetch(
        `${CONFIG.UNSPLASH_API_URL}?query=${encodeURIComponent(
          query
        )}&per_page=5&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${CONFIG.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data: UnsplashResponse = await response.json();

      if (data.results && data.results.length > 0) {
        // Return the first result's regular size image
        return data.results[0].urls.regular;
      }

      return null;
    } catch (error) {
      console.error("Error searching Unsplash:", error);
      return null;
    }
  }

  /**
   * Extract relevant search terms from title and tags
   */
  private static extractSearchTerms(title: string, tags: string[]): string[] {
    const searchTerms = new Set<string>();

    // Add relevant tags
    tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      if (
        normalizedTag.includes("development") ||
        normalizedTag.includes("programming") ||
        normalizedTag.includes("coding") ||
        normalizedTag.includes("tech") ||
        normalizedTag.includes("ai") ||
        normalizedTag.includes("machine learning")
      ) {
        searchTerms.add(normalizedTag);
      }
    });

    // Extract key terms from title
    const titleWords = title.toLowerCase().split(/\s+/);
    const techKeywords = [
      "development",
      "programming",
      "coding",
      "software",
      "web",
      "mobile",
      "app",
      "ai",
      "artificial intelligence",
      "machine learning",
      "data",
      "algorithm",
      "react",
      "javascript",
      "typescript",
      "python",
      "java",
      "android",
      "ios",
      "cloud",
      "database",
      "api",
      "framework",
      "library",
      "github",
      "git",
      "healthcare",
      "education",
      "learning",
      "technology",
      "computer",
      "digital",
    ];

    titleWords.forEach((word) => {
      if (
        techKeywords.some(
          (keyword) => keyword.includes(word) || word.includes(keyword)
        )
      ) {
        searchTerms.add(word);
      }
    });

    // If no tech terms found, add general terms
    if (searchTerms.size === 0) {
      searchTerms.add("technology");
      searchTerms.add("computer");
    }

    return Array.from(searchTerms).slice(0, 3); // Limit to 3 search terms
  }

  /**
   * Get image based on topic matching
   */
  private static getTopicBasedImage(title: string, tags: string[]): string {
    const titleLower = title.toLowerCase();
    const allTags = tags.map((tag) => tag.toLowerCase()).join(" ");
    const searchText = `${titleLower} ${allTags}`;

    // Check for specific topics in order of specificity
    for (const [topic, imageUrl] of Object.entries(this.topicImages)) {
      if (topic === "default") continue;

      if (
        searchText.includes(topic) ||
        searchText.includes(topic.replace(" ", "")) ||
        tags.some((tag) => tag.toLowerCase().includes(topic))
      ) {
        return imageUrl;
      }
    }

    // Special case matching for common variations
    if (
      searchText.includes("app") ||
      searchText.includes("mobile") ||
      searchText.includes("android") ||
      searchText.includes("ios")
    ) {
      return this.topicImages["mobile development"];
    }

    if (
      searchText.includes("web") ||
      searchText.includes("frontend") ||
      searchText.includes("backend") ||
      searchText.includes("fullstack")
    ) {
      return this.topicImages["web development"];
    }

    if (
      searchText.includes("artificial intelligence") ||
      searchText.includes("neural") ||
      searchText.includes("deep learning")
    ) {
      return this.topicImages["ai"];
    }

    if (
      searchText.includes("resume") ||
      searchText.includes("job") ||
      searchText.includes("work") ||
      searchText.includes("professional")
    ) {
      return this.topicImages["career"];
    }

    if (
      searchText.includes("study") ||
      searchText.includes("course") ||
      searchText.includes("university") ||
      searchText.includes("student")
    ) {
      return this.topicImages["education"];
    }

    // Default fallback
    return this.topicImages["default"];
  }

  /**
   * Preload images for better performance
   */
  static preloadImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  /**
   * Clear the image cache
   */
  static clearCache(): void {
    this.imageCache.clear();
  }
}
