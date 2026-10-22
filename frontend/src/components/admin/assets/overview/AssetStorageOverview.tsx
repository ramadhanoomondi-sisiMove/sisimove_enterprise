
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Asset Storage Overview
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Summarize storage usage reported by the parent.
 * - Display storage distribution by provider.
 * - Reuse shared Card, Badge, and Skeleton components.
 * - Support loading and empty states.
 *
 * This component does not fetch storage metrics or infer provider quotas.
 * -----------------------------------------------------------------------------
 */

import { HardDrive, Database } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { AssetStorageProvider } from '@/features/admin/assets/models';

import { cn } from '@/foundation/utils/cn';

// =============================================================================
// Types
// =============================================================================

export interface AssetStorageProviderUsage {
  readonly provider: AssetStorageProvider;
  readonly assetCount: number;
  readonly sizeBytes: number;
}

export interface AssetStorageOverviewProps {
  readonly totalSizeBytes: number;
  readonly totalAssets: number;
  readonly providers: readonly AssetStorageProviderUsage[];
  readonly loading?: boolean;
  readonly className?: string;
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
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} ${units[unitIndex]}`;
}

function formatProvider(provider: AssetStorageProvider): string {
  return provider
    .split('_')
    .map((part) =>
      part === 'AWS' || part === 'GCP'
        ? part
        : part.charAt(0) + part.slice(1).toLowerCase(),
    )
    .join(' ');
}

// =============================================================================
// Component
// =============================================================================

export function AssetStorageOverview({
  totalSizeBytes,
  totalAssets,
  providers,
  loading = false,
  className,
}: AssetStorageOverviewProps) {
  const validTotalSize =
    Number.isFinite(totalSizeBytes) && totalSizeBytes >= 0
      ? totalSizeBytes
      : 0;

  const validTotalAssets =
    Number.isFinite(totalAssets) && totalAssets >= 0
      ? totalAssets
      : 0;

  const providerTotalBytes = providers.reduce(
    (total, provider) =>
      total +
      (Number.isFinite(provider.sizeBytes) && provider.sizeBytes > 0
        ? provider.sizeBytes
        : 0),
    0,
  );

  return (
    <Card
      className={cn(
        'min-w-0 border border-[var(--border)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Storage overview
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Reported storage consumption by provider
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <HardDrive size={20} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Database size={16} aria-hidden="true" />
            Total storage
          </div>

          {loading ? (
            <Skeleton className="mt-3 h-7 w-28" />
          ) : (
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {formatBytes(validTotalSize)}
            </p>
          )}
        </div>

        <div className="rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Total assets
          </p>

          {loading ? (
            <Skeleton className="mt-3 h-7 w-20" />
          ) : (
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {validTotalAssets.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Storage providers
          </h3>

          {!loading && (
            <Badge variant="default">
              {providers.length} providers
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <p className="text-sm text-[var(--foreground-muted)]">
            No storage provider usage data is available.
          </p>
        ) : (
          <div className="space-y-4">
            {providers.map((providerUsage) => {
              const safeSize =
                Number.isFinite(providerUsage.sizeBytes) &&
                providerUsage.sizeBytes > 0
                  ? providerUsage.sizeBytes
                  : 0;

              const percentage =
                providerTotalBytes > 0
                  ? (safeSize / providerTotalBytes) * 100
                  : 0;

              return (
                <div
                  key={providerUsage.provider}
                  className="space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--foreground-secondary)]">
                      {formatProvider(providerUsage.provider)}
                    </span>

                    <span className="text-sm tabular-nums text-[var(--foreground)]">
                      {formatBytes(safeSize)}
                      <span className="ml-2 text-xs text-[var(--foreground-muted)]">
                        {percentage.toFixed(1)}%
                      </span>
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                    role="progressbar"
                    aria-label={`${formatProvider(providerUsage.provider)} storage share`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                  >
                    <div
                      className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-[var(--foreground-muted)]">
                    {providerUsage.assetCount.toLocaleString()} assets
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

export default AssetStorageOverview;
