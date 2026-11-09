
import {
  WithdrawalPageContainer,
  WithdrawalControlCenterHeader,
} from '@/components/admin/finance/withdrawals/layout';

import {
  WithdrawalLoadingState,
} from '@/components/admin/finance/withdrawals/shared';

export default function WithdrawalsLoading() {
  return (
    <WithdrawalPageContainer size="2xl" className="py-6">
      <div
        className="space-y-6"
        aria-label="Loading withdrawals page"
        aria-busy="true"
      >
        <WithdrawalControlCenterHeader
          eyebrow="FINANCE CONTROL CENTER"
          title="Withdrawals"
          description="Review withdrawal requests, monitor their lifecycle, and oversee financial disbursement operations."
        />

        <WithdrawalLoadingState
          rows={8}
          label="Loading withdrawal records..."
          showSpinner
        />
      </div>
    </WithdrawalPageContainer>
  );
}
