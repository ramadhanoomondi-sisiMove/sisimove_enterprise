
'use client';

import { ArrowDownUp, Files } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';
import type { AssetModel } from '@/features/admin/assets/models';
import { AssetTableRow } from './AssetTableRow';

export type AssetTableSortField =
  | 'name'
  | 'category'
  | 'status'
  | 'visibility'
  | 'size'
  | 'createdAt';

export interface AssetTableProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  readonly assets: readonly AssetModel[];
  readonly loading?: boolean;
  readonly onOpenAsset?: (asset: AssetModel) => void;
  readonly onMoreActions?: (asset: AssetModel) => void;
  readonly sortField?: AssetTableSortField;
  readonly sortDirection?: 'asc' | 'desc';
  readonly onSort?: (field: AssetTableSortField) => void;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
}

const COLUMNS: ReadonlyArray<{
  field: AssetTableSortField;
  label: string;
}> = [
  { field: 'name', label: 'Asset' },
  { field: 'category', label: 'Category' },
  { field: 'status', label: 'Status' },
  { field: 'visibility', label: 'Visibility' },
  { field: 'size', label: 'Size' },
  { field: 'createdAt', label: 'Created' },
];

function SortableHeader({
  field,
  label,
  active,
  onSort,
}: {
  readonly field: AssetTableSortField;
  readonly label: string;
  readonly active: boolean;
  readonly sortDirection: 'asc' | 'desc';
  readonly onSort?: (field: AssetTableSortField) => void;
}) {
  if (!onSort) {
    return <span className="whitespace-nowrap">{label}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      aria-label={`Sort by ${label}`}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        'transition-colors hover:text-[var(--foreground)]',
        'focus-visible:outline-none focus-visible:underline',
        active && 'text-[var(--foreground)]',
      )}
    >
      {label}

      <ArrowDownUp
        aria-hidden="true"
        className={cn(
          'size-3.5',
          active
            ? 'text-[var(--brand)]'
            : 'text-[var(--muted-foreground)]',
        )}
      />
    </button>
  );
}

function TableLoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <tr
          key={index}
          className="border-b border-[var(--border)] last:border-0"
        >
          {Array.from({ length: 7 }, (_, cellIndex) => (
            <td key={cellIndex} className="px-4 py-4">
              <Skeleton
                className="h-4 w-full max-w-32"
                radius="sm"
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function AssetTable({
  assets,
  loading = false,
  onOpenAsset,
  onMoreActions,
  sortField,
  sortDirection = 'asc',
  onSort,
  emptyTitle = 'No assets found',
  emptyDescription = 'Try changing your search or filters to find assets.',
  className,
  ...props
}: AssetTableProps) {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead className="bg-[var(--muted)]/60">
            <tr className="border-b border-[var(--border)]">
              {COLUMNS.map(({ field, label }) => {
                const active = sortField === field;

                return (
                  <th
                    key={field}
                    scope="col"
                    aria-sort={
                      active
                        ? sortDirection === 'desc'
                          ? 'descending'
                          : 'ascending'
                        : undefined
                    }
                    className={cn(
                      'px-4 py-3.5 text-xs font-semibold uppercase',
                      'tracking-wide text-[var(--muted-foreground)]',
                    )}
                  >
                    <SortableHeader
                      field={field}
                      label={label}
                      active={active}
                      sortDirection={sortDirection}
                      onSort={onSort}
                    />
                  </th>
                );
              })}

              <th
                scope="col"
                className={cn(
                  'px-4 py-3.5 text-right text-xs font-semibold',
                  'uppercase tracking-wide text-[var(--muted-foreground)]',
                )}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableLoadingRows />
            ) : assets.length > 0 ? (
              assets.map((asset) => (
                <AssetTableRow
                  key={asset.publicId}
                  asset={asset}
                  onOpen={onOpenAsset}
                  onMoreActions={onMoreActions}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-md flex-col items-center">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[var(--muted)]">
                      <Files
                        aria-hidden="true"
                        className="size-5 text-[var(--muted-foreground)]"
                      />
                    </div>

                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {emptyTitle}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetTable;
