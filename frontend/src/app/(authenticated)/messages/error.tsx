// -----------------------------------------------------------------------------
// sisiMove — Messages Error State
// -----------------------------------------------------------------------------
//
// Route-level error boundary for the authenticated Messaging page.
//
// Responsibilities:
// - Present a recoverable route-level error.
// - Allow Next.js to retry rendering the route segment.
//
// Non-responsibilities:
// - Inspecting Messaging API errors.
// - Performing Messaging mutations.
// - Owning conversation query state.
//
// Conversation-level query errors remain owned by
// MessagingConversationList.
// -----------------------------------------------------------------------------

'use client';

import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface MessagesErrorProps {
  readonly error: Error & {
    digest?: string;
  };

  readonly reset: () => void;
}

// -----------------------------------------------------------------------------
// Error Boundary
// -----------------------------------------------------------------------------

export default function MessagesError({
  reset,
}: MessagesErrorProps) {
  return (
    <main
      className="page-shell"
      data-route={AUTHENTICATED_ROUTES.MESSAGES}
    >
      <div className="page-container">
        <section className="section-sm">
          <div
            className={[
              'flex min-h-64 flex-col items-center justify-center',
              'rounded-[var(--radius-lg)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-6 py-10 text-center',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'flex size-10 items-center justify-center',
                'rounded-full',
                'bg-[var(--danger-soft)]',
                'text-[var(--danger)]',
              ].join(' ')}
            >
              <AlertTriangle className="size-5" />
            </span>

            <h1 className="mt-4 text-base font-semibold text-[var(--foreground)]">
              Messages could not be loaded
            </h1>

            <p className="mt-1 max-w-md text-sm leading-6 text-[var(--foreground-secondary)]">
              Something went wrong while opening the Messages area.
              Please try again.
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-5"
              leadingIcon={
                <RefreshCw
                  aria-hidden="true"
                  className="size-4"
                />
              }
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