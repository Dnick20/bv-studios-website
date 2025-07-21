import { mediaUrls } from '../constants/mediaUrls';

export function getMediaUrl(type: 'images' | 'videos', category: string, name: string): string {
  try {
    const urls = mediaUrls[type] as any;
    const categoryUrls = urls[category] as any;
    const url = categoryUrls[name];
    
    if (!url) {
      console.error(`Media URL not found for ${type}/${category}/${name}`);
      return '';
    }
    
    // For Google Drive links, convert them to direct download/view URLs if needed
    if (url.includes('drive.google.com')) {
      // If it's a view link (contains /view)
      if (url.includes('/view')) {
        return url.replace('/view', '/preview');
      }
      // If it's a share link (contains /sharing)
      if (url.includes('/sharing')) {
        return url;
      }
    }
    
    return url;
  } catch (error) {
    console.error(`Error getting media URL for ${type}/${category}/${name}:`, error);
    return '';
  }
} 