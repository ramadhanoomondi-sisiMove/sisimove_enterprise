
import { Card } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import { ProviderSectionHeader } from '../layout';

export interface ProviderEnvironmentDistributionProps {
  distribution: Record<string, number>;
  className?: string;
}

const PROVIDER_ENVIRONMENT_LABELS: Record<string, string> = {
  SANDBOX: 'Sandbox',
  PRODUCTION: 'Production',
};

export function ProviderEnvironmentDistribution({
  distribution,
  className,
}: ProviderEnvironmentDistributionProps) {
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
        title="Provider Environments"
        description="Distribution across sandbox and production environments."
      />

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No environment data available.
        </p>
      ) : (
        <div className="space-y-5">
          {entries.map(([environment, count]) => {
            const percentage =
              total > 0 ? (count / total) * 100 : 0;

            const label =
              PROVIDER_ENVIRONMENT_LABELS[environment] ?? environment;

            return (
              <div key={environment} className="space-y-2">
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
