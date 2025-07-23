export interface SpamResult {
  score: number;
  isSpam: boolean;
}
export type SpamRequestBody = {
  text: unknown;
  platforms: unknown;
};

export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram';
export type SpamResponse = SpamResult & { platforms: SocialPlatform[] };
