
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Identity Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the earning commission's unique public ID.
// - Display its current lifecycle status.
// - Link to the associated commission rule.
// - Show record creation and update timestamps.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Displays identity and audit fields supplied by the backend.
// - Does not perform mutations or derive commission values.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/commissions/models';

import { CommissionPublicId } from '../shared/CommissionPublicId';
import { CommissionStatusBadge } from '../shared/CommissionStatusBadge';
import { CommissionRuleLink } from '../shared/CommissionRuleLink';
import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionIdentityPanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionIdentityPanel({
  commission,
  className,
}: EarningCommissionIdentityPanelProps) {
  return (
    <Card
      padding="md"
      header="Commission identity"
      className={className}
    >
      <dl className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Commission public ID
          </dt>

          <dd className="min-w-0">
            <CommissionPublicId
              publicId={commission.publicId}
              copyable
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Current status
          </dt>

          <dd>
            <CommissionStatusBadge status={commission.status} />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Commission rule
          </dt>

          <dd className="min-w-0 break-all">
            <CommissionRuleLink
              publicId={commission.commissionRulePublicId}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Created at
          </dt>

          <dd className="text-sm">
            <CommissionDate value={commission.createdAt} />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Last updated
          </dt>

          <dd className="text-sm">
            <CommissionDate value={commission.updatedAt} />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
