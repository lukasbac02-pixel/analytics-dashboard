import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { formatDate, formatNumber } from '../../lib/formatters';

export function TrafficOverview({ stats, loading }) {
  if (loading) return <Card title="Traffic Overview"><LoadingSpinner /></Card>;
  if (!stats?.timeline?.length) return <Card title="Traffic Overview"><EmptyState /></Card>;

  return (
    <Card title="Traffic Overview" dragHandle>
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total views</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.uniqueSessions)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Unique visitors</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={stats.timeline}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #fff)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
