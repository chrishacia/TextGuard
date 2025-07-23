declare module '*.json' {
  const value: unknown;
  export default value;
}

declare module 'bad-words' {
  export default class Filter {
    constructor(options?: {
      list?: string[];
      replaceRegex?: RegExp;
      replaceSymbol?: string;
    });
    isProfane(text: string): boolean;
  }
}

declare module 'natural' {
  export class TfIdf {
    addDocument(document: string): void;
    listTerms(docIndex: number): Array<{ term: string; tfidf: number }>;
    tfidfs(
      document: string,
      callback: (i: number, measure: number, term?: string) => void
    ): void;
  }

  export class LogisticRegressionClassifier {
    constructor();
    addDocument(document: string | string[] | Record<string, number>, className: string): void;
    train(): void;
    getClassifications(
      document: string | string[] | Record<string, number>
    ): Array<{ label: string; value: number }>;
  }
}
