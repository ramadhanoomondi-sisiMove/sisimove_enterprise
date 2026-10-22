
'use client';

import { ArrowUpRight, Files, MoreHorizontal } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import type { AssetModel } from '@/features/admin/assets/models';
import {
  AssetCategoryBadge,
  AssetStatusBadge,
  AssetTypeIcon,
  AssetVisibilityBadge,
} from '@/components/admin/assets/shared';

export interface AssetGridProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly assets: readonly AssetModel[];
  readonly loading?: boolean;
  readonly onOpenAsset?: (asset: AssetModel) => void;
  readonly onMoreActions?: (asset: AssetModel) => void;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toLocaleString(undefined, {
    maximumFractionDigits: index === 0 ? 0 : 1,
  })} ${units[index]}`;
}

function formatDate(date?: Date): string {
  if (!date || Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function AssetGridSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="rounded-xl border border-[var(--border)] p-4"
        >
          <div className="mb-5 flex items-start justify-between">
            <Skeleton className="size-11" radius="lg" />
            <Skeleton className="h-5 w-16" radius="full" />
          </div>
          <Skeleton className="mb-2 h-4 w-3/4" radius="sm" />
          <Skeleton className="mb-5 h-3 w-1/2" radius="sm" />
          <Skeleton className="mb-3 h-5 w-24" radius="sm" />
          <Skeleton className="h-3 w-2/3" radius="sm" />
        </div>
      ))}
    </>
  );
}

export function AssetGrid({
  assets,
  loading = false,
  onOpenAsset,
  onMoreActions,
  emptyTitle = 'No assets found',
  emptyDescription = 'Try changing your search or filters to find assets.',
  className,
  ...props
}: AssetGridProps) {
  return (
    <div
      {...props}
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
    >
      {loading ? (
        <AssetGridSkeleton />
      ) : assets.length > 0 ? (
        assets.map((asset) => {
          const name = asset.originalFilename?.trim() || asset.publicId;

          return (
            <article
              key={asset.publicId}
              className={cn(
                'group flex min-w-0 flex-col rounded-xl border',
                'border-[var(--border)] bg-[var(--background)] p-4',
                'transition-colors hover:border-[var(--brand)]/40',
                'hover:bg-[var(--muted)]/30',
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center',
                    'rounded-xl border border-[var(--border)]',
                    'bg-[var(--background-muted)]',
                  )}
                >
                  <AssetTypeIcon type={asset.type} />
                </div>

                <AssetStatusBadge status={asset.status} />
              </div>

              <div className="min-w-0">
                {onOpenAsset ? (
                  <button
                    type="button"
                    onClick={() => onOpenAsset(asset)}
                    title={name}
                    className={cn(
                      'block max-w-full truncate text-left text-sm',
                      'font-semibold text-[var(--foreground)]',
                      'hover:text-[var(--brand)]',
                      'focus-visible:outline-none focus-visible:underline',
                    )}
                  >
                    {name}
                  </button>
                ) : (
                  <h3 className="truncate text-sm font-semibold text-[var(--foreground)]" title={name}>
                    {name}
                  </h3>
                )}

                <p
                  title={asset.publicId}
                  className="mt-1 truncate font-mono text-xs text-[var(--muted-foreground)]"
                >
                  {asset.publicId}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <AssetCategoryBadge category={asset.category} />
                <AssetVisibilityBadge visibility={asset.visibility} />
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
                <div className="min-w-0">
                  <dt className="text-xs text-[var(--muted-foreground)]">
                    File size
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
                    {formatBytes(asset.sizeBytes)}
                  </dd>
                </div>

                <div className="min-w-0">
                  <dt className="text-xs text-[var(--muted-foreground)]">
                    Created
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
                    {formatDate(asset.createdAt)}
                  </dd>
                </div>
              </dl>

              {(onOpenAsset || onMoreActions) && (
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-[var(--border)] pt-3">
                  {onMoreActions && (
                    <button
                      type="button"
                      onClick={() => onMoreActions(asset)}
                      aria-label={`More actions for ${name}`}
                      title="More actions"
                      className={cn(
                        'inline-flex size-9 items-center justify-center rounded-lg',
                        'text-[var(--muted-foreground)] transition-colors',
                        'hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-[var(--brand)]',
                      )}
                    >
                      <MoreHorizontal aria-hidden="true" className="size-4" />
                    </button>
                  )}

                  {onOpenAsset && (
                    <button
                      type="button"
                      onClick={() => onOpenAsset(asset)}
                      className={cn(
                        'inline-flex min-h-9 items-center gap-2 rounded-lg',
                        'px-3 text-xs font-semibold text-[var(--brand)]',
                        'transition-colors hover:bg-[var(--brand-soft)]',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-[var(--brand)]',
                      )}
                    >
                      View details
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center rounded-xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[var(--muted)]">
            <Files
              aria-hidden="true"
              className="size-5 text-[var(--muted-foreground)]"
            />
          </div>

          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {emptyTitle}
          </h3>

          <p className="mt-1 max-w-md text-sm text-[var(--muted-foreground)]">
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  );
}

export default AssetGrid;
