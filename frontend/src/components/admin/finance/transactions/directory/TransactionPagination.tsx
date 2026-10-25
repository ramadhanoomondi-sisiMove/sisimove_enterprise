'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, type SelectOption } from '@/components/ui/select';

export interface TransactionPaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

const pageSizeOptions: SelectOption[] = [
  { value: '10', label: '10 per page' },
  { value: '20', label: '20 per page' },
  { value: '50', label: '50 per page' },
  { value: '100', label: '100 per page' },
];

export function TransactionPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: TransactionPaginationProps) {
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (currentPage - 1) * safePageSize + 1;
  const end = Math.min(currentPage * safePageSize, totalItems);
  const number = new Intl.NumberFormat('en-KE');

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 text-sm text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:gap-4">
        <p>
          Showing <strong className="font-semibold text-[var(--foreground)]">{number.format(start)}–{number.format(end)}</strong> of{' '}
          <strong className="font-semibold text-[var(--foreground)]">{number.format(totalItems)}</strong>
        </p>
        <div className="w-40">
          <Select
            id="transaction-page-size"
            aria-label="Rows per page"
            value={String(safePageSize)}
            options={pageSizeOptions}
            onChange={(event) => onPageSizeChange(Number(event.currentTarget.value))}
            disabled={disabled}
          />
        </div>
      </div>

      <nav aria-label="Transaction pages" className="flex items-center gap-1">
        <Button variant="outline" size="sm" aria-label="First page" disabled={disabled || currentPage <= 1} onClick={() => onPageChange(1)}>
          <ChevronsLeft size={16} aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm" aria-label="Previous page" disabled={disabled || currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <span className="min-w-24 px-2 text-center text-sm text-[var(--foreground-secondary)]">
          Page <strong className="font-semibold text-[var(--foreground)]">{currentPage}</strong> of {totalPages}
        </span>
        <Button variant="outline" size="sm" aria-label="Next page" disabled={disabled || currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm" aria-label="Last page" disabled={disabled || currentPage >= totalPages} onClick={() => onPageChange(totalPages)}>
          <ChevronsRight size={16} aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}

export default TransactionPagination;
