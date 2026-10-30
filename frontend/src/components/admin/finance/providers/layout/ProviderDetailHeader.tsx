
import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface ProviderDetailHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
  metadata?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ProviderDetailHeader({
  title,
  description,
  breadcrumb,
  metadata,
  status,
  actions,
  className,
}: ProviderDetailHeaderProps) {
  return (
    <header
      className={cn(
        'space-y-4',
        className,
      )}
    >
      {breadcrumb && (
        <div className="text-sm text-muted-foreground">
          {breadcrumb}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>

            {status}
          </div>

          {description && (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}

          {metadata && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {metadata}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
