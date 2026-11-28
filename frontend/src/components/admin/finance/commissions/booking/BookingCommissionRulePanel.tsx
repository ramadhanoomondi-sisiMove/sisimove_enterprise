
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Rule Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the commission rule reference.
// - Display the percentage recorded on the commission.
// - Link to the associated commission rule.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Uses the historical percentage stored on the commission.
// - Does not fetch or recalculate the current rule.
// - Does not determine commission lifecycle decisions.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionRuleLink } from '../shared/CommissionRuleLink';
import { CommissionPercentage } from '../shared/CommissionPercentage';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionRulePanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionRulePanel({
  commission,
  className,
}: BookingCommissionRulePanelProps) {
  return (
    <Card
      padding="md"
      header="Commission rule"
      className={className}
    >
      <dl className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Rule public ID
          </dt>

          <dd className="min-w-0 break-all">
            <CommissionRuleLink
              publicId={commission.commissionRulePublicId}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Assessed percentage
          </dt>

          <dd>
            <CommissionPercentage
              value={commission.percentage}
            />
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-muted-foreground">
        The percentage shown is the historical value recorded when this
        commission was created. It is not recalculated from the current rule.
      </p>
    </Card>
  );
}
