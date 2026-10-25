import type { AdminAccountHold } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldInformationPanelProps {
  hold: AdminAccountHold;
  className?: string;
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency || 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function InformationItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-sm text-[var(--foreground-muted)]">{label}</dt>
      <dd className="break-words text-sm font-medium text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

export function AccountHoldInformationPanel({
  hold,
  className,
}: AccountHoldInformationPanelProps) {
  return (
    <section
      aria-labelledby="account-hold-information-title"
      className={cn('surface space-y-4 p-5', className)}
    >
      <div>
        <h2
          id="account-hold-information-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Hold information
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Financial details and lifecycle status.
        </p>
      </div>

      <dl className="grid gap-5 sm:grid-cols-2">
        <InformationItem
          label="Hold amount"
          value={formatAmount(hold.amount, hold.currency)}
        />

        <InformationItem
          label="Currency"
          value={hold.currency || 'Not specified'}
        />

        <InformationItem
          label="Currently active"
          value={hold.isCurrentlyActive ? 'Yes' : 'No'}
        />

        <InformationItem
          label="Terminal state"
          value={hold.isTerminal ? 'Yes' : 'No'}
        />

        <InformationItem
          label="Released"
          value={hold.isReleased ? 'Yes' : 'No'}
        />

        <InformationItem
          label="Captured"
          value={hold.isCaptured ? 'Yes' : 'No'}
        />

        <InformationItem
          label="Cancelled"
          value={hold.isCancelled ? 'Yes' : 'No'}
        />
      </dl>
    </section>
  );
}