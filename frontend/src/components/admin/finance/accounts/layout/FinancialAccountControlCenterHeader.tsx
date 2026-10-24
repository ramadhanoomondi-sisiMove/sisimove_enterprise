// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Control Center Header
// -----------------------------------------------------------------------------
//
// Introductory heading for the financial-account control center.
// Does not imply that platform-wide account listing or aggregate metrics are
// available until a verified data source exists.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';
import { WalletCards } from 'lucide-react';

export interface FinancialAccountControlCenterHeaderProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function FinancialAccountControlCenterHeader({
  eyebrow = 'FINANCE CONTROL CENTER',
  title = 'Financial Accounts',
  description = 'Inspect account details, review balances, and manage account status.',
  actions,
  className,
}: FinancialAccountControlCenterHeaderProps) {
  return (
    <header
      className={[
        'flex flex-col gap-5 border-b border-[var(--border)] pb-6',
        'sm:flex-row sm:items-start sm:justify-between',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
          <WalletCards aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--foreground-muted)]">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        </div>
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export default FinancialAccountControlCenterHeader;
