import { supabase } from '../lib/supabase.js';
import { cors, authCheck, parseQuery } from '../lib/validate.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (!authCheck(event)) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { siteId, start, end } = parseQuery(event);

  if (!siteId) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'site_id required' }) };
  }

  // Default: last 30 days
  const startDate = start || new Date(Date.now() - 30 * 86400000).toISOString();
  const endDate = end || new Date().toISOString();

  let query = supabase
    .from('pageviews')
    .select('*')
    .eq('site_id', siteId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  const { data, error } = await query;

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  // Aggregate in-memory
  const totalViews = data.length;
  const uniqueSessions = new Set(data.map(r => r.session_hash)).size;

  // Group by day
  const byDay = {};
  for (const row of data) {
    const day = row.created_at.slice(0, 10);
    if (!byDay[day]) byDay[day] = { date: day, views: 0, sessions: new Set() };
    byDay[day].views++;
    byDay[day].sessions.add(row.session_hash);
  }

  const timeline = Object.values(byDay).map(d => ({
    date: d.date,
    views: d.views,
    sessions: d.sessions.size,
  }));

  // Top pages
  const byPage = {};
  for (const row of data) {
    byPage[row.path] = (byPage[row.path] || 0) + 1;
  }
  const topPages = Object.entries(byPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([path, views]) => ({ path, views }));

  // Device breakdown
  const byDevice = {};
  for (const row of data) {
    const d = row.device_type || 'unknown';
    byDevice[d] = (byDevice[d] || 0) + 1;
  }
  const devices = Object.entries(byDevice).map(([device, count]) => ({ device, count }));

  // Browser breakdown
  const byBrowser = {};
  for (const row of data) {
    const b = row.browser || 'unknown';
    byBrowser[b] = (byBrowser[b] || 0) + 1;
  }
  const browsers = Object.entries(byBrowser).map(([browser, count]) => ({ browser, count }));

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({
      totalViews,
      uniqueSessions,
      timeline,
      topPages,
      devices,
      browsers,
    }),
  };
}
