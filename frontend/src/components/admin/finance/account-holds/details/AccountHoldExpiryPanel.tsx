import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldExpiryBadge } from '../shared/AccountHoldExpiryBadge';

export interface AccountHoldExpiryPanelProps {
  hold: AdminAccountHold;
  className?: string;
}

function formatDate(value?: string | Date): string {
  if (!value) return 'Not available';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

export function AccountHoldExpiryPanel({
  hold,
  className,
}: AccountHoldExpiryPanelProps) {
  return (
    <section
      aria-labelledby="account-hold-expiry-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-expiry-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Expiry and availability
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Expiration details and whether the hold is currently active.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-[var(--foreground-muted)]">Expiry date</p>

          <p className="text-sm font-medium text-[var(--foreground)]">
            {hold.hasExpiry ? formatDate(hold.expiresAt) : 'No expiry set'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[var(--foreground-muted)]">
            Expiry status
          </p>

          <AccountHoldExpiryBadge
            expiresAt={hold.expiresAt}
            hasExpiry={hold.hasExpiry}
            isExpired={hold.isExpired}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-[var(--foreground-muted)]">
            Currently active
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {hold.isCurrentlyActive ? 'Yes' : 'No'}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-[var(--foreground-muted)]">
            Active status
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {hold.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>
    </section>
  );
}