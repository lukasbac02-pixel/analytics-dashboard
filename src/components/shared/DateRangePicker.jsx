import { DATE_RANGES } from '../../lib/constants';

export function DateRangePicker({ value, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {DATE_RANGES.map(({ label, value: v }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === v
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
