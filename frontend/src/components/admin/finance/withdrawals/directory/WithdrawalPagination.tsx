import { Button } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';

export interface WithdrawalPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function WithdrawalPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: WithdrawalPaginationProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-sm text-[var(--muted-foreground)]">
        Showing {startItem.toLocaleString('en-KE')}–
        {endItem.toLocaleString('en-KE')} of{' '}
        {totalItems.toLocaleString('en-KE')} withdrawals
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
        >
          Previous
        </Button>

        <span className="min-w-20 text-center text-sm text-[var(--foreground)]">
          Page {safeCurrentPage} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={safeCurrentPage >= totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default WithdrawalPagination;