export function validateCollectPayload(body) {
  if (!body || typeof body !== 'object') return null;
  if (!body.t || typeof body.t !== 'string') return null;
  if (!body.type || !['pageview', 'heartbeat'].includes(body.type)) return null;
  if (!body.p || typeof body.p !== 'string') return null;

  // Sanitize path
  body.p = body.p.slice(0, 500);

  // Sanitize optional strings
  const stringFields = ['r', 'us', 'um', 'uc', 'ux', 'ut'];
  for (const field of stringFields) {
    if (body[field] && typeof body[field] === 'string') {
      body[field] = body[field].slice(0, 500);
    } else {
      body[field] = '';
    }
  }

  // Screen width must be a number
  if (body.sw) {
    body.sw = parseInt(body.sw, 10) || 0;
  }

  return body;
}

export function cors(headers = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
    ...headers,
  };
}

export function authCheck(event) {
  const apiKey = process.env.DASHBOARD_API_KEY;
  if (!apiKey) return true; // No key configured = no auth

  const auth = event.headers?.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token === apiKey;
}

export function parseQuery(event) {
  const params = event.queryStringParameters || {};
  return {
    siteId: params.site_id || null,
    siteIds: params.site_ids ? params.site_ids.split(',') : [],
    start: params.start || null,
    end: params.end || null,
    groupBy: params.group_by || 'day',
    limit: Math.min(parseInt(params.limit, 10) || 50, 200),
  };
}
