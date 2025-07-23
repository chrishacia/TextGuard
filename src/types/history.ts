import type { SocialPlatform } from '../components/SocialPostForm';
import type { SpamResult } from './spam-api';

export interface HistoryItem {
  id: string;
  text: string;
  platforms: SocialPlatform[];
  result?: SpamResult;
  error?: string;
  timestamp: number;
}
