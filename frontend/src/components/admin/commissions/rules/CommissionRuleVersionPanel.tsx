
import type { AdminCommissionRuleModel } from '@/features/admin/commissions';
import { Card } from '@/components/ui';

export interface CommissionRuleVersionPanelProps {
  readonly rule: AdminCommissionRuleModel;
  readonly className?: string;
}

export function CommissionRuleVersionPanel({
  rule,
  className,
}: CommissionRuleVersionPanelProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Version Information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Version identifier for this commission rule.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Current Version
          </p>

          <p className="text-2xl font-semibold tabular-nums text-foreground">
            v{rule.version}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default CommissionRuleVersionPanel;
