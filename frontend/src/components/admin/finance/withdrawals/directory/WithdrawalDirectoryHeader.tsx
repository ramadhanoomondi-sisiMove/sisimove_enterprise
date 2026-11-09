import { Button } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalDirectoryHeaderProps {
  totalWithdrawals: number;
  onRefresh?: () => void;
  isFetching?: boolean;
  className?: string;
}

export function WithdrawalDirectoryHeader({
  totalWithdrawals,
  onRefresh,
  isFetching = false,
  className,
}: WithdrawalDirectoryHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Withdrawal directory
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {totalWithdrawals.toLocaleString('en-KE')} withdrawals
        </p>
      </div>

      {onRefresh && (
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </Button>
      )}
    </div>
  );
}

export default WithdrawalDirectoryHeader;