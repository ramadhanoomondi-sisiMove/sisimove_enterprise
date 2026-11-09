import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import { cn } from '@/foundation/utils/cn';
import WithdrawalEmptyState from '../shared/WithdrawalEmptyState';
import WithdrawalTableRow from './WithdrawalTableRow';
import WithdrawalTableSkeleton from './WithdrawalTableSkeleton';

export interface WithdrawalTableProps {
  withdrawals: readonly AdminWithdrawal[];
  isLoading?: boolean;
  onSelect?: (withdrawal: AdminWithdrawal) => void;
  className?: string;
}

export function WithdrawalTable({
  withdrawals,
  isLoading = false,
  onSelect,
  className,
}: WithdrawalTableProps) {
  if (isLoading) {
    return <WithdrawalTableSkeleton className={className} />;
  }

  if (withdrawals.length === 0) {
    return (
      <WithdrawalEmptyState
        title="No withdrawals found"
        description="There are no withdrawals matching the current filters."
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)]',
        className,
      )}
    >
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Withdrawal
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Account
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Destination
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Requested
            </th>
          </tr>
        </thead>

        <tbody>
          {withdrawals.map((withdrawal) => (
            <WithdrawalTableRow
              key={withdrawal.publicId}
              withdrawal={withdrawal}
              onSelect={onSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WithdrawalTable;