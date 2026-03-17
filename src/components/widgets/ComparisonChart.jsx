import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { SiteSelector } from '../shared/SiteSelector';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';
import { fetchCompare } from '../../lib/api';
import { getSiteColor } from '../../lib/constants';
import { formatDate } from '../../lib/formatters';

export function ComparisonChart({ sites, start, end }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length < 2) {
      setData(null);
      return;
    }
    setLoading(true);
    fetchCompare(selectedIds, start, end)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedIds, start, end]);

  return (
    <Card title="Site Comparison" dragHandle>
      <div className="mb-3">
        <SiteSelector sites={sites} selected={selectedIds} onChange={setSelectedIds} multi />
        {selectedIds.length < 2 && selectedIds.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">Select at least 2 sites to compare</p>
        )}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && selectedIds.length < 2 && (
        <EmptyState message="Select 2 or more sites to compare" />
      )}

      {!loading && data?.timeline?.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            {selectedIds.map((siteId) => {
              const site = sites.find(s => s.id === siteId);
              const idx = sites.indexOf(site);
              return (
                <Line
                  key={siteId}
                  type="monotone"
                  dataKey={`${siteId}_views`}
                  name={site?.name || siteId}
                  stroke={getSiteColor(idx)}
                  strokeWidth={2}
                  dot={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
