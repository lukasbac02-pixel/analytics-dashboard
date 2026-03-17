import { useState, useEffect } from 'react';
import { Card } from '../shared/Card';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { fetchReferrers } from '../../lib/api';

export function UTMBreakdown({ siteId, start, end }) {
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

  if (loading) return <Card title="UTM Campaigns"><LoadingSpinner /></Card>;
  if (!data?.utm?.length) return <Card title="UTM Campaigns"><EmptyState message="No UTM data" /></Card>;

  return (
    <Card title="UTM Campaigns" dragHandle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="pb-2 font-medium">Campaign</th>
              <th className="pb-2 font-medium text-right">Visits</th>
            </tr>
          </thead>
          <tbody>
            {data.utm.map((row) => (
              <tr key={row.campaign} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-1.5 text-gray-700 dark:text-gray-300">{row.campaign}</td>
                <td className="py-1.5 text-right font-medium text-gray-900 dark:text-white tabular-nums">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
