'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Route Error State
// -----------------------------------------------------------------------------
//
// Responsibilities
// - Present a route-level failure state.
// - Allow Next.js to retry the failed route segment.
//
// Non-responsibilities
// - Inspecting Messaging API errors.
// - Performing Messaging mutations.
// - Refetching individual Messaging queries.
//
// Feature components remain responsible for their own query-level error
// handling when they can recover independently.
// -----------------------------------------------------------------------------

import { AlertTriangle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Next.js route error props
// -----------------------------------------------------------------------------

interface MessagingConversationErrorProps {
  readonly error: Error & {
    readonly digest?: string;
  };
  readonly reset: () => void;
}

// -----------------------------------------------------------------------------
// Error boundary
// -----------------------------------------------------------------------------

export default function MessagingConversationError({
  reset,
}: MessagingConversationErrorProps) {
  return (
    <main
      className="page-shell"
      data-route={AUTHENTICATED_ROUTES.MESSAGING_CONVERSATION(
        'error',
      )}
    >
      <div className="page-container">
        <section className="section-sm">
          <div
            className={[
              'flex min-h-80 flex-col items-center justify-center',
              'rounded-[var(--radius-xl)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-6 py-10 text-center',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'flex size-12 items-center justify-center',
                'rounded-[var(--radius-full)]',
                'bg-[var(--danger-soft)]',
                'text-[var(--danger)]',
              ].join(' ')}
            >
              <AlertTriangle className="size-6" />
            </span>

            <h1 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              Conversation could not be loaded
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-secondary)]">
              Something went wrong while loading this conversation.
              Please try again.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              leadingIcon={
                <RefreshCw
                  aria-hidden="true"
                  className="size-4"
                />
              }
              className="mt-5"
              onClick={reset}
            >
              Try again
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}