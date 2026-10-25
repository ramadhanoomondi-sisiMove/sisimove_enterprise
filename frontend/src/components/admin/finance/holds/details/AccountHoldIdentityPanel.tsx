import type { AdminAccountHold } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';
import { AccountHoldStatusBadge } from '../shared/AccountHoldStatusBadge';

export interface AccountHoldIdentityPanelProps {
  hold: AdminAccountHold;
  className?: string;
}

export function AccountHoldIdentityPanel({
  hold,
  className,
}: AccountHoldIdentityPanelProps) {
  return (
    <section
      aria-labelledby="account-hold-identity-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-identity-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Hold identity
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Unique identifiers and current status of this account hold.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <p className="text-sm text-[var(--foreground-muted)]">Hold ID</p>
          <AccountHoldPublicId publicId={hold.publicId} visibleCharacters={24} />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--foreground-muted)]">Status</p>
          <AccountHoldStatusBadge status={hold.status} />
        </div>
      </div>
    </section>
  );
}