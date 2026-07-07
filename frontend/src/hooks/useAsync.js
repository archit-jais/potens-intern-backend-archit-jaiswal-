import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../services/api';

export function useAsync(asyncFunction, options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError('');

      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const message = getApiErrorMessage(err);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}
