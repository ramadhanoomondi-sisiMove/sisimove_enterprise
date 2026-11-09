
import {
  WithdrawalPageContainer,
  WithdrawalControlCenterHeader,
} from '@/components/admin/finance/withdrawals/layout';

import { WithdrawalOverview } from '@/components/admin/finance/withdrawals/overview/WithdrawalOverview';

import { WithdrawalDirectory } from '@/components/admin/finance/withdrawals/directory/WithdrawalDirectory';

export default function AdminWithdrawalsPage() {
  return (
    <WithdrawalPageContainer size="2xl" className="py-6">
      <div className="space-y-6">
        <WithdrawalControlCenterHeader
          eyebrow="FINANCE CONTROL CENTER"
          title="Withdrawals"
          description="Review withdrawal requests, monitor their lifecycle, and oversee financial disbursement operations across the sisiMove platform."
        />

        <WithdrawalOverview />

        <WithdrawalDirectory />
      </div>
    </WithdrawalPageContainer>
  );
}
