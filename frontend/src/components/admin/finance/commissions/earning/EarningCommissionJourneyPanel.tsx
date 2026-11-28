
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Journey Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the journey associated with the earning commission.
// - Link to the related journey record.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Uses the journey public ID supplied by the backend.
// - Does not fetch or modify journey information.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionJourneyLink } from '../shared/CommissionJourneyLink';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionJourneyPanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionJourneyPanel({
  commission,
  className,
}: EarningCommissionJourneyPanelProps) {
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
      </div>
    </Card>
  );
}
