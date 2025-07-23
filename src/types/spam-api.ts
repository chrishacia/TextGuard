import type { SocialPlatform } from "./platform"

export interface SpamRequestBody {
  text: string;
  platforms: SocialPlatform[];
}

export interface SpamResult {
  score: number;
  isSpam: boolean;
}

export interface SpamResponse extends SpamResult {
  platforms: SocialPlatform[];
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };
