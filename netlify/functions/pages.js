import { supabase } from '../lib/supabase.js';
import { cors, authCheck, parseQuery } from '../lib/validate.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (!authCheck(event)) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { siteId, start, end, limit } = parseQuery(event);

  if (!siteId) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'site_id required' }) };
  }

  const startDate = start || new Date(Date.now() - 30 * 86400000).toISOString();
  const endDate = end || new Date().toISOString();

  const { data, error } = await supabase
    .from('pageviews')
    .select('path, session_hash')
    .eq('site_id', siteId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  // Aggregate by path
  const byPath = {};
  for (const row of data) {
    if (!byPath[row.path]) {
      byPath[row.path] = { views: 0, sessions: new Set() };
    }
    byPath[row.path].views++;
    byPath[row.path].sessions.add(row.session_hash);
  }

  const pages = Object.entries(byPath)
    .map(([path, info]) => ({
      path,
      views: info.views,
      sessions: info.sessions.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify(pages),
  };
}
