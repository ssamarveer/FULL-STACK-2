// Platform-specific constraints used across the composer.
// Each entry defines the rules the validation engine checks against.
export const PLATFORMS = [
  {
    id: 'x',
    name: 'X (Twitter)',
    code: 'X',
    limit: 280,
    maxImages: 4,
    maxVideos: 1,
    mediaRequired: false,
    noMixedMedia: true // images and video cannot be posted together
  },
  {
    id: 'instagram',
    name: 'Instagram',
    code: 'IG',
    limit: 2200,
    maxImages: 10,
    maxVideos: 1,
    mediaRequired: true,
    hashtagCap: 30
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    code: 'LI',
    limit: 3000,
    maxImages: 9,
    maxVideos: 1,
    mediaRequired: false
  },
  {
    id: 'facebook',
    name: 'Facebook',
    code: 'FB',
    limit: 63206,
    softLimit: 500, // recommended length for best engagement, not a hard rule
    maxImages: 10,
    maxVideos: 1,
    mediaRequired: false
  },
  {
    id: 'threads',
    name: 'Threads',
    code: 'TH',
    limit: 500,
    maxImages: 20,
    maxVideos: 1,
    mediaRequired: false
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    code: 'TT',
    limit: 2200,
    maxImages: 0,
    maxVideos: 1,
    mediaRequired: true,
    videoOnly: true
  }
]

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id)
