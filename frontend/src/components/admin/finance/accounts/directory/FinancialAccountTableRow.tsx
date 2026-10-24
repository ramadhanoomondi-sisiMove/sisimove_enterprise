
import { ChevronRight, Eye } from 'lucide-react';

import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

import {
  FinancialAccountStatusBadge,
  FinancialAccountTypeBadge,
  FinancialAccountPublicId,
} from '../shared';

export interface FinancialAccountTableRowProps {
  account: AdminFinancialAccount;
  onOpenAccount?: (accountPublicId: string) => void;
  onSelectAccount?: (accountPublicId: string) => void;
  formatAmount: (minorUnits: number, currency: string) => string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
      }).format(date);
}

export function FinancialAccountTableRow({
  account,
  onOpenAccount,
  onSelectAccount,
  formatAmount,
}: FinancialAccountTableRowProps) {
  return (
    <tr className="transition hover:bg-[var(--background-muted)]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FinancialAccountPublicId publicId={account.publicId} />

          {onSelectAccount && (
            <button
              type="button"
              onClick={() => onSelectAccount(account.publicId)}
              aria-label={`View overview for account ${account.publicId}`}
              title="View account overview"
              className="rounded-md p-1 text-[var(--foreground-muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <Eye size={15} />
            </button>
          )}

          {onOpenAccount && (
            <button
              type="button"
              onClick={() => onOpenAccount(account.publicId)}
              aria-label={`Open account details for ${account.publicId}`}
              title="Open account details"
              className="rounded-md p-1 text-[var(--foreground-muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">
        {account.ownerPublicId ? (
          <span className="font-mono text-xs">
            {account.ownerPublicId}
          </span>
        ) : (
          <span className="text-[var(--foreground-muted)]">
            System / no owner
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        <FinancialAccountTypeBadge type={account.type} />
      </td>

      <td className="px-4 py-3">
        <FinancialAccountStatusBadge status={account.status} />
      </td>

      <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
        {account.currency}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-[var(--foreground)]">
        {formatAmount(account.balance.availableAmount, account.currency)}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-[var(--foreground-secondary)]">
        {formatAmount(account.balance.pendingAmount, account.currency)}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-[var(--foreground-secondary)]">
        {formatAmount(account.balance.heldAmount, account.currency)}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold tabular-nums text-[var(--foreground)]">
        {formatAmount(account.balance.totalAmount, account.currency)}
      </td>

      <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--foreground-muted)]">
        {formatDate(account.updatedAt)}
      </td>
    </tr>
  );
}
