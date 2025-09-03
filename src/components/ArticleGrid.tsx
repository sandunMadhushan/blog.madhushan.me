import { Button } from "@/components/ui/button";
import ArticleCard from "./ArticleCard";

const articles = [
  {
    title: "Mastering React Hooks: Lessons from Building 10 Projects",
    excerpt: "How I went from React beginner to confident hooks user through practical project-based learning.",
    date: "May 15, 2023",
    readTime: "8 min read",
    tags: ["React", "JavaScript"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Data Structures Every CS Student Should Master",
    excerpt: "A practical guide to the most important data structures and when to use them in real-world applications.",
    date: "April 28, 2023",
    readTime: "12 min read",
    tags: ["Algorithms", "Computer Science"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Building My First Fullstack App: Challenges & Breakthroughs",
    excerpt: "The journey of creating a complete MERN stack application as a student developer - what worked and what didn't.",
    date: "April 10, 2023",
    readTime: "10 min read",
    tags: ["MERN", "Fullstack"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "TypeScript Best Practices for Large Projects",
    excerpt: "Essential TypeScript patterns and practices I learned while working on enterprise-level applications.",
    date: "March 22, 2023",
    readTime: "7 min read",
    tags: ["TypeScript", "Best Practices"],
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "API Design: RESTful Principles in Practice",
    excerpt: "Real-world examples of designing clean, maintainable APIs that follow REST architectural constraints.",
    date: "March 8, 2023",
    readTime: "9 min read",
    tags: ["API", "Backend"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "The Power of Git: Advanced Workflows for Teams",
    excerpt: "Beyond basic commits: branching strategies, merge vs rebase, and collaborative workflows that actually work.",
    date: "February 18, 2023",
    readTime: "11 min read",
    tags: ["Git", "Team Workflow"],
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const ArticleGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-blog-blue/30 text-blog-blue hover:bg-blog-blue/10">
              All Topics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blog-blue">
              Tech
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blog-blue">
              Career
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
        <div className="text-center">
          <Button variant="outline" className="border-blog-blue text-blog-blue hover:bg-blog-blue hover:text-white">
            Load More Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticleGrid;