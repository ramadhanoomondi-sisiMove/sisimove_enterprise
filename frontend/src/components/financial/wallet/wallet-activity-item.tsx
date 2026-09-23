// -----------------------------------------------------------------------------
// sisiMove — Wallet Activity Item
// -----------------------------------------------------------------------------
//
// Single activity row used by the wallet recent-activity surface.
//
// The item intentionally receives already-resolved presentation data rather
// than a backend FinancialTransaction model.
//
// Responsibility:
// - Present one wallet activity item.
// - Display its direction, description, date, and amount.
// - Use shared financial formatting.
//
// This component does NOT:
// - fetch transactions;
// - interpret transaction entries;
// - calculate balances;
// - determine transaction status;
// - perform navigation;
// - mutate financial state.
//
// The wallet feature owns mapping and orchestration.
// This component owns presentation only.
// -----------------------------------------------------------------------------

import { FinancialAmount } from '../shared/financial-amount';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type WalletActivityDirection =
  | 'in'
  | 'out';

export interface WalletActivityItemProps {
  /**
   * Stable identifier for the activity.
   */
  id: string;

  /**
   * User-facing activity title.
   */
  title: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Already-formatted or user-facing activity date/time.
   */
  date: string;

  /**
   * Activity amount in integer minor units.
   */
  amount: number;

  /**
   * Currency used by the activity.
   */
  currency?: string;

  /**
   * Whether money moved into or out of the wallet.
   */
  direction: WalletActivityDirection;
}

// -----------------------------------------------------------------------------
// Wallet Activity Item
// -----------------------------------------------------------------------------

export function WalletActivityItem({
  title,
  description,
  date,
  amount,
  currency = 'KES',
  direction,
}: WalletActivityItemProps) {
  const isIncoming = direction === 'in';

  return (
    <article className="flex items-center gap-3 py-3">
      <div
        aria-hidden="true"
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center',
          'rounded-[var(--radius-full)]',
          isIncoming
            ? 'bg-[var(--success-soft)] text-[var(--success)]'
            : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        <span className="text-sm font-semibold">
          {isIncoming ? '+' : '−'}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--foreground)]">
          {title}
        </p>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <time className="text-xs text-[var(--foreground-muted)]">
            {date}
          </time>

          {description ? (
            <>
              <span
                aria-hidden="true"
                className="text-xs text-[var(--foreground-subtle)]"
              >
                ·
              </span>

              <span className="truncate text-xs text-[var(--foreground-muted)]">
                {description}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <FinancialAmount
        amount={amount}
        currency={currency}
        tone={isIncoming ? 'positive' : 'default'}
        className="shrink-0 text-sm font-semibold"
      />
    </article>
  );
}