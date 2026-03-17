export function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
}

export function formatDateFull(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-CH', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getDateRange(range) {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 90);
      break;
    case '12m':
      start.setMonth(start.getMonth() - 12);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
