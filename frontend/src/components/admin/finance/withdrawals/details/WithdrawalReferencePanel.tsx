import { Card } from '@/components/ui';
import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { WithdrawalReference } from '../shared/WithdrawalReference';

export interface WithdrawalReferencePanelProps {
  withdrawal: AdminWithdrawal;
  className?: string;
}

export function WithdrawalReferencePanel({
  withdrawal,
  className,
}: WithdrawalReferencePanelProps) {
  const hasReference = Boolean(
    withdrawal.referenceType || withdrawal.referencePublicId,
  );

  return (
    <Card className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Business reference
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Optional reference associated with this withdrawal.
      </p>

      {hasReference ? (
        <div className="mt-4 space-y-2">
          {withdrawal.referenceType && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">
                Reference type
              </p>
              <p className="text-sm text-[var(--foreground)]">
                {withdrawal.referenceType}
              </p>
            </div>
          )}

          <WithdrawalReference
            referenceType={withdrawal.referenceType}
            referencePublicId={withdrawal.referencePublicId}
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">
          No business reference supplied.
        </p>
      )}
    </Card>
  );
}

export default WithdrawalReferencePanel;