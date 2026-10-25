import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldTransactionReference } from './AccountHoldTransactionReference';

export interface AccountHoldTransactionPanelProps {
  hold: AdminAccountHold;
  className?: string;
}

export function AccountHoldTransactionPanel({
  hold,
  className,
}: AccountHoldTransactionPanelProps) {
  return (
    <section
      aria-labelledby="account-hold-transactions-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-transactions-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Linked transactions
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Transaction references recorded against this account hold.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <AccountHoldTransactionReference
          label="Hold transaction"
          publicId={hold.holdTransactionPublicId}
          description="Original transaction associated with the hold."
        />

        <AccountHoldTransactionReference
          label="Release transaction"
          publicId={hold.releaseTransactionPublicId}
          description="Transaction reference for releasing the hold."
        />

        <AccountHoldTransactionReference
          label="Capture transaction"
          publicId={hold.captureTransactionPublicId}
          description="Transaction reference for capturing the hold."
        />
      </div>
    </section>
  );
}