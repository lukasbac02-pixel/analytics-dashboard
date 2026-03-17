/**
 * Generate a session hash from User-Agent + IP + date.
 * Rotates daily. No cookies needed.
 */
export async function createSessionHash(ip, userAgent) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const raw = `${ip || 'unknown'}|${userAgent || 'unknown'}|${date}`;

  // Use Web Crypto API (available in Netlify Functions)
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

/**
 * Classify device type from screen width.
 */
export function classifyDevice(screenWidth) {
  if (!screenWidth || screenWidth <= 0) return 'unknown';
  if (screenWidth < 768) return 'mobile';
  if (screenWidth < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Extract browser name from User-Agent string.
 */
export function parseBrowser(ua) {
  if (!ua) return 'unknown';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/')) return 'Safari';
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
  return 'other';
}
