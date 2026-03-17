import { getSiteColor } from '../../lib/constants';

export function SiteSelector({ sites, selected, onChange, multi = false }) {
  const handleClick = (siteId) => {
    if (multi) {
      const next = selected.includes(siteId)
        ? selected.filter(id => id !== siteId)
        : [...selected, siteId];
      onChange(next);
    } else {
      onChange(siteId);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sites.map((site, i) => {
        const isActive = multi ? selected.includes(site.id) : selected === site.id;
        return (
          <button
            key={site.id}
            onClick={() => handleClick(site.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isActive
                ? 'border-current shadow-sm'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
            }`}
            style={isActive ? { color: getSiteColor(i), borderColor: getSiteColor(i) } : {}}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getSiteColor(i) }}
            />
            {site.name}
          </button>
        );
      })}
    </div>
  );
}
