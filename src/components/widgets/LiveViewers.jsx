import { Activity } from 'lucide-react';
import { Card } from '../shared/Card';
import { getSiteColor } from '../../lib/constants';

export function LiveViewers({ sites, liveData }) {
  return (
    <Card title="Live Viewers" dragHandle>
      <div className="grid grid-cols-2 gap-3">
        {sites.map((site, i) => {
          const live = liveData.find(l => l.site_id === site.id);
          const count = live?.viewers || 0;
          return (
            <div
              key={site.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 dark:bg-gray-900/50"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: getSiteColor(i) }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{site.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{count}</span>
                  {count > 0 && (
                    <Activity size={14} className="text-green-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
