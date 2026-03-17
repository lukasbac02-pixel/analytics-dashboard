import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { formatNumber } from '../../lib/formatters';

export function TopPages({ stats, loading }) {
  if (loading) return <Card title="Top Pages"><LoadingSpinner /></Card>;

  const pages = stats?.topPages || [];
  if (!pages.length) return <Card title="Top Pages"><EmptyState /></Card>;

  const maxViews = pages[0]?.views || 1;

  return (
    <Card title="Top Pages" dragHandle>
      <div className="space-y-2 overflow-y-auto max-h-64">
        {pages.map((page) => (
          <div key={page.path} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="relative h-7 flex items-center">
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-50 dark:bg-indigo-500/10 rounded"
                  style={{ width: `${(page.views / maxViews) * 100}%` }}
                />
                <span className="relative text-sm text-gray-700 dark:text-gray-300 truncate px-2">
                  {page.path}
                </span>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white tabular-nums shrink-0">
              {formatNumber(page.views)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
