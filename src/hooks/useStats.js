import { useState, useEffect } from 'react';
import { fetchStats } from '../lib/api';

export function useStats(siteId, start, end) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!siteId) return;

    setLoading(true);
    setError(null);

    fetchStats(siteId, start, end)
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [siteId, start, end]);

  return { stats, loading, error };
}
