
'use client';

import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';
import type { AssetModel } from '@/features/admin/assets/models';
import {
  AssetCategoryBadge,
  AssetStatusBadge,
  AssetTypeIcon,
  AssetVisibilityBadge,
} from '@/components/admin/assets/shared';

export interface AssetTableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onClick'> {
  readonly asset: AssetModel;
  readonly onOpen?: (asset: AssetModel) => void;
  readonly onMoreActions?: (asset: AssetModel) => void;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const size = bytes / 1024 ** unitIndex;

  return `${size.toLocaleString(undefined, {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
  })} ${units[unitIndex]}`;
}

function formatDate(date?: Date): string {
  if (!date || Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getAssetName(asset: AssetModel): string {
  return asset.originalFilename?.trim() || asset.publicId;
}

export function AssetTableRow({
  asset,
  onOpen,
  onMoreActions,
  className,
  ...props
}: AssetTableRowProps) {
  const assetName = getAssetName(asset);

  return (
    <tr
      {...props}
      className={cn(
        'group border-b border-[var(--border)] last:border-b-0',
        'transition-colors hover:bg-[var(--muted)]/50',
        className,
      )}
    >
      <td className="px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-lg',
              'border border-[var(--border)] bg-[var(--background)]',
            )}
          >
            <AssetTypeIcon type={asset.type} />
          </div>

          <div className="min-w-0">
            {onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(asset)}
                className={cn(
                  'max-w-full truncate text-left text-sm font-semibold',
                  'text-[var(--foreground)] hover:text-[var(--brand)]',
                  'focus-visible:outline-none focus-visible:underline',
                )}
                title={assetName}
              >
                {assetName}
              </button>
            ) : (
              <p
                className="max-w-xs truncate text-sm font-semibold text-[var(--foreground)]"
                title={assetName}
              >
                {assetName}
              </p>
            )}

            <p
              className="mt-1 max-w-xs truncate font-mono text-xs text-[var(--muted-foreground)]"
              title={asset.publicId}
            >
              {asset.publicId}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <AssetCategoryBadge category={asset.category} />
      </td>

      <td className="px-4 py-4">
        <AssetStatusBadge status={asset.status} />
      </td>

      <td className="px-4 py-4">
        <AssetVisibilityBadge visibility={asset.visibility} />
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--foreground)]">
        {formatBytes(asset.sizeBytes)}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--muted-foreground)]">
        {formatDate(asset.createdAt)}
      </td>

      <td className="px-4 py-4 text-right">
        <div className="inline-flex items-center justify-end gap-1">
          {onOpen && (
            <button
              type="button"
              onClick={() => onOpen(asset)}
              aria-label={`Open ${assetName}`}
              title="Open asset"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-lg',
                'text-[var(--muted-foreground)] transition-colors',
                'hover:bg-[var(--background)] hover:text-[var(--brand)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
              )}
            >
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </button>
          )}

          {onMoreActions && (
            <button
              type="button"
              onClick={() => onMoreActions(asset)}
              aria-label={`More actions for ${assetName}`}
              title="More actions"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-lg',
                'text-[var(--muted-foreground)] transition-colors',
                'hover:bg-[var(--background)] hover:text-[var(--foreground)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
              )}
            >
              <MoreHorizontal aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default AssetTableRow;
