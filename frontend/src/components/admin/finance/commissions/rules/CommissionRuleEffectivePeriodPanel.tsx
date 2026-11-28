
import type { AdminCommissionRuleModel } from '@/features/admin/finance/commissions';
import { Card } from '@/components/ui';
import { CommissionDate } from '../shared/CommissionDate';

export interface CommissionRuleEffectivePeriodPanelProps {
  readonly rule: AdminCommissionRuleModel;
  readonly className?: string;
}

export function CommissionRuleEffectivePeriodPanel({
  rule,
  className,
}: CommissionRuleEffectivePeriodPanelProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Effective Period
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The period during which this commission rule applies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Effective From
            </p>
            <CommissionDate value={rule.effectiveFrom} />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Effective To
            </p>

            {rule.effectiveTo ? (
              <CommissionDate value={rule.effectiveTo} />
            ) : (
              <span className="text-sm text-muted-foreground">
                No end date
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CommissionRuleEffectivePeriodPanel;
