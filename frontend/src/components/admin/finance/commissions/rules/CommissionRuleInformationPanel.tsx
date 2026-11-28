
'use client';

import type { AdminCommissionRuleModel } from '@/features/admin/finance/commissions';
import { Card } from '@/components/ui';
import {
  CommissionPublicId,
  CommissionTypeBadge,
  CommissionPercentage,
} from '../shared';

export interface CommissionRuleInformationPanelProps {
  readonly rule: AdminCommissionRuleModel;
  readonly className?: string;
}

export function CommissionRuleInformationPanel({
  rule,
  className,
}: CommissionRuleInformationPanelProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Rule Information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Core identity and commission configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Rule ID
            </p>
            <CommissionPublicId
              publicId={rule.publicId}
              copyable
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Commission Type
            </p>
            <div>
              <CommissionTypeBadge type={rule.type} />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Commission Percentage
            </p>
            <CommissionPercentage value={rule.percentage} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CommissionRuleInformationPanel;
