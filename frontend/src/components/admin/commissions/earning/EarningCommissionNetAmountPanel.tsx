
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Net Amount Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the net amount retained for the provider earning commission.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Uses the net amount supplied by the backend.
// - Does not calculate net earnings or subtract commission amounts.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/commissions/models';

import { CommissionAmount } from '../shared/CommissionAmount';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionNetAmountPanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionNetAmountPanel({
  commission,
  className,
}: EarningCommissionNetAmountPanelProps) {
  return (
    <Card
      padding="md"
      header="Provider net earnings"
      className={className}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Net amount
        </p>

        <p className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">
          <CommissionAmount
            amount={commission.netAmount}
            currency={commission.currency}
          />
        </p>

        <p className="text-sm text-muted-foreground">
          This is the net amount recorded by the backend for this earning
          commission.
        </p>
      </div>
    </Card>
  );
}
