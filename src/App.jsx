import { useState, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardGrid } from './components/layout/DashboardGrid';
import { LiveViewers } from './components/widgets/LiveViewers';
import { TrafficOverview } from './components/widgets/TrafficOverview';
import { TopPages } from './components/widgets/TopPages';
import { ReferrerBreakdown } from './components/widgets/ReferrerBreakdown';
import { UTMBreakdown } from './components/widgets/UTMBreakdown';
import { DeviceBreakdown } from './components/widgets/DeviceBreakdown';
import { ComparisonChart } from './components/widgets/ComparisonChart';
import { useSites } from './hooks/useSites';
import { useStats } from './hooks/useStats';
import { useLive } from './hooks/useLive';
import { useDarkMode } from './hooks/useDarkMode';
import { getDateRange } from './lib/formatters';
import { exportCSV, exportPDF } from './lib/export';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

export default function App() {
  const { sites, loading: sitesLoading } = useSites();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshKey, setRefreshKey] = useState(0);

  const { start, end } = getDateRange(dateRange);

  // Use first site as default when none selected
  const activeSiteId = selectedSiteId || (sites.length > 0 ? sites[0].id : null);

  const { stats, loading: statsLoading } = useStats(activeSiteId, start, end);
  const { liveData, refresh: refreshLive } = useLive();

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    refreshLive();
  }, [refreshLive]);

  const handleExportCSV = useCallback(() => {
    if (!stats?.timeline) return;
    exportCSV(stats.timeline, `analytics-${dateRange}`);
  }, [stats, dateRange]);

  const handleExportPDF = useCallback(() => {
    if (!stats?.timeline) return;
    const siteName = sites.find(s => s.id === activeSiteId)?.name || 'All Sites';
    exportPDF(
      `${siteName} - Analytics Report`,
      ['Date', 'Views', 'Sessions'],
      stats.timeline.map(r => [r.date, r.views, r.sessions]),
      `analytics-${siteName}-${dateRange}`
    );
  }, [stats, sites, activeSiteId, dateRange]);

  if (sitesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar
        sites={sites}
        selectedSiteId={selectedSiteId}
        onSelectSite={setSelectedSiteId}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          dark={dark}
          onToggleDark={toggleDark}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 overflow-y-auto p-4" key={refreshKey}>
          <DashboardGrid>
            <div key="live">
              <LiveViewers sites={sites} liveData={liveData} />
            </div>
            <div key="traffic">
              <TrafficOverview stats={stats} loading={statsLoading} />
            </div>
            <div key="pages">
              <TopPages stats={stats} loading={statsLoading} />
            </div>
            <div key="referrers">
              <ReferrerBreakdown siteId={activeSiteId} start={start} end={end} />
            </div>
            <div key="devices">
              <DeviceBreakdown stats={stats} loading={statsLoading} />
            </div>
            <div key="utm">
              <UTMBreakdown siteId={activeSiteId} start={start} end={end} />
            </div>
            <div key="comparison">
              <ComparisonChart sites={sites} start={start} end={end} />
            </div>
          </DashboardGrid>
        </main>
      </div>
    </div>
  );
}
