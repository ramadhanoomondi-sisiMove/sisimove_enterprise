// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Detail Header
// -----------------------------------------------------------------------------
//
// Header for a single account detail page.
// Uses only the account public ID; never exposes internal database IDs.
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { ArrowLeft, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  FinancialAccountPublicId,
  FinancialAccountStatusBadge,
  FinancialAccountTypeBadge,
} from '../shared';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

export interface FinancialAccountDetailHeaderProps {
  account: AdminFinancialAccount;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

export function FinancialAccountDetailHeader({
  account,
  backHref = '/admin/finance/accounts',
  actions,
  className,
}: FinancialAccountDetailHeaderProps) {
  return (
    <header
      className={[
        'border-b border-[var(--border)] pb-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className={[
            'inline-flex min-h-9 items-center justify-center gap-2 rounded-[var(--radius-md)]',
            'px-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors',
            'hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]',
            'focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to accounts
        </Link>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <Wallet aria-hidden="true" className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Financial account
              </h1>
              <FinancialAccountStatusBadge status={account.status} />
              <FinancialAccountTypeBadge type={account.type} />
            </div>

            <div className="mt-2">
              <FinancialAccountPublicId publicId={account.publicId} />
            </div>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Account currency: <span className="font-medium text-[var(--foreground-secondary)]">{account.currency}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FinancialAccountDetailHeader;
