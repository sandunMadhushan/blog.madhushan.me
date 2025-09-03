import { ImageService } from "./imageService";
import { CONFIG } from "@/config/config";

interface MediumPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

interface MediumRSSItem {
  title: string;
  description: string;
  pubDate: string;
  categories?: string[];
  link: string;
}

interface MediumRSSResponse {
  status: string;
  items: MediumRSSItem[];
}

export class MediumService {
  private static readonly MEDIUM_RSS_URL = CONFIG.MEDIUM_RSS_URL;

  static async fetchPosts(): Promise<MediumPost[]> {
    console.log("Fetching Medium posts...");
    try {
      const response = await fetch(this.MEDIUM_RSS_URL);
      const data: MediumRSSResponse = await response.json();

      console.log("Medium API response:", data);

      if (data.status !== "ok") {
        throw new Error("Failed to fetch Medium posts");
      }

      const posts = await Promise.all(
        data.items.map(async (item: MediumRSSItem) => {
          const tags = this.extractTags(item.categories || []);
          const extractedImage = this.extractImage(item.description);

          console.log(`Processing article: ${item.title}`);
          console.log(`Extracted image: ${extractedImage}`);

          // If no image found in the post, get a relevant one based on title and tags
          let image = extractedImage;
          if (!image) {
            console.log(
              `No image found, getting smart image for: ${item.title} with tags:`,
              tags
            );
            image = await ImageService.getImageForArticle(item.title, tags);
            console.log(`Smart image result: ${image}`);
          }

          return {
            title: item.title,
            excerpt: this.extractExcerpt(item.description),
            date: this.formatDate(item.pubDate),
            readTime: this.estimateReadTime(item.description),
            tags,
            image,
            link: item.link,
          };
        })
      );

      console.log("Final posts with images:", posts);
      return posts;
    } catch (error) {
      console.error("Error fetching Medium posts:", error);
      console.log("Using fallback posts...");
      return await this.getFallbackPosts();
    }
  }

  private static extractExcerpt(description: string): string {
    // Remove HTML tags and get first 150 characters
    const text = description.replace(/<[^>]*>/g, "");
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  }

  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  private static estimateReadTime(content: string): string {
    const text = content.replace(/<[^>]*>/g, "");
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  private static extractTags(categories: string[]): string[] {
    return categories.slice(0, 3); // Limit to 3 tags
  }

  private static extractImage(description: string): string | null {
    const imgMatch = description.match(/<img[^>]*src="([^"]*)"[^>]*>/);
    return imgMatch ? imgMatch[1] : null;
  }

  private static getDefaultImage(): string {
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
  }

  private static async getFallbackPosts(): Promise<MediumPost[]> {
    const fallbackPosts = [
      {
        title: "Developing E-Doc: A Mobile App for Remote Healthcare Access",
        excerpt:
          "E-Doc is an Android mobile application designed to transform healthcare accessibility by enabling remote doctor consultations. Built using modern technologies...",
        date: "April 2, 2024",
        readTime: "8 min read",
        tags: ["Mobile Development", "Healthcare", "Android"],
        link: "https://sandunmadhushan.medium.com/developing-e-doc-a-mobile-app-for-remote-healthcare-access-087483f844f6",
      },
      {
        title:
          "How I Built EduConnect-LMS: A Collaborative Learning Management System",
        excerpt:
          "EduConnect-LMS is a learning management system designed to foster collaboration among students, demonstrators, and lecturers. The project combines modern web technologies...",
        date: "March 25, 2024",
        readTime: "10 min read",
        tags: ["Web Development", "Education", "Full Stack"],
        link: "https://sandunmadhushan.medium.com/educonnect-lms-ae18b5a440e4",
      },
      {
        title: "How I Built the AI-Powered Resume Analyzer",
        excerpt:
          "Creating the AI-Powered Resume Analyzer was an exciting journey that combined artificial intelligence, web development, and resume analysis to help job seekers...",
        date: "March 23, 2024",
        readTime: "12 min read",
        tags: ["AI", "Machine Learning", "Web Development"],
        link: "https://sandunmadhushan.medium.com/how-i-built-the-ai-powered-resume-analyzer-27bb82bbbb58",
      },
      {
        title:
          "Embracing Your Personal Average: A Journey of Resilience and Growth",
        excerpt:
          "In a world where comparison is second nature, where achievements and progress are constantly measured against others, the concept of your personal average offers a refreshing perspective...",
        date: "August 21, 2023",
        readTime: "6 min read",
        tags: ["Personal Growth", "Motivation", "Life"],
        link: "https://sandunmadhushan.medium.com/embracing-your-personal-average-a-journey-of-resilience-and-growth-41999838add9",
      },
    ];

    // Add relevant images to fallback posts
    return Promise.all(
      fallbackPosts.map(async (post) => ({
        ...post,
        image: await ImageService.getImageForArticle(post.title, post.tags),
      }))
    );
  }
}
