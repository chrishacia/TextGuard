const LEET_MAP: Record<string,string> = {
  '0': 'o','1': 'i','3': 'e','4': 'a','5': 's','7': 't',
  '@': 'a','!': 'i','$': 's'
};

export function normalizeText(text: string): string {
  const mapped = [...text].map(ch => {
    const lower = ch.toLowerCase();
    return LEET_MAP[lower] ?? lower;
  }).join('');

  // keep letters & spaces, collapse whitespace
  const letters = mapped.replace(/[^a-z ]/gi, ' ');
  const collapsed = letters.replace(/\s+/g, ' ');
  // collapse spaced‑out words “f r e e” → “free”
  return collapsed.replace(/(\b)([a-z])\s+([a-z])(\b)/g, (_,b,a,c) => b + a + c);
}
