import { useEffect, useState, useCallback } from "react";
import type { HistoryItem } from "../types/history";

const KEY = "tg_history_v1";

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((item: HistoryItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const removeMany = useCallback((ids: string[]) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
  }, []);

  return { items, add, removeMany };
}
