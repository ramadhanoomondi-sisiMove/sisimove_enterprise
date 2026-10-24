
import { Skeleton } from '@/components/ui';
import type { AdminFinancialAccount } from '@/features/admin/finance/accounts/models';

import { FinancialAccountEmptyState } from '../shared/FinancialAccountEmptyState';
import { FinancialAccountTableRow } from './FinancialAccountTableRow';

export interface FinancialAccountTableProps {
  accounts: readonly AdminFinancialAccount[];
  isLoading?: boolean;
  hasFilters?: boolean;
  onResetFilters?: () => void;
  onOpenAccount?: (accountPublicId: string) => void;
  onSelectAccount?: (accountPublicId: string) => void;
  formatAmount: (minorUnits: number, currency: string) => string;
}

export function FinancialAccountTable({
  accounts,
  isLoading = false,
  hasFilters = false,
  onResetFilters,
  onOpenAccount,
  onSelectAccount,
  formatAmount,
}: FinancialAccountTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Accounts
        </h3>

        <span className="text-xs text-[var(--foreground-muted)]">
          Amounts shown in each account’s currency
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="bg-[var(--background-muted)]">
            <tr>
              {[
                'Account',
                'Owner',
                'Type',
                'Status',
                'Currency',
                'Available',
                'Pending',
                'Held',
                'Total',
                'Updated',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              Array.from({ length: 5 }, (_, index) => (
                <tr key={index}>
                  <td colSpan={10} className="px-4 py-4">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : (
              accounts.map((account) => (
                <FinancialAccountTableRow
                  key={account.publicId}
                  account={account}
                  onOpenAccount={onOpenAccount}
                  onSelectAccount={onSelectAccount}
                  formatAmount={formatAmount}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && accounts.length === 0 && (
        <div className="px-4 py-8">
          <FinancialAccountEmptyState
            title={
              hasFilters
                ? 'No matching accounts'
                : 'No accounts to display'
            }
            description={
              hasFilters
                ? 'Try changing or clearing the current filters.'
                : 'No financial accounts were supplied to this directory.'
            }
            actionLabel={hasFilters ? 'Reset filters' : undefined}
            onAction={
              hasFilters ? onResetFilters : undefined
            }
          />
        </div>
      )}
    </div>
  );
}

export default FinancialAccountTable;
