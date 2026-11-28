import { Card } from '@/components/ui';
import { CommissionAmount } from '../shared';

export interface CommissionRevenueSummaryProps {
  readonly title?: string;
  readonly description?: string;
  readonly totalCommissionAmount: number;
  readonly assessedCommissionAmount: number;
  readonly pendingCommissionAmount: number;
  readonly currency: string;
  readonly className?: string;
}

export function CommissionRevenueSummary({
  title = 'Commission Revenue',
  description = 'Overview of commission amounts by assessment status.',
  totalCommissionAmount,
  assessedCommissionAmount,
  pendingCommissionAmount,
  currency,
  className,
}: CommissionRevenueSummaryProps) {
  return (
    <Card className={className} padding="md">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h3>

        <p className="text-sm text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-[var(--foreground-secondary)]">
          Total commission
        </p>

        <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
          <CommissionAmount
            amount={totalCommissionAmount}
            currency={currency}
          />
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] bg-[var(--success-soft)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Assessed
          </p>

          <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--foreground)]">
            <CommissionAmount
              amount={assessedCommissionAmount}
              currency={currency}
            />
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] bg-[var(--warning-soft)] p-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Pending
          </p>

          <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--foreground)]">
            <CommissionAmount
              amount={pendingCommissionAmount}
              currency={currency}
            />
          </p>
        </div>
      </div>
    </Card>
  );
}