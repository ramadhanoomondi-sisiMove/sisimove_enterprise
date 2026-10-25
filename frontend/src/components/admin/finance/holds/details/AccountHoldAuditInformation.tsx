import type { AdminAccountHold } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';

export interface AccountHoldAuditInformationProps {
  hold: AdminAccountHold;
  className?: string;
}

function formatDate(value?: string | Date): string {
  if (!value) return 'Not recorded';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Nairobi',
  }).format(date);
}

function AuditDate({
  label,
  value,
}: {
  label: string;
  value?: string | Date;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-[var(--foreground-muted)]">{label}</dt>
      <dd className="text-sm font-medium text-[var(--foreground)]">
        {formatDate(value)}
      </dd>
    </div>
  );
}

function AuditReference({
  label,
  publicId,
}: {
  label: string;
  publicId?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <dt className="text-sm text-[var(--foreground-muted)]">{label}</dt>
      <dd>
        {publicId ? (
          <AccountHoldPublicId publicId={publicId} visibleCharacters={24} />
        ) : (
          <span className="text-sm text-[var(--foreground-subtle)]">
            Not recorded
          </span>
        )}
      </dd>
    </div>
  );
}

export function AccountHoldAuditInformation({
  hold,
  className,
}: AccountHoldAuditInformationProps) {
  return (
    <section
      aria-labelledby="account-hold-audit-title"
      className={cn('surface space-y-5 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-audit-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Audit information
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Recorded timestamps and transaction references for the hold lifecycle.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          Timestamps
        </h3>

        <dl className="grid gap-4 sm:grid-cols-2">
          <AuditDate label="Created at" value={hold.createdAt} />
          <AuditDate label="Last updated" value={hold.updatedAt} />
          <AuditDate label="Released at" value={hold.releasedAt} />
          <AuditDate label="Captured at" value={hold.capturedAt} />
          <AuditDate label="Cancelled at" value={hold.cancelledAt} />
        </dl>
      </div>

      <div className="border-t border-[var(--border-subtle)] pt-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
          Transaction references
        </h3>

        <dl className="grid gap-4 sm:grid-cols-2">
          <AuditReference
            label="Hold transaction"
            publicId={hold.holdTransactionPublicId}
          />
          <AuditReference
            label="Release transaction"
            publicId={hold.releaseTransactionPublicId}
          />
          <AuditReference
            label="Capture transaction"
            publicId={hold.captureTransactionPublicId}
          />
        </dl>
      </div>
    </section>
  );
}