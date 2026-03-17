export function Card({ title, children, className = '', dragHandle = false }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 h-full flex flex-col ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${dragHandle ? 'drag-handle cursor-grab' : ''}`}>
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
