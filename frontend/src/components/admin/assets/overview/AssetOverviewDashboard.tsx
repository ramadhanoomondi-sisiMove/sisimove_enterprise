
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Overview Dashboard
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Compose the asset overview sections into one dashboard.
 * - Display headline metrics, lifecycle, category, storage, and health summaries.
 * - Pass data and loading states to the corresponding child components.
 *
 * Architecture:
 * - Presentation and composition only.
 * - Does not fetch assets or derive aggregates from raw asset records.
 * - All metric data must be supplied by the parent.
 *
 * -----------------------------------------------------------------------------
 */

import { Boxes, CheckCircle2, Archive, HardDrive } from 'lucide-react';

import { AssetMetricCard } from './AssetMetricCard';
import { AssetLifecycleSummary } from './AssetLifecycleSummary';
import { AssetCategoryBreakdown } from './AssetCategoryBreakdown';
import { AssetStorageOverview } from './AssetStorageOverview';
import { AssetHealthPanel } from './AssetHealthPanel';

import type { AssetLifecycleCount } from './AssetLifecycleSummary';
import type { AssetCategoryCount } from './AssetCategoryBreakdown';
import type { AssetStorageProviderUsage } from './AssetStorageOverview';
import type { AssetHealthIssue } from './AssetHealthPanel';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface AssetOverviewMetrics {
  readonly totalAssets: number;
  readonly readyAssets: number;
  readonly archivedAssets: number;
  readonly totalStorageBytes: number;
}

export interface AssetOverviewDashboardProps {
  readonly metrics: AssetOverviewMetrics;
  readonly lifecycle: readonly AssetLifecycleCount[];
  readonly categories: readonly AssetCategoryCount[];
  readonly storageProviders: readonly AssetStorageProviderUsage[];
  readonly healthIssues: readonly AssetHealthIssue[];
  readonly loading?: boolean;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function AssetOverviewDashboard({
  metrics,
  lifecycle,
  categories,
  storageProviders,
  healthIssues,
  loading = false,
  className,
}: AssetOverviewDashboardProps) {
  return (
    <section
      aria-label="Asset overview dashboard"
      aria-busy={loading}
      className={cn('space-y-6', className)}
    >
      {/* Headline metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssetMetricCard
          title="Total assets"
          value={metrics.totalAssets.toLocaleString()}
          description="Across all categories"
          icon={<Boxes size={20} />}
          variant="brand"
          loading={loading}
        />

        <AssetMetricCard
          title="Ready assets"
          value={metrics.readyAssets.toLocaleString()}
          description="Assets in the ready state"
          icon={<CheckCircle2 size={20} />}
          variant="success"
          loading={loading}
        />

        <AssetMetricCard
          title="Archived assets"
          value={metrics.archivedAssets.toLocaleString()}
          description="Assets currently archived"
          icon={<Archive size={20} />}
          variant="default"
          loading={loading}
        />

        <AssetMetricCard
          title="Storage used"
          value={formatBytes(metrics.totalStorageBytes)}
          description="Combined reported asset size"
          icon={<HardDrive size={20} />}
          variant="brand"
          loading={loading}
        />
      </div>

      {/* Lifecycle and category summaries */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <AssetLifecycleSummary
          items={lifecycle}
          loading={loading}
        />

        <AssetCategoryBreakdown
          items={categories}
          loading={loading}
        />
      </div>

      {/* Storage and health */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <AssetStorageOverview
          totalSizeBytes={metrics.totalStorageBytes}
          totalAssets={metrics.totalAssets}
          providers={storageProviders}
          loading={loading}
        />

        <AssetHealthPanel
          issues={healthIssues}
          loading={loading}
        />
      </div>
    </section>
  );
}

// =============================================================================
// Formatting
// =============================================================================

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '—';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} ${units[index]}`;
}

export default AssetOverviewDashboard;
