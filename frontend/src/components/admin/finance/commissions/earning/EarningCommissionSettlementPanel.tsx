
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Settlement Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the settlement associated with the earning commission.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Uses the settlement public ID supplied by the backend.
// - Does not infer settlement status or settlement amounts.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionPublicId } from '../shared/CommissionPublicId';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionSettlementPanelProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionSettlementPanel({
  commission,
  className,
}: EarningCommissionSettlementPanelProps) {
  return (
    <Card
      padding="md"
      header="Related settlement"
      className={className}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Settlement public ID
        </p>

        <div className="min-w-0">
          <CommissionPublicId
            publicId={commission.settlementPublicId}
            copyable
          />
        </div>
      </div>
    </Card>
  );
}
