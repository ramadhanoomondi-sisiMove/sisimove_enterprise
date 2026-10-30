
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import { ProviderSectionHeader } from '../layout';

export interface ProviderStatusDistributionProps {
  distribution: Record<string, number>;
  className?: string;
}

const PROVIDER_STATUS_LABELS: Record<string, string> = {
  NOT_CONFIGURED: 'Not Configured',
  CONFIGURING: 'Configuring',
  READY: 'Ready',
  DEGRADED: 'Degraded',
  SUSPENDED: 'Suspended',
};

export function ProviderStatusDistribution({
  distribution,
  className,
}: ProviderStatusDistributionProps) {
  const entries = Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .sort(([, countA], [, countB]) => countB - countA);

  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <Card
      padding="lg"
      className={cn('flex h-full flex-col gap-6', className)}
    >
      <ProviderSectionHeader
        title="Provider Status"
        description="Overview of provider readiness and operational status."
      />

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No status data available.
        </p>
      ) : (
        <div className="space-y-5">
          {entries.map(([status, count]) => {
            const percentage =
              total > 0 ? (count / total) * 100 : 0;

            const label =
              PROVIDER_STATUS_LABELS[status] ?? status;

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {label}
                  </span>

                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                  role="progressbar"
                  aria-label={`${label} providers`}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={count}
                >
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-[width]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-auto border-t border-[var(--border)] pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            Total providers
          </span>

          <span className="text-sm font-semibold tabular-nums text-foreground">
            {total}
          </span>
        </div>
      </div>
    </Card>
  );
}
