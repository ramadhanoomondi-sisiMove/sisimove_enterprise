import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';

export interface AccountHoldBusinessReferencePanelProps {
  hold: AdminAccountHold;
  className?: string;
}

export function AccountHoldBusinessReferencePanel({
  hold,
  className,
}: AccountHoldBusinessReferencePanelProps) {
  const hasReference = Boolean(hold.referenceType || hold.referencePublicId);

  return (
    <section
      aria-labelledby="account-hold-business-reference-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-business-reference-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Business reference
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          The business process associated with this hold, when provided.
        </p>
      </div>

      {!hasReference ? (
        <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-muted)]">
          No business reference is recorded for this hold.
        </p>
      ) : (
        <dl className="grid gap-5 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Reference type
            </dt>
            <dd className="break-words text-sm font-medium text-[var(--foreground)]">
              {hold.referenceType || 'Not specified'}
            </dd>
          </div>

          <div className="min-w-0 space-y-2">
            <dt className="text-sm text-[var(--foreground-muted)]">
              Reference ID
            </dt>
            <dd>
              {hold.referencePublicId ? (
                <AccountHoldPublicId
                  publicId={hold.referencePublicId}
                  visibleCharacters={24}
                />
              ) : (
                <span className="text-sm text-[var(--foreground-subtle)]">
                  Not available
                </span>
              )}
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}