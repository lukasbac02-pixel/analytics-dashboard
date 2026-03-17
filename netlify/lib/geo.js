/**
 * Extract country from Netlify geo headers.
 * Netlify automatically sets these headers on incoming requests.
 */
export function getCountry(headers) {
  // Netlify sets x-country header
  return headers?.['x-country'] || headers?.['x-nf-country-code'] || 'unknown';
}

/**
 * Get client IP from various headers.
 */
export function getClientIP(headers) {
  return (
    headers?.['x-nf-client-connection-ip'] ||
    headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers?.['client-ip'] ||
    'unknown'
  );
}
