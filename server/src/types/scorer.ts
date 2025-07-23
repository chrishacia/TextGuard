export interface DataItem {
  label: 'spam' | 'ham';
  text: string;
}

export interface SpamResult {
  score: number;
  isSpam: boolean;
}

export interface Classification {
  label: string;
  value: number;
}
