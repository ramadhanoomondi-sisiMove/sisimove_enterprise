
// -----------------------------------------------------------------------------
// sisiMove Admin — Booking Commission Journey Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the journey associated with the booking commission.
// - Provide navigation to the related journey.
// - Keep journey reference presentation separate from booking identity.
//
// Architecture:
// - Receives the booking commission model from its parent.
// - Uses the shared CommissionJourneyLink for navigation.
// - Does not fetch journey data or reconstruct a Journey model.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionJourneyLink } from '../shared/CommissionJourneyLink';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface BookingCommissionJourneyPanelProps {
  readonly commission: AdminBookingCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionJourneyPanel({
  commission,
  className,
}: BookingCommissionJourneyPanelProps) {
  return (
    <Card
      padding="md"
      header="Related journey"
      className={className}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Journey public ID
        </p>

        <div className="min-w-0 break-all">
          <CommissionJourneyLink
            publicId={commission.journeyPublicId}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Open the journey record to review its details and related activity.
        </p>
      </div>
    </Card>
  );
}
