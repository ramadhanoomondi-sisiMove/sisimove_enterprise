// -----------------------------------------------------------------------------
// sisiMove — Support Case Detail
// -----------------------------------------------------------------------------
//
// Member-facing Support case detail surface.
//
// Responsibilities:
// - load the requested Support case;
// - compose the case header, reference, conversation, evidence, and resolution
//   presentation boundaries;
// - provide loading and not-found/error states.
//
// Non-responsibilities:
// - Support aggregate orchestration;
// - case mutation;
// - message mutation;
// - evidence mutation;
// - internal notes;
// - assignment management;
// - participant management;
// - resolution creation;
// - fetching referenced Journey/Booking/Payment/etc. domains.
//
// The detail component deliberately composes independent Support queries.
// Each child remains responsible for its own presentation and mutations.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { Card } from '@/components/ui/card';

import { useSupportCase } from '@/features/support-case/hooks';
import { SupportCaseConversation } from '../support-case-conversation';
import { SupportCaseHeader } from '../support-case-header';
import { SupportCaseReference } from '../support-case-reference';

export interface SupportCaseDetailProps {
  /**
   * Public Support case identifier from the route.
   */
  supportCasePublicId: string;
}

export function SupportCaseDetail({
  supportCasePublicId,
}: SupportCaseDetailProps) {
  const {
    data: supportCase,
    isLoading,
    isError,
  } = useSupportCase(supportCasePublicId);

  if (isLoading) {
    return <SupportCaseDetailLoading />;
  }

  if (isError) {
    return (
      <section
        aria-label="Support case"
        className="page-container py-6"
      >
        <Card
          variant="default"
          padding="md"
        >
          <div
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            We could not load this support case. Please try again.
          </div>

          <Link
            href="/support"
            className={[
              'mt-4',
              'inline-flex',
              'text-sm',
              'font-medium',
              'text-[var(--brand)]',
              'hover:text-[var(--brand-hover)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            Back to support
          </Link>
        </Card>
      </section>
    );
  }

  if (!supportCase) {
    return (
      <section
        aria-label="Support case"
        className="page-container py-6"
      >
        <Card
          variant="default"
          padding="md"
        >
          <h1 className="text-base font-semibold text-[var(--foreground)]">
            Support case not found
          </h1>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            This support case may no longer be available.
          </p>

          <Link
            href="/support"
            className={[
              'mt-4',
              'inline-flex',
              'text-sm',
              'font-medium',
              'text-[var(--brand)]',
              'hover:text-[var(--brand-hover)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            Back to support
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section
      aria-label={`Support case: ${supportCase.subject}`}
      className="page-container py-4 sm:py-6"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4">
          <Link
            href="/support"
            className={[
              'inline-flex',
              'items-center',
              'text-sm',
              'font-medium',
              'text-[var(--foreground-secondary)]',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
            ].join(' ')}
          >
            ← Support
          </Link>
        </div>

        <div className="space-y-4">
          <SupportCaseHeader supportCase={supportCase} />

          <SupportCaseReference
            referenceType={supportCase.referenceType}
            referencePublicId={supportCase.referencePublicId}
          />

          <SupportCaseConversation
            supportCase={supportCase}
          />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function SupportCaseDetailLoading() {
  return (
    <section
      aria-label="Loading support case"
      aria-busy="true"
      className="page-container py-4 sm:py-6"
    >
      <div className="mx-auto w-full max-w-3xl animate-pulse space-y-4">
        <div className="h-5 w-24 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />

        <Card
          variant="default"
          padding="md"
        >
          <div className="h-5 w-2/3 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
          <div className="mt-3 h-4 w-1/3 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
          <div className="mt-5 h-16 rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
        </Card>

        <Card
          variant="default"
          padding="md"
        >
          <div className="h-4 w-1/4 rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
          <div className="mt-4 h-24 rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
          <div className="mt-3 h-16 rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
        </Card>
      </div>
    </section>
  );
}