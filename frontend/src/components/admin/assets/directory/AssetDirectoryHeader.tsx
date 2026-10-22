
import type { HTMLAttributes, ReactNode } from 'react';
import { Files } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AssetDirectoryHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  readonly title?: string;
  readonly description?: string;
  readonly totalAssets: number;
  readonly filteredAssets?: number;
  readonly actions?: ReactNode;
  readonly loading?: boolean;
}

export function AssetDirectoryHeader({
  title = 'Asset directory',
  description = 'Browse and manage stored platform assets.',
  totalAssets,
  filteredAssets,
  actions,
  loading = false,
  className,
  ...props
}: AssetDirectoryHeaderProps) {
  const hasFilteredCount =
    filteredAssets !== undefined && filteredAssets !== totalAssets;

  const countLabel = hasFilteredCount
    ? `${filteredAssets.toLocaleString()} of ${totalAssets.toLocaleString()} assets`
    : `${totalAssets.toLocaleString()} ${totalAssets === 1 ? 'asset' : 'assets'}`;

  return (
    <div
      {...props}
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          aria-hidden="true"
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            'bg-[var(--brand-soft)] text-[var(--brand)]',
          )}
        >
          <Files className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">
            {description}
          </p>

          <p
            aria-live="polite"
            className="mt-2 text-xs font-medium text-[var(--muted-foreground)]"
          >
            {loading ? 'Loading assets…' : countLabel}
          </p>
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

export default AssetDirectoryHeader;
