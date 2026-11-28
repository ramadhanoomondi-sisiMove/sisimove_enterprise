
import type { AdminCommissionRuleModel } from '@/features/admin/commissions';
import { Card } from '@/components/ui';

export interface CommissionRuleLifecyclePanelProps {
  readonly rule: AdminCommissionRuleModel;
  readonly className?: string;
}

export function CommissionRuleLifecyclePanel({
  rule,
  className,
}: CommissionRuleLifecyclePanelProps) {
  const isActive = rule.status === 'ACTIVE';

  return (
    <Card
      variant="default"
      padding="lg"
      className={className}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Lifecycle
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Current activation state of this commission rule.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Current Status
          </p>

          <span
            className={[
              'inline-flex',
              'items-center',
              'rounded-full',
              'px-3',
              'py-1',
              'text-xs',
              'font-semibold',
              isActive
                ? 'bg-[var(--success-subtle)] text-[var(--success)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
            ].join(' ')}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default CommissionRuleLifecyclePanel;
