
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Identity Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the booking commission's public identity.
// - Display its current status.
// - Display the associated commission rule reference.
// - Display record creation and update timestamps.
//
// Architecture:
// - Receives the commission model from its parent.
// - Does not fetch data.
// - Does not calculate commission values.
// - Does not perform lifecycle operations.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionPublicId } from '../shared/CommissionPublicId';
import { CommissionStatusBadge } from '../shared/CommissionStatusBadge';
import { CommissionRuleLink } from '../shared/CommissionRuleLink';
import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionIdentityPanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionIdentityPanel({
  commission,
  className,
}: BookingCommissionIdentityPanelProps) {
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
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Status
          </dt>
          <dd>
            <CommissionStatusBadge
              status={commission.status}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Commission rule
          </dt>
          <dd>
            <CommissionRuleLink
              publicId={commission.commissionRulePublicId}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Created
          </dt>
          <dd>
            <CommissionDate
              value={commission.createdAt}
            />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Last updated
          </dt>
          <dd>
            <CommissionDate
              value={commission.updatedAt}
            />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
