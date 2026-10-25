// src/components/admin/finance/account-holds/overview/AccountHoldExposureSummary.tsx

import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

import type { AdminAccountHoldMetrics } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldExposureSummaryProps {
  metrics: AdminAccountHoldMetrics[];
  className?: string;
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

function ExposureRow({
  label,
  amount,
  currency,
  icon: Icon,
  tone,
}: {
  label: string;
  amount: number;
  currency: string;
  icon: typeof Wallet;
  tone: 'brand' | 'success' | 'warning';
}) {
  const toneClasses = {
    brand: 'bg-[var(--brand-soft)] text-[var(--brand)]',
    success: 'bg-[var(--success-soft)] text-[var(--success)]',
    warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
          toneClasses[tone],
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </p>
      </div>

      <p className="max-w-[60%] break-words text-right text-sm font-semibold tabular-nums text-[var(--foreground)]">
        {formatMoney(amount, currency)}
      </p>
    </div>
  );
}

export function AccountHoldExposureSummary({
  metrics,
  className,
}: AccountHoldExposureSummaryProps) {
  return (
    <section
      aria-labelledby="account-hold-exposure-title"
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <Wallet aria-hidden="true" className="size-5" />
        </span>

        <div>
          <h2
            id="account-hold-exposure-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Financial exposure
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Hold amounts by currency
          </p>
        </div>
      </div>

      {metrics.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
          No financial exposure data is available.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-[var(--border-subtle)]">
          {metrics.map((item) => (
            <div key={item.currency}>
              <p className="pt-4 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                {item.currency}
              </p>

              <ExposureRow
                label="Currently held"
                amount={item.totalActiveHeldAmount}
                currency={item.currency}
                icon={Wallet}
                tone="warning"
              />

              <ExposureRow
                label="Released"
                amount={item.totalReleasedAmount}
                currency={item.currency}
                icon={ArrowDownLeft}
                tone="success"
              />

              <ExposureRow
                label="Captured"
                amount={item.totalCapturedAmount}
                currency={item.currency}
                icon={ArrowUpRight}
                tone="brand"
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 border-t border-[var(--border)] pt-4 text-xs leading-5 text-[var(--foreground-muted)]">
        Active held amounts represent current exposure. Released and captured
        amounts are shown separately and are not included in current exposure.
      </p>
    </section>
  );
}