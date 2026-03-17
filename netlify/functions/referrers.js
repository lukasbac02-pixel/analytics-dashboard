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
    .select('referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term')
    .eq('site_id', siteId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  // Referrer breakdown
  const byReferrer = {};
  for (const row of data) {
    let source = 'Direct';
    if (row.referrer) {
      try {
        source = new URL(row.referrer).hostname;
      } catch {
        source = row.referrer.slice(0, 100);
      }
    }
    byReferrer[source] = (byReferrer[source] || 0) + 1;
  }

  const referrers = Object.entries(byReferrer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([source, count]) => ({ source, count }));

  // UTM breakdown
  const byUTM = {};
  for (const row of data) {
    if (row.utm_source) {
      const key = [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(' / ');
      byUTM[key] = (byUTM[key] || 0) + 1;
    }
  }

  const utm = Object.entries(byUTM)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([campaign, count]) => ({ campaign, count }));

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ referrers, utm }),
  };
}
