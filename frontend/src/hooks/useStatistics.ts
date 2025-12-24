import { useState, useCallback, useEffect } from 'react';
import { getStatistics } from '../api';
import type { Statistics } from '../types';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    statistics,
    load,
  };
};
