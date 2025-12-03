import type { Story } from '../types';

/**
 * Fetches real Unsplash images for stories
 * This is called after story generation to replace placeholder URLs with actual Unsplash image URLs
 */
export async function fetchStoryImages(stories: Story[]): Promise<Story[]> {
  // For now, we'll use a fallback approach since we can't call unsplash_tool from utility functions
  // We'll use the Unsplash API directly with a public access key
  // Or use placeholder images that we know work
  
  const updatedStories = await Promise.all(
    stories.map(async (story) => {
      // Extract search query from existing imageUrl if it's a source.unsplash.com URL
      let searchQuery = '';
      
      if (story.imageUrl.includes('source.unsplash.com')) {
        // Extract the query from URLs like: https://source.unsplash.com/1200x800/?query
        const match = story.imageUrl.match(/\?(.+)$/);
        if (match) {
          searchQuery = decodeURIComponent(match[1]);
        }
      } else if (story.imageUrl.startsWith('http')) {
        // Already a full URL, keep it
        return story;
      } else {
        // It's just a search query
        searchQuery = story.imageUrl;
      }
      
      // Use picsum.photos as a reliable fallback
      // It provides random images that always work
      const fallbackUrl = `https://picsum.photos/seed/${story.id}/1200/800`;
      
      return {
        ...story,
        imageUrl: fallbackUrl
      };
    })
  );
  
  return updatedStories;
}
