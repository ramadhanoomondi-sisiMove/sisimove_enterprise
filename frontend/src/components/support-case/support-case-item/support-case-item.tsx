// -----------------------------------------------------------------------------
// sisiMove — Support Case Item
// -----------------------------------------------------------------------------
//
// Presentation component for one member-facing Support case.
//
// Responsibilities:
// - present case subject and lifecycle metadata;
// - present category and priority;
// - present server-provided message/evidence counts;
// - link to the case detail route.
//
// Non-responsibilities:
// - fetching Support data;
// - determining case lifecycle;
// - deriving aggregate state;
// - rendering internal notes;
// - assignment management;
// - resolution mutation.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import type { SupportCase } from '@/features/support-case/models';

import { SupportCaseCategory } from '../support-case-category';
import { SupportCasePriority } from '../support-case-priority';
import { SupportCaseStatus } from '../support-case-status';

export interface SupportCaseItemProps {
  /**
   * Member-facing Support case returned by the Support query layer.
   */
  supportCase: SupportCase;
}

export function SupportCaseItem({
  supportCase,
}: SupportCaseItemProps) {
  return (
    <Link
      href={`/support/cases/${encodeURIComponent(supportCase.publicId)}`}
      className={[
        'block',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'shadow-[var(--shadow-sm)]',
        'transition-colors',
        'duration-150',
        'ease-out',
        'hover:border-[var(--border-strong)]',
        'hover:shadow-[var(--shadow-md)]',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--brand)]',
        'focus-visible:outline-offset-2',
      ].join(' ')}
    >
      <article>
        <div
          className={[
            'flex',
            'items-start',
            'justify-between',
            'gap-3',
          ].join(' ')}
        >
          <div className="min-w-0">
            <h3
              className={[
                'truncate',
                'text-sm',
                'font-semibold',
                'text-[var(--foreground)]',
              ].join(' ')}
            >
              {supportCase.subject}
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Opened {formatSupportCaseDate(supportCase.openedAt)}
            </p>
          </div>

          <SupportCaseStatus status={supportCase.status} />
        </div>

        <div
          className={[
            'mt-3',
            'flex',
            'flex-wrap',
            'items-center',
            'gap-2',
          ].join(' ')}
        >
          <SupportCaseCategory category={supportCase.category} />
          <SupportCasePriority priority={supportCase.priority} />
        </div>

        <div
          className={[
            'mt-4',
            'flex',
            'items-center',
            'gap-4',
            'text-xs',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          <span>
            {supportCase.messageCount}{' '}
            {supportCase.messageCount === 1 ? 'message' : 'messages'}
          </span>

          {supportCase.hasEvidence && (
            <span>
              {supportCase.evidenceCount}{' '}
              {supportCase.evidenceCount === 1 ? 'evidence' : 'evidence'}
            </span>
          )}

          {supportCase.hasResolution && (
            <span className="text-[var(--success)]">
              Resolved
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

// -----------------------------------------------------------------------------
// Presentation formatting
// -----------------------------------------------------------------------------

function formatSupportCaseDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}