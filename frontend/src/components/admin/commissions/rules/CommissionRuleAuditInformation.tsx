
import type { AdminCommissionRuleModel } from '@/features/admin/commissions';
import { Card } from '@/components/ui';
import { CommissionDate } from '../shared/CommissionDate';

export interface CommissionRuleAuditInformationProps {
  readonly rule: AdminCommissionRuleModel;
  readonly className?: string;
}

export function CommissionRuleAuditInformation({
  rule,
  className,
}: CommissionRuleAuditInformationProps) {
  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Audit Information
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Record creation and last modification details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Created At
            </p>
            <CommissionDate value={rule.createdAt} />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Last Updated
            </p>
            <CommissionDate value={rule.updatedAt} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CommissionRuleAuditInformation;
