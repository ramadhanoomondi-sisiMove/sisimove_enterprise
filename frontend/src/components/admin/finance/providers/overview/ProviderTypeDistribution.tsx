
import { Card } from '@/components/ui';

import { cn } from '@/foundation/utils/cn';

import { ProviderSectionHeader } from '../layout';

export interface ProviderTypeDistributionProps {
  distribution: Record<string, number>;
  className?: string;
}

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  MOBILE_MONEY: 'Mobile Money',
  BANK: 'Bank',
  CARD_PROCESSOR: 'Card Processor',
  PAYMENT_GATEWAY: 'Payment Gateway',
  DIGITAL_WALLET: 'Digital Wallet',
  OTHER: 'Other',
};

export function ProviderTypeDistribution({
  distribution,
  className,
}: ProviderTypeDistributionProps) {
  const entries = Object.entries(distribution).sort(
    ([, countA], [, countB]) => countB - countA,
  );

  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0,
  );

  return (
    <Card
      padding="lg"
      className={cn('space-y-5', className)}
    >
      <ProviderSectionHeader
        title="Provider Types"
        description="Distribution across payment integration types."
      />

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No provider type data available.
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map(([type, count]) => {
            const percentage =
              total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {PROVIDER_TYPE_LABELS[type] ?? type}
                  </span>

                  <span className="text-sm tabular-nums text-muted-foreground">
                    {count}
                    <span className="ml-2">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-[var(--background-muted)]"
                  role="progressbar"
                  aria-label={`${PROVIDER_TYPE_LABELS[type] ?? type} providers`}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={count}
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
      )}

      <div className="border-t border-[var(--border)] pt-4">
        <div className="flex items-center justify-between">
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
