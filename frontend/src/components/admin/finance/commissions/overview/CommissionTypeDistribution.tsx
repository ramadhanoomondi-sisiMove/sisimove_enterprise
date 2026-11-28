// src/components/admin/commissions/overview/CommissionTypeDistribution.tsx

import { Card } from '@/components/ui';

export interface CommissionTypeDistributionItem {
  readonly label: string;
  readonly count: number;
  readonly percentage: number;
}

export interface CommissionTypeDistributionProps {
  readonly items: readonly CommissionTypeDistributionItem[];
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

export function CommissionTypeDistribution({
  items,
  title = 'Commission by Type',
  description = 'Distribution of booking and earning commissions.',
  className,
}: CommissionTypeDistributionProps) {
  return (
    <Card
      padding="md"
      className={['min-w-0', className].filter(Boolean).join(' ')}
    >
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {items.map((item) => {
          const percentage = Number.isFinite(item.percentage)
            ? Math.min(100, Math.max(0, item.percentage))
            : 0;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {item.label}
                </span>

                <span className="shrink-0 text-sm tabular-nums text-[var(--foreground-muted)]">
                  {item.count.toLocaleString()} ({percentage}%)
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                role="progressbar"
                aria-label={`${item.label} share`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
              >
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}