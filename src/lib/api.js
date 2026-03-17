const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

async function request(endpoint, params = {}) {
  const url = new URL(`${API_URL}/${endpoint}`, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchSites() {
  return request('sites');
}

export async function fetchStats(siteId, start, end) {
  return request('stats', { site_id: siteId, start, end });
}

export async function fetchLive() {
  return request('live');
}

export async function fetchReferrers(siteId, start, end) {
  return request('referrers', { site_id: siteId, start, end });
}

export async function fetchPages(siteId, start, end) {
  return request('pages', { site_id: siteId, start, end });
}

export async function fetchCompare(siteIds, start, end) {
  return request('compare', { site_ids: siteIds.join(','), start, end });
}
