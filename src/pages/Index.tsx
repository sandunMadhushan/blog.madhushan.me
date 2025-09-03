import BlogHeader from "@/components/BlogHeader";
import BlogHero from "@/components/BlogHero";
import FeaturedPost from "@/components/FeaturedPost";
import ArticleGrid from "@/components/ArticleGrid";
import Newsletter from "@/components/Newsletter";
import BlogFooter from "@/components/BlogFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main>
        <BlogHero />
        <FeaturedPost />
        <ArticleGrid />
        <Newsletter />
      </main>
      <BlogFooter />
    </div>
  );
};

export default Index;
