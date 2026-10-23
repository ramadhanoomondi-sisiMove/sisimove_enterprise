
import { CheckCircle2, Receipt } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface BookingPriceBreakdownItem {
  label: string;
  amount: number | undefined;
}

interface BookingPriceBreakdownProps {
  items: BookingPriceBreakdownItem[];
  total: number | undefined;
  currency: string | undefined;
  className?: string;
}

function formatMoney(
  amount: number | undefined,
  currency: string | undefined,
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return 'Not available';
  }

  if (!currency) {
    return amount.toLocaleString('en-KE');
  }

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

export function BookingPriceBreakdown({
  items,
  total,
  currency,
  className,
}: BookingPriceBreakdownProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3">
          <Receipt
            className="size-4 text-[var(--foreground-secondary)]"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Price breakdown
          </h3>
        </div>

        <dl className="divide-y divide-[var(--border-subtle)] px-4">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex items-start justify-between gap-4 py-4"
            >
              <dt className="text-sm text-[var(--foreground-secondary)]">
                {item.label}
              </dt>
              <dd className="text-right text-sm font-medium tabular-nums text-[var(--foreground)]">
                {formatMoney(item.amount, currency)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        className={cn(
          'rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-soft)] p-5',
          'sm:flex sm:items-center sm:justify-between sm:gap-4',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)]">
            <CheckCircle2
              className="size-5 text-[var(--brand)]"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Total booking amount
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-secondary)]">
              Recorded pricing total
            </p>
          </div>
        </div>

        <p className="mt-4 break-words text-2xl font-bold tracking-tight text-[var(--foreground)] sm:mt-0 sm:text-right sm:text-3xl">
          {formatMoney(total, currency)}
        </p>
      </div>
    </div>
  );
}

export type { BookingPriceBreakdownProps };
