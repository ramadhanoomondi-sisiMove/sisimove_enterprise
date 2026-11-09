import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { cn } from '@/foundation/utils/cn';
import WithdrawalIdentityPanel from './WithdrawalIdentityPanel';
import WithdrawalInformationPanel from './WithdrawalInformationPanel';
import WithdrawalAccountPanel from './WithdrawalAccountPanel';
import WithdrawalDestinationPanel from './WithdrawalDestinationPanel';
import WithdrawalReferencePanel from './WithdrawalReferencePanel';
import WithdrawalDisbursementPanel from './WithdrawalDisbursementPanel';
import WithdrawalLifecyclePanel from './WithdrawalLifecyclePanel';
import WithdrawalAuditInformation from './WithdrawalAuditInformation';

export interface WithdrawalDetailsLayoutProps {
  withdrawal: AdminWithdrawal;
  accountHref?: string;
  disbursementHref?: string;
  className?: string;
}

export function WithdrawalDetailsLayout({
  withdrawal,
  accountHref,
  disbursementHref,
  className,
}: WithdrawalDetailsLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <WithdrawalIdentityPanel withdrawal={withdrawal} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <WithdrawalInformationPanel withdrawal={withdrawal} />
        <WithdrawalLifecyclePanel withdrawal={withdrawal} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WithdrawalAccountPanel
          withdrawal={withdrawal}
          accountHref={accountHref}
        />

        <WithdrawalDestinationPanel withdrawal={withdrawal} />

        <WithdrawalReferencePanel withdrawal={withdrawal} />

        <WithdrawalDisbursementPanel
          withdrawal={withdrawal}
          disbursementHref={disbursementHref}
        />
      </div>

      <WithdrawalAuditInformation withdrawal={withdrawal} />
    </div>
  );
}

export default WithdrawalDetailsLayout;