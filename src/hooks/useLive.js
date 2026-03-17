import { useState, useEffect, useCallback } from 'react';
import { fetchLive } from '../lib/api';

export function useLive(intervalMs = 30000) {
  const [liveData, setLiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    fetchLive()
      .then(data => {
        setLiveData(data);
        setError(null);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);

  return { liveData, loading, error, refresh };
}
