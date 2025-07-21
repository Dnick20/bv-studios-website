// Base paths
export const MEDIA_BASE = '/media'
export const IMAGES_PATH = `${MEDIA_BASE}/images`
export const VIDEOS_PATH = `${MEDIA_BASE}/videos`

// Wedding media paths
export const WEDDING_MEDIA = {
  images: {
    path: `${IMAGES_PATH}/weddings`,
    hero: `${IMAGES_PATH}/weddings/hero-bg.jpg`,
    dominic: `${IMAGES_PATH}/weddings/dominic.jpg`,
    couples: {
      sarahJames: `${IMAGES_PATH}/weddings/sarah-james.jpg`,
      emilyMichael: `${IMAGES_PATH}/weddings/emily-michael.jpg`,
      jessicaDavid: `${IMAGES_PATH}/weddings/jessica-david.jpg`,
      laurenChris: `${IMAGES_PATH}/weddings/lauren-chris.jpg`,
    },
  },
  videos: {
    path: `${VIDEOS_PATH}/weddings`,
    highlights: {
      sarahJames: `${VIDEOS_PATH}/weddings/sarah-james-highlight.mp4`,
      emilyMichael: `${VIDEOS_PATH}/weddings/emily-michael-highlight.mp4`,
      jessicaDavid: `${VIDEOS_PATH}/weddings/jessica-david-highlight.mp4`,
      laurenChris: `${VIDEOS_PATH}/weddings/lauren-chris-highlight.mp4`,
    },
  },
}

// Commercial media paths
export const COMMERCIAL_MEDIA = {
  images: {
    path: `${IMAGES_PATH}/commercial`,
    thumbnails: {
      brewery: `${IMAGES_PATH}/commercial/brewery-thumb.jpg`,
      restaurant: `${IMAGES_PATH}/commercial/restaurant-thumb.jpg`,
      tech: `${IMAGES_PATH}/commercial/tech-thumb.jpg`,
      retail: `${IMAGES_PATH}/commercial/retail-thumb.jpg`,
    },
  },
  videos: {
    path: `${VIDEOS_PATH}/commercial`,
    projects: {
      brewery: `${VIDEOS_PATH}/commercial/brewery-final.mp4`,
      restaurant: `${VIDEOS_PATH}/commercial/restaurant-final.mp4`,
      tech: `${VIDEOS_PATH}/commercial/tech-final.mp4`,
      retail: `${VIDEOS_PATH}/commercial/retail-final.mp4`,
    },
  },
}

// Portfolio media paths
export const PORTFOLIO_MEDIA = {
  images: {
    path: `${IMAGES_PATH}/portfolio`,
    featured: {
      corporate: `${IMAGES_PATH}/portfolio/corporate-events.jpg`,
      music: `${IMAGES_PATH}/portfolio/music-videos.jpg`,
      social: `${IMAGES_PATH}/portfolio/social-content.jpg`,
      brand: `${IMAGES_PATH}/portfolio/brand-stories.jpg`,
    },
  },
  videos: {
    path: `${VIDEOS_PATH}/portfolio`,
    showreel: `${VIDEOS_PATH}/portfolio/showreel-2024.mp4`,
  },
}

// Team media paths
export const TEAM_MEDIA = {
  images: {
    path: `${IMAGES_PATH}/team`,
    members: {
      dominic: `${IMAGES_PATH}/team/dominic.jpg`,
      teamPhoto: `${IMAGES_PATH}/team/team-photo.jpg`,
    },
  },
}

// Image dimensions for optimization
export const IMAGE_DIMENSIONS = {
  thumbnail: {
    width: 640,
    height: 360,
  },
  hero: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    width: 800,
    height: 1200,
  },
  square: {
    width: 800,
    height: 800,
  },
}

// Video formats and quality settings
export const VIDEO_SETTINGS = {
  thumbnail: {
    maxWidth: 640,
    quality: 'medium',
    format: 'mp4',
  },
  fullHd: {
    width: 1920,
    height: 1080,
    quality: 'high',
    format: 'mp4',
  },
  preview: {
    maxWidth: 480,
    quality: 'low',
    format: 'mp4',
  },
} 