import { BarChart3 } from 'lucide-react';

export function EmptyState({ message = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
      <BarChart3 size={32} className="mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
