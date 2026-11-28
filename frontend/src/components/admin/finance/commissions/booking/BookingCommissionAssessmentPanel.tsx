
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Assessment Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the financial figures recorded for the booking commission.
// - Show the historical assessment percentage.
// - Show when the commission was assessed, when available.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Uses backend-provided monetary values in minor units.
// - Does not recalculate or derive commission amounts.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionAmount } from '../shared/CommissionAmount';
import { CommissionDate } from '../shared/CommissionDate';
import { CommissionPercentage } from '../shared/CommissionPercentage';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionAssessmentPanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionAssessmentPanel({
  commission,
  className,
}: BookingCommissionAssessmentPanelProps) {
  return (
    <Card
      padding="md"
      header="Commission assessment"
      className={className}
    >
      <dl className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Commission base amount
          </dt>

          <dd>
            <CommissionAmount
              amount={commission.baseAmount}
              currency={commission.currency}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Assessment percentage
          </dt>

          <dd>
            <CommissionPercentage
              value={commission.percentage}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Commission amount
          </dt>

          <dd>
            <CommissionAmount
              amount={commission.commissionAmount}
              currency={commission.currency}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Assessed at
          </dt>

          <dd className="text-sm text-[var(--foreground)]">
            {commission.assessedAt ? (
              <CommissionDate value={commission.assessedAt} />
            ) : (
              'Not assessed'
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
