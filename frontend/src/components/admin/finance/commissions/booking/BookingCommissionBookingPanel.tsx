
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Booking Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the booking associated with this commission.
// - Provide navigation to the related booking.
// - Keep booking identity presentation separate from commission identity.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Uses the shared CommissionBookingLink for navigation.
// - Does not fetch booking data or reconstruct a Booking model.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionBookingLink } from '../shared/CommissionBookingLink';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionBookingPanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionBookingPanel({
  commission,
  className,
}: BookingCommissionBookingPanelProps) {
  return (
    <Card
      padding="md"
      header="Related booking"
      className={className}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Booking public ID
        </p>

        <div className="min-w-0 break-all">
          <CommissionBookingLink
            publicId={commission.bookingPublicId}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Open the booking record to review its details and associated activity.
        </p>
      </div>
    </Card>
  );
}
