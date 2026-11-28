
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Audit Information
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the commission record's creation timestamp.
// - Display the commission record's last update timestamp.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Displays audit timestamps supplied by the backend.
// - Does not infer or generate audit information.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionAuditInformationProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionAuditInformation({
  commission,
  className,
}: BookingCommissionAuditInformationProps) {
  return (
    <Card
      padding="md"
      header="Audit information"
      className={className}
    >
      <dl className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <dt className="text-sm text-muted-foreground">
            Record created
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
