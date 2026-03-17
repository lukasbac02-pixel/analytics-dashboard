import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { fetchReferrers } from '../../lib/api';
import { SITE_COLORS } from '../../lib/constants';

export function ReferrerBreakdown({ siteId, start, end }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!siteId) return;
    setLoading(true);
    fetchReferrers(siteId, start, end)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [siteId, start, end]);

  if (loading) return <Card title="Traffic Sources"><LoadingSpinner /></Card>;
  if (!data?.referrers?.length) return <Card title="Traffic Sources"><EmptyState /></Card>;

  return (
    <Card title="Traffic Sources" dragHandle>
      <div className="flex gap-4">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.referrers.slice(0, 6)}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
              >
                {data.referrers.slice(0, 6).map((_, i) => (
                  <Cell key={i} fill={SITE_COLORS[i % SITE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 overflow-y-auto max-h-32">
          {data.referrers.slice(0, 10).map((ref, i) => (
            <div key={ref.source} className="flex items-center gap-2 text-sm">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: SITE_COLORS[i % SITE_COLORS.length] }}
              />
              <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{ref.source}</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{ref.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
