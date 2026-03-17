import { useState, useEffect } from 'react';
import { fetchSites } from '../lib/api';

export function useSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSites()
      .then(setSites)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { sites, loading, error };
}
