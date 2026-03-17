import { supabase } from '../lib/supabase.js';
import { cors, authCheck, parseQuery } from '../lib/validate.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (!authCheck(event)) {
    return { statusCode: 401, headers: cors(), body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { siteIds, start, end } = parseQuery(event);

  if (!siteIds || siteIds.length === 0) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'site_ids required (comma-separated)' }) };
  }

  const startDate = start || new Date(Date.now() - 30 * 86400000).toISOString();
  const endDate = end || new Date().toISOString();

  const { data, error } = await supabase
    .from('pageviews')
    .select('site_id, created_at, session_hash')
    .in('site_id', siteIds)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (error) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: error.message }) };
  }

  // Group by site_id and day
  const bySiteDay = {};
  for (const row of data) {
    const day = row.created_at.slice(0, 10);
    const key = `${row.site_id}:${day}`;
    if (!bySiteDay[key]) {
      bySiteDay[key] = { site_id: row.site_id, date: day, views: 0, sessions: new Set() };
    }
    bySiteDay[key].views++;
    bySiteDay[key].sessions.add(row.session_hash);
  }

  // Collect all dates
  const allDates = [...new Set(Object.values(bySiteDay).map(d => d.date))].sort();

  // Build comparison data: { date, site1_views, site1_sessions, site2_views, ... }
  const timeline = allDates.map(date => {
    const entry = { date };
    for (const siteId of siteIds) {
      const key = `${siteId}:${date}`;
      const d = bySiteDay[key];
      entry[`${siteId}_views`] = d ? d.views : 0;
      entry[`${siteId}_sessions`] = d ? d.sessions.size : 0;
    }
    return entry;
  });

  // Per-site totals
  const totals = {};
  for (const siteId of siteIds) {
    const siteData = data.filter(r => r.site_id === siteId);
    totals[siteId] = {
      totalViews: siteData.length,
      uniqueSessions: new Set(siteData.map(r => r.session_hash)).size,
    };
  }

  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify({ timeline, totals }),
  };
}
