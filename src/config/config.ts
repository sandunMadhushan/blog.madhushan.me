/**
 * Configuration file for external services
 *
 * To get your Unsplash API key:
 * 1. Visit https://unsplash.com/developers
 * 2. Create a new application
 * 3. Copy your Access Key and paste it below
 *
 * Note: The app will work without the API key using smart fallback images
 */

// Safely access environment variables in Vite
const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key];
  }
  return undefined;
};

export const CONFIG = {
  // Optional: Add your Unsplash Access Key here to use live image search
  // If not provided, the app will use curated fallback images based on content
  UNSPLASH_ACCESS_KEY:
    getEnvVar("VITE_UNSPLASH_ACCESS_KEY") ||
    "BOqWktAn985EwhqoO1WDc04WKKW5bsEhxCElpPTrM7g",

  // API URLs
  UNSPLASH_API_URL: "https://api.unsplash.com/search/photos",
  MEDIUM_RSS_URL:
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sandunmadhushan",

  // Image settings
  IMAGE_QUALITY: "w=1350&q=80",
  IMAGE_CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;
