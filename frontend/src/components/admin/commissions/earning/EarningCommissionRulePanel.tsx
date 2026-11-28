
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Rule Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the commission rule associated with the earning commission.
// - Display the historical percentage captured on the commission.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Uses the historical percentage supplied by the backend.
// - Does not recalculate values using the current commission rule.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/commissions/models';

import { CommissionRuleLink } from '../shared/CommissionRuleLink';
import { CommissionPercentage } from '../shared/CommissionPercentage';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionRulePanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionRulePanel({
  commission,
  className,
}: EarningCommissionRulePanelProps) {
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
            Historical percentage
          </dt>

          <dd>
            <CommissionPercentage
              value={commission.percentage}
            />
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-muted-foreground">
        This percentage is the historical value stored on this commission.
        Changes to the current rule do not alter this record.
      </p>
    </Card>
  );
}
