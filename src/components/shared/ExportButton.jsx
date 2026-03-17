import { Download } from 'lucide-react';

export function ExportButton({ onExportCSV, onExportPDF }) {
  return (
    <div className="flex gap-1">
      <button
        onClick={onExportCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Download size={14} />
        CSV
      </button>
      <button
        onClick={onExportPDF}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Download size={14} />
        PDF
      </button>
    </div>
  );
}
