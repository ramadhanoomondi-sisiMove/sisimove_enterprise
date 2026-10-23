'use client';

import type { AdminBoarding } from '@/features/admin/boardings';
import { BoardingTableRow } from './BoardingTableRow';
import { BoardingEmptyState } from '../shared';
import { cn } from '@/foundation/utils/cn';

export interface BoardingTableProps {
  boardings: AdminBoarding[];
  onView?: (boarding: AdminBoarding) => void;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BoardingTable({
  boardings,
  onView,
  className,
  emptyTitle = 'No boarding records found',
  emptyDescription = 'Try adjusting your search or filters.',
}: BoardingTableProps) {
  if (boardings.length === 0) {
    return (
      <div className={cn('rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]', className)}>
        <BoardingEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-lg)]',
        'border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-[var(--background-subtle)]">
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Boarding ID
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Journey ID
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Provider ID
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Participants
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-subtle)]">
            {boardings.map((boarding) => (
              <BoardingTableRow
                key={boarding.publicId}
                boarding={boarding}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
