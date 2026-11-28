
// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Audit Information
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the earning commission record's creation timestamp.
// - Display the earning commission record's last update timestamp.
//
// Architecture:
// - Receives the earning commission model from its parent.
// - Displays audit timestamps supplied by the backend.
// - Does not infer or generate audit information.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type {
  AdminEarningCommissionModel,
} from '@/features/admin/finance/commissions/models';

import { CommissionDate } from '../shared/CommissionDate';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface EarningCommissionAuditInformationProps {
  readonly commission: AdminEarningCommissionModel;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionAuditInformation({
  commission,
  className,
}: EarningCommissionAuditInformationProps) {
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
