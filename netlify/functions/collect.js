import { supabase } from '../lib/supabase.js';
import { validateCollectPayload, cors } from '../lib/validate.js';
import { createSessionHash, classifyDevice, parseBrowser } from '../lib/session.js';
import { getCountry, getClientIP } from '../lib/geo.js';

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Parse and validate payload
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  // Reject oversized payloads
  if (event.body.length > 1024) {
    return { statusCode: 413, headers: cors(), body: JSON.stringify({ error: 'Payload too large' }) };
  }

  const data = validateCollectPayload(body);
  if (!data) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'Invalid payload' }) };
  }

  // Resolve site by tracking_id
  const { data: sites } = await supabase
    .from('sites')
    .select('id')
    .eq('tracking_id', data.t)
    .limit(1);

  if (!sites || sites.length === 0) {
    return { statusCode: 404, headers: cors(), body: JSON.stringify({ error: 'Unknown site' }) };
  }

  const siteId = sites[0].id;
  const headers = event.headers || {};
  const ip = getClientIP(headers);
  const ua = headers['user-agent'] || '';
  const sessionHash = await createSessionHash(ip, ua);

  if (data.type === 'pageview') {
    const { error } = await supabase.from('pageviews').insert({
      site_id: siteId,
      path: data.p,
      referrer: data.r || null,
      utm_source: data.us || null,
      utm_medium: data.um || null,
      utm_campaign: data.uc || null,
      utm_content: data.ux || null,
      utm_term: data.ut || null,
      country: getCountry(headers),
      device_type: classifyDevice(data.sw),
      browser: parseBrowser(ua),
      session_hash: sessionHash,
    });

    if (error) {
      console.error('Pageview insert error:', error);
      return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: 'Insert failed' }) };
    }
  } else if (data.type === 'heartbeat') {
    // Upsert heartbeat: update last_seen if session exists, otherwise insert
    const { error } = await supabase
      .from('heartbeats')
      .upsert(
        {
          site_id: siteId,
          session_hash: sessionHash,
          path: data.p,
          last_seen: new Date().toISOString(),
        },
        { onConflict: 'session_hash' }
      );

    if (error) {
      // Fallback: try insert if upsert fails (no unique constraint on session_hash)
      await supabase.from('heartbeats').insert({
        site_id: siteId,
        session_hash: sessionHash,
        path: data.p,
        last_seen: new Date().toISOString(),
      });
    }
  }

  return { statusCode: 200, headers: cors(), body: JSON.stringify({ ok: true }) };
}
