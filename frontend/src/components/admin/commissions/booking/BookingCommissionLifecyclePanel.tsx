
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Lifecycle Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the commission's current lifecycle status.
// - Show the timestamps associated with its lifecycle.
// - Distinguish assessment and cancellation timestamps.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Displays lifecycle values supplied by the backend.
// - Does not perform lifecycle transitions.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/commissions/models';

import { CommissionStatusBadge } from '../shared/CommissionStatusBadge';
import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionLifecyclePanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionLifecyclePanel({
  commission,
  className,
}: BookingCommissionLifecyclePanelProps) {
  return (
    <Card
      padding="md"
      header="Commission lifecycle"
      className={className}
    >
      <dl className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Current status
          </dt>

          <dd>
            <CommissionStatusBadge
              status={commission.status}
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
            Assessed at
          </dt>

          <dd className="text-sm">
            <CommissionDate value={commission.assessedAt} />
          </dd>
        </div>

        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Cancelled at
          </dt>

          <dd className="text-sm">
            <CommissionDate value={commission.cancelledAt} />
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
