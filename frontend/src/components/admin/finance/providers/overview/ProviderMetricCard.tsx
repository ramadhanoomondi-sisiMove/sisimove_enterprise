
import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

import { cn } from '@/foundation/utils/cn';

export interface ProviderMetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function ProviderMetricCard({
  title,
  value,
  description,
  icon,
  className,
}: ProviderMetricCardProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        'flex h-full flex-col justify-between gap-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>

        {icon && (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-muted)] text-[var(--foreground-secondary)]"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>

        {description && (
          <p className="text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
