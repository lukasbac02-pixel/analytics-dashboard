import { BarChart3, Globe } from 'lucide-react';
import { getSiteColor } from '../../lib/constants';

export function Sidebar({ sites, selectedSiteId, onSelectSite }) {
  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-indigo-500" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Analytics</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <button
          onClick={() => onSelectSite(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            !selectedSiteId
              ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 dark:hover:bg-gray-900/50'
          }`}
        >
          <Globe size={16} />
          All Sites
        </button>

        <div className="pt-2">
          <p className="px-3 py-1 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Sites
          </p>
        </div>

        {sites.map((site, i) => (
          <button
            key={site.id}
            onClick={() => onSelectSite(site.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedSiteId === site.id
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: getSiteColor(i) }}
            />
            <span className="truncate">{site.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          {sites.length} sites tracked
        </p>
      </div>
    </aside>
  );
}
