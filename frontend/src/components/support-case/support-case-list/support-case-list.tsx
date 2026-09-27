'use client';

// -----------------------------------------------------------------------------
// sisiMove — Support Case List
// -----------------------------------------------------------------------------
//
// Member-facing collection of the authenticated user's Support cases.
//
// Responsibilities:
// - load Support cases through the Support query hook;
// - present cases in a compact mobile-first list;
// - delegate individual case presentation to SupportCaseItem;
// - provide an accessible empty state;
// - provide a lightweight loading state.
//
// Non-responsibilities:
// - deciding which cases the backend returns;
// - client-side requester filtering;
// - Support aggregate orchestration;
// - case mutation;
// - assignment or participant administration;
// - internal notes;
// - resolution mutation.
//
// The backend remains authoritative for case visibility and membership.
// The frontend must not assume that GET /support-cases requires or permits
// client-side requester filtering.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { useSupportCases } from '@/features/support-case/hooks';
import { SupportCaseItem } from '../support-case-item';

export interface SupportCaseListProps {
  /**
   * Optional additional class names for the list container.
   */
  className?: string;
}

export function SupportCaseList({
  className,
}: SupportCaseListProps) {
  const { data, isLoading, isError } = useSupportCases();

  if (isLoading) {
    return (
      <section
        aria-label="Support cases"
        className={className}
      >
        <div
          className={[
            'space-y-3',
            'animate-pulse',
          ].join(' ')}
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className={[
                'rounded-[var(--radius-lg)]',
                'border',
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'p-4',
                'shadow-[var(--shadow-sm)]',
              ].join(' ')}
            >
              <div className="h-4 w-2/3 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
              <div className="mt-3 h-3 w-1/3 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
              <div className="mt-4 h-3 w-full rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        aria-label="Support cases"
        className={className}
      >
        <div
          role="alert"
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--danger)]',
            'bg-[var(--danger-soft)]',
            'p-4',
            'text-sm',
            'text-[var(--danger)]',
          ].join(' ')}
        >
          We could not load your support cases. Please try again.
        </div>
      </section>
    );
  }

  const cases = data ?? [];

  if (cases.length === 0) {
    return (
      <section
        aria-label="Support cases"
        className={className}
      >
        <div
          className={[
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-6',
            'text-center',
          ].join(' ')}
        >
          <p className="text-sm text-[var(--foreground-secondary)]">
            You do not have any support cases yet.
          </p>

          <Link
            href="/support/new"
            className={[
              'mt-4',
              'inline-flex',
              'min-h-10',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4',
              'text-sm',
              'font-medium',
              'text-[var(--brand-foreground)]',
              'transition-colors',
              'duration-150',
              'hover:bg-[var(--brand-hover)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            Contact support
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Support cases"
      className={className}
    >
      <div className="space-y-3">
        {cases.map((supportCase) => (
          <SupportCaseItem
            key={supportCase.publicId}
            supportCase={supportCase}
          />
        ))}
      </div>
    </section>
  );
}