import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';

const DEVICE_COLORS = {
  desktop: '#6366f1',
  mobile: '#10b981',
  tablet: '#f59e0b',
  unknown: '#9ca3af',
};

export function DeviceBreakdown({ stats, loading }) {
  if (loading) return <Card title="Devices"><LoadingSpinner /></Card>;

  const devices = stats?.devices || [];
  if (!devices.length) return <Card title="Devices"><EmptyState /></Card>;

  const total = devices.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card title="Devices" dragHandle>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={devices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
              >
                {devices.map((d) => (
                  <Cell key={d.device} fill={DEVICE_COLORS[d.device] || '#9ca3af'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {devices.map((d) => (
            <div key={d.device} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: DEVICE_COLORS[d.device] || '#9ca3af' }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{d.device}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {total > 0 ? Math.round((d.count / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
