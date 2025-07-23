export const SOCIAL_PLATFORMS = ['facebook', 'twitter', 'linkedin', 'instagram'] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];
