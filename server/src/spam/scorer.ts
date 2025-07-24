import type { DataItem, Classification, SpamResult } from "../types/scorer";
import { normalizeText } from "./normalizeText";
import dataset from "./data.json";
import badWordsModule = require("bad-words");
import BayesClassifierMod = require("natural/lib/natural/classifiers/bayes_classifier");

const HEURISTIC_WEIGHT = Number(process.env.SPAM_HEURISTIC_WEIGHT ?? 0.5);
const THRESHOLD = Number(process.env.SPAM_THRESHOLD ?? 0.6);
const DEBUG_SPAM = process.env.DEBUG_SPAM === "1";
function dbg(label: string, payload: unknown) {
  if (DEBUG_SPAM) console.log(`[SPAM-DEBUG] ${label}:`, payload);
}

const FilterCtor: unknown =
  typeof badWordsModule === "function"
    ? badWordsModule
    : (badWordsModule as any).Filter ??
      (badWordsModule as any).default ??
      badWordsModule;

if (typeof FilterCtor !== "function") {
  throw new Error("bad-words Filter constructor not found");
}

const badWords = new (FilterCtor as new () => {
  isProfane(s: string): boolean;
})();

const NBClassCtor: unknown =
  (BayesClassifierMod as any).default ?? BayesClassifierMod;

if (typeof NBClassCtor !== "function") {
  throw new Error("natural BayesClassifier constructor not found");
}

type NB = {
  addDocument(doc: string, label: string): void;
  train(): void;
  getClassifications(input: string): Classification[];
  docs?: unknown[];
  classes?: unknown[];
};

const nb: NB = new (NBClassCtor as new () => NB)();

(dataset as DataItem[]).forEach((item) => {
  nb.addDocument(normalizeText(item.text), item.label);
});
nb.train();

dbg("TRAIN_COUNTS", {
  dataset: (dataset as DataItem[]).length,
  nbDocs: (nb as any).docs?.length ?? "n/a",
});

export function scoreSpam(raw: string): SpamResult {
  const text = normalizeText(raw);

  let h = 0;
  if ((raw.match(/https?:\/\//gi) || []).length > 1) h += 0.25;
  if ((raw.match(/!/g) || []).length > 2) h += 0.15;
  if (badWords.isProfane(raw)) h += 0.1;

  const classifications = nb.getClassifications(text) as Classification[];
  const total = classifications.reduce((s, c) => s + c.value, 0) || 1;
  const spamProb =
    (classifications.find((c) => c.label === "spam")?.value ?? 0) / total;

  const combined = Number(
    (HEURISTIC_WEIGHT * h + (1 - HEURISTIC_WEIGHT) * spamProb).toFixed(3)
  );

  dbg("SCORE_INPUT", { raw, text });
  dbg("HEURISTICS", { h });
  dbg("CLASSIFICATIONS", classifications);
  dbg("NORMALIZED_SPAM_PROB", spamProb);
  dbg("COMBINED", { combined });

  return { score: combined, isSpam: combined >= THRESHOLD };
}
