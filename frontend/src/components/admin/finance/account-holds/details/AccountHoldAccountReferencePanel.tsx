import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';

export interface AccountHoldAccountReferencePanelProps {
  hold: AdminAccountHold;
  className?: string;
}

function ReferenceItem({
  label,
  publicId,
}: {
  label: string;
  publicId?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <p className="text-sm text-[var(--foreground-muted)]">{label}</p>

      {publicId ? (
        <AccountHoldPublicId publicId={publicId} visibleCharacters={24} />
      ) : (
        <p className="text-sm text-[var(--foreground-subtle)]">
          Not available
        </p>
      )}
    </div>
  );
}

export function AccountHoldAccountReferencePanel({
  hold,
  className,
}: AccountHoldAccountReferencePanelProps) {
  return (
    <section
      aria-labelledby="account-hold-account-reference-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-account-reference-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Account reference
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          The financial account and transaction associated with this hold.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ReferenceItem
          label="Account ID"
          publicId={hold.accountPublicId}
        />

        <ReferenceItem
          label="Hold transaction ID"
          publicId={hold.holdTransactionPublicId}
        />
      </div>
    </section>
  );
}