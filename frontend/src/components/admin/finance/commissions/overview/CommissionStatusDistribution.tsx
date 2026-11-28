// src/components/admin/commissions/overview/CommissionStatusDistribution.tsx

import { Card } from '@/components/ui';

export interface CommissionStatusDistributionItem {
  readonly label: string;
  readonly count: number;
  readonly percentage: number;
}

export interface CommissionStatusDistributionProps {
  readonly items: readonly CommissionStatusDistributionItem[];
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
}

const statusBarClasses: Record<string, string> = {
  PENDING: 'bg-[var(--warning)]',
  ASSESSED: 'bg-[var(--success)]',
  CANCELLED: 'bg-[var(--danger)]',
};

function getStatusBarClass(label: string): string {
  return statusBarClasses[label.trim().toUpperCase()] ??
    'bg-[var(--brand)]';
}

export function CommissionStatusDistribution({
  items,
  title = 'Commission by Status',
  description = 'Distribution of commissions across their current statuses.',
  className,
}: CommissionStatusDistributionProps) {
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
                  className={[
                    'h-full',
                    'rounded-full',
                    'transition-[width]',
                    'duration-300',
                    getStatusBarClass(item.label),
                  ].join(' ')}
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