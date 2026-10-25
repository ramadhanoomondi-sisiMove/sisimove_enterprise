// src/components/admin/finance/account-holds/directory/AccountHoldTable.tsx

import { FileSearch } from 'lucide-react';

import type { AdminAccountHold } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';

import { AccountHoldTableRow } from './AccountHoldTableRow';

export interface AccountHoldTableProps {
  holds: AdminAccountHold[];
  onView?: (hold: AdminAccountHold) => void;
  className?: string;
}

const HEADERS = [
  { label: 'Hold', align: 'left' },
  { label: 'Account', align: 'left' },
  { label: 'Amount', align: 'right' },
  { label: 'Status', align: 'left' },
  { label: 'Expiry', align: 'left' },
  { label: 'Created', align: 'left' },
  { label: 'Actions', align: 'right' },
] as const;

export function AccountHoldTable({
  holds,
  onView,
  className,
}: AccountHoldTableProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <caption className="sr-only">
            Account holds with account, amount, status, expiry, and creation date
          </caption>

          <thead className="bg-[var(--background-subtle)]">
            <tr className="border-b border-[var(--border)]">
              {HEADERS.map((header) => (
                <th
                  key={header.label}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide',
                    'text-[var(--foreground-muted)]',
                    header.align === 'right' && 'text-right',
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {holds.map((hold) => (
              <AccountHoldTableRow
                key={hold.publicId}
                hold={hold}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>

      {holds.length === 0 && (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[var(--background-muted)] text-[var(--foreground-muted)]">
            <FileSearch aria-hidden="true" className="size-6" />
          </span>
          <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
            No account holds found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[var(--foreground-muted)]">
            Try adjusting your search or filters to find the hold you need.
          </p>
        </div>
      )}
    </div>
  );
}