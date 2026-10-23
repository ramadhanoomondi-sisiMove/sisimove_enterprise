'use client';

import { ArrowUpRight } from 'lucide-react';
import type { AdminBoarding } from '@/features/admin/boardings';
import {
  BoardingStatusBadge,
  BoardingPublicId,
} from '../shared';
import { cn } from '@/foundation/utils/cn';

export interface BoardingTableRowProps {
  boarding: AdminBoarding;
  onView?: (boarding: AdminBoarding) => void;
  className?: string;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function BoardingTableRow({
  boarding,
  onView,
  className,
}: BoardingTableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-[var(--border-subtle)]',
        'transition-colors hover:bg-[var(--background-subtle)]',
        className,
      )}
    >
      <td className="px-4 py-4 align-middle">
        <BoardingPublicId publicId={boarding.publicId} />
      </td>

      <td className="px-4 py-4 align-middle">
        <BoardingPublicId publicId={boarding.journeyId} />
      </td>

      <td className="px-4 py-4 align-middle">
        <BoardingPublicId publicId={boarding.providerPublicId} />
      </td>

      <td className="px-4 py-4 align-middle">
        <BoardingStatusBadge status={boarding.status} />
      </td>

      <td className="px-4 py-4 align-middle text-sm text-[var(--foreground-secondary)]">
        {boarding.participants.length}
      </td>

      <td className="px-4 py-4 align-middle">
        <time
          dateTime={boarding.createdAt}
          className="whitespace-nowrap text-sm text-[var(--foreground-secondary)]"
        >
          {formatDate(boarding.createdAt)}
        </time>
      </td>

      <td className="px-4 py-4 text-right align-middle">
        <button
          type="button"
          onClick={() => onView?.(boarding)}
          disabled={!onView}
          aria-label={`View boarding ${boarding.publicId}`}
          className={cn(
            'inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-md)]',
            'px-3 text-sm font-medium text-[var(--brand)]',
            'transition-colors hover:bg-[var(--brand-soft)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]/30',
            'disabled:cursor-default disabled:opacity-50',
          )}
        >
          View
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
