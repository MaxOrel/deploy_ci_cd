import { useState, useCallback, useEffect } from 'react';
import { getHistory, clearHistory } from '../api';
import type { HistoryItem } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await getHistory(10);
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    history,
    load,
    clear,
  };
};
