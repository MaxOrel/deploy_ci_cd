import { useState, useCallback } from 'react';
import { getRandomPercent } from '../api';

export const usePercent = () => {
  const [percent, setPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getRandomPercent();
      setPercent(parseInt(result, 10));
      return parseInt(result, 10);
    } catch (e) {
      console.error(e);
      setError(e as string);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    percent,
    loading,
    error,
    generate,
  };
};
