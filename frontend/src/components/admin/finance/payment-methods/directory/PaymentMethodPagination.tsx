/**
 * sisiMove Admin — Payment Method Pagination
 */
import { Button } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaymentMethodPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export function PaymentMethodPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  hasPreviousPage = page > 1,
  hasNextPage = page < totalPages,
  onPageChange,
  onPageSizeChange,
  className,
}: PaymentMethodPaginationProps) {
  if (totalItems <= 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav aria-label="Payment method pagination" className={['flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className].filter(Boolean).join(' ')}>
      <p className="text-sm text-[var(--foreground-secondary)]">
        Showing <span className="font-medium text-[var(--foreground)]">{start.toLocaleString()}–{end.toLocaleString()}</span> of <span className="font-medium text-[var(--foreground)]">{totalItems.toLocaleString()}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && (
          <label className="mr-2 flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
            Rows
            <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.currentTarget.value))} className="min-h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm text-[var(--foreground)]">
              {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
        <Button variant="outline" size="sm" disabled={!hasPreviousPage} onClick={() => onPageChange(page - 1)} leadingIcon={<ChevronLeft size={15} aria-hidden="true" />}>Previous</Button>
        <span className="min-w-20 text-center text-sm text-[var(--foreground-secondary)]">Page {page} of {Math.max(totalPages, 1)}</span>
        <Button variant="outline" size="sm" disabled={!hasNextPage} onClick={() => onPageChange(page + 1)} trailingIcon={<ChevronRight size={15} aria-hidden="true" />}>Next</Button>
      </div>
    </nav>
  );
}

export default PaymentMethodPagination;
