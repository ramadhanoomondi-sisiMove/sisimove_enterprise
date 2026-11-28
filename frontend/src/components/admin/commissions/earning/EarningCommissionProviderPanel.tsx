
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Provider Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the provider associated with the earning commission.
// - Link to the provider's admin record.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Uses the provider public ID supplied by the backend.
// - Does not fetch or modify provider information.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/commissions/models';

import { CommissionProviderLink } from '../shared/CommissionProviderLink';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionProviderPanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionProviderPanel({
  commission,
  className,
}: EarningCommissionProviderPanelProps) {
  return (
    <Card
      padding="md"
      header="Related provider"
      className={className}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Provider public ID
        </p>

        <div className="min-w-0 break-all">
          <CommissionProviderLink
            publicId={commission.providerPublicId}
          />
        </div>
      </div>
    </Card>
  );
}
