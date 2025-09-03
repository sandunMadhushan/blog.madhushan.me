interface MediumPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

export class MediumService {
  private static readonly MEDIUM_RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sandunmadhushan';
  
  static async fetchPosts(): Promise<MediumPost[]> {
    try {
      const response = await fetch(this.MEDIUM_RSS_URL);
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Failed to fetch Medium posts');
      }
      
      return data.items.map((item: any) => ({
        title: item.title,
        excerpt: this.extractExcerpt(item.description),
        date: this.formatDate(item.pubDate),
        readTime: this.estimateReadTime(item.description),
        tags: this.extractTags(item.categories || []),
        image: this.extractImage(item.description) || this.getDefaultImage(),
        link: item.link
      }));
    } catch (error) {
      console.error('Error fetching Medium posts:', error);
      return this.getFallbackPosts();
    }
  }
  
  private static extractExcerpt(description: string): string {
    // Remove HTML tags and get first 150 characters
    const text = description.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }
  
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  private static estimateReadTime(content: string): string {
    const text = content.replace(/<[^>]*>/g, '');
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
  
  private static getFallbackPosts(): MediumPost[] {
    return [
      {
        title: "Developing E-Doc: A Mobile App for Remote Healthcare Access",
        excerpt: "E-Doc is an Android mobile application designed to transform healthcare accessibility by enabling remote doctor consultations. Built using modern technologies...",
        date: "April 2, 2024",
        readTime: "8 min read",
        tags: ["Mobile Development", "Healthcare", "Android"],
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "https://sandunmadhushan.medium.com/developing-e-doc-a-mobile-app-for-remote-healthcare-access-087483f844f6"
      },
      {
        title: "How I Built EduConnect-LMS: A Collaborative Learning Management System",
        excerpt: "EduConnect-LMS is a learning management system designed to foster collaboration among students, demonstrators, and lecturers. The project combines modern web technologies...",
        date: "March 25, 2024",
        readTime: "10 min read",
        tags: ["Web Development", "Education", "Full Stack"],
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "https://sandunmadhushan.medium.com/educonnect-lms-ae18b5a440e4"
      },
      {
        title: "How I Built the AI-Powered Resume Analyzer",
        excerpt: "Creating the AI-Powered Resume Analyzer was an exciting journey that combined artificial intelligence, web development, and resume analysis to help job seekers...",
        date: "March 23, 2024",
        readTime: "12 min read",
        tags: ["AI", "Machine Learning", "Web Development"],
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "https://sandunmadhushan.medium.com/how-i-built-the-ai-powered-resume-analyzer-27bb82bbbb58"
      },
      {
        title: "Embracing Your Personal Average: A Journey of Resilience and Growth",
        excerpt: "In a world where comparison is second nature, where achievements and progress are constantly measured against others, the concept of your personal average offers a refreshing perspective...",
        date: "August 21, 2023",
        readTime: "6 min read",
        tags: ["Personal Growth", "Motivation", "Life"],
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        link: "https://sandunmadhushan.medium.com/embracing-your-personal-average-a-journey-of-resilience-and-growth-41999838add9"
      }
    ];
  }
}