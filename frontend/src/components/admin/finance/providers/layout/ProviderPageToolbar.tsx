
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface ProviderPageToolbarProps {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ProviderPageToolbar({
  search,
  filters,
  actions,
  className,
}: ProviderPageToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        className,
      )}
    >
      {(search || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {search && (
            <div className="min-w-0 flex-1">
              {search}
            </div>
          )}

          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters}
        </div>
      )}
    </div>
  );
}
