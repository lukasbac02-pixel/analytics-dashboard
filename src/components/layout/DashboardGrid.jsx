import { useState, useCallback, useRef } from 'react';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

const STORAGE_KEY = 'dashboard-layout';

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'live', x: 0, y: 0, w: 6, h: 4 },
    { i: 'traffic', x: 6, y: 0, w: 6, h: 4 },
    { i: 'pages', x: 0, y: 4, w: 4, h: 5 },
    { i: 'referrers', x: 4, y: 4, w: 4, h: 5 },
    { i: 'devices', x: 8, y: 4, w: 4, h: 5 },
    { i: 'utm', x: 0, y: 9, w: 6, h: 4 },
    { i: 'comparison', x: 6, y: 9, w: 6, h: 5 },
  ],
  md: [
    { i: 'live', x: 0, y: 0, w: 5, h: 4 },
    { i: 'traffic', x: 5, y: 0, w: 5, h: 4 },
    { i: 'pages', x: 0, y: 4, w: 5, h: 5 },
    { i: 'referrers', x: 5, y: 4, w: 5, h: 5 },
    { i: 'devices', x: 0, y: 9, w: 5, h: 5 },
    { i: 'utm', x: 5, y: 9, w: 5, h: 4 },
    { i: 'comparison', x: 0, y: 14, w: 10, h: 5 },
  ],
  sm: [
    { i: 'live', x: 0, y: 0, w: 6, h: 4 },
    { i: 'traffic', x: 0, y: 4, w: 6, h: 4 },
    { i: 'pages', x: 0, y: 8, w: 6, h: 5 },
    { i: 'referrers', x: 0, y: 13, w: 6, h: 5 },
    { i: 'devices', x: 0, y: 18, w: 6, h: 5 },
    { i: 'utm', x: 0, y: 23, w: 6, h: 4 },
    { i: 'comparison', x: 0, y: 27, w: 6, h: 5 },
  ],
};

function loadLayouts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUTS;
  } catch {
    return DEFAULT_LAYOUTS;
  }
}

export function DashboardGrid({ children }) {
  const containerRef = useRef(null);
  const width = useContainerWidth(containerRef);
  const [layouts, setLayouts] = useState(loadLayouts);

  const handleLayoutChange = useCallback((_, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
  }, []);

  return (
    <div ref={containerRef}>
      {width > 0 && (
        <ResponsiveGridLayout
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 900, sm: 0 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={40}
          draggableHandle=".drag-handle"
          onLayoutChange={handleLayoutChange}
          compactType="vertical"
          margin={[16, 16]}
        >
          {children}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
