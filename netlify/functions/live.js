import { supabase } from '../lib/supabase.js';
import { cors, authCheck } from '../lib/validate.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (!authCheck(event)) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Live = heartbeats in the last 90 seconds
  const cutoff = new Date(Date.now() - 90000).toISOString();

  const { data, error } = await supabase
    .from('heartbeats')
    .select('site_id, session_hash, path')
    .gte('last_seen', cutoff);

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  // Group by site_id
  const bySite = {};
  for (const row of data) {
    if (!bySite[row.site_id]) {
      bySite[row.site_id] = { count: 0, sessions: new Set(), pages: {} };
    }
    bySite[row.site_id].sessions.add(row.session_hash);
    bySite[row.site_id].pages[row.path] = (bySite[row.site_id].pages[row.path] || 0) + 1;
  }

  const result = Object.entries(bySite).map(([siteId, info]) => ({
    site_id: siteId,
    viewers: info.sessions.size,
    pages: Object.entries(info.pages).map(([path, count]) => ({ path, count })),
  }));

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify(result),
  };
}
