import { Moon, Sun, RefreshCw } from 'lucide-react';
import { DateRangePicker } from '../shared/DateRangePicker';
import { ExportButton } from '../shared/ExportButton';

export function Header({ dark, onToggleDark, dateRange, onDateRangeChange, onExportCSV, onExportPDF, onRefresh }) {
  return (
    <header className="h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
      <DateRangePicker value={dateRange} onChange={onDateRangeChange} />

      <div className="flex items-center gap-2">
        <ExportButton onExportCSV={onExportCSV} onExportPDF={onExportPDF} />

        <button
          onClick={onRefresh}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>

        <button
          onClick={onToggleDark}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
