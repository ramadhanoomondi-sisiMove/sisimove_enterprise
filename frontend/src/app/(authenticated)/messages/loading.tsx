// -----------------------------------------------------------------------------
// sisiMove — Messages Loading State
// -----------------------------------------------------------------------------
//
// Route-segment loading UI for the authenticated Messaging page.
//
// This state is intentionally independent from the Messaging conversation
// query. MessagingConversationList owns its own query/loading lifecycle,
// while this file provides the Next.js route-segment fallback.
//
// -----------------------------------------------------------------------------

import {
  Loader2,
  MessageCircle,
} from 'lucide-react';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

export default function MessagesLoading() {
  return (
    <main
      className="page-shell"
      data-route={AUTHENTICATED_ROUTES.MESSAGES}
    >
      <div className="page-container">
        <section className="section-sm">
          <header className="mb-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={[
                  'flex size-10 shrink-0 items-center justify-center',
                  'rounded-[var(--radius-md)]',
                  'bg-[var(--brand-soft)]',
                  'text-[var(--brand)]',
                ].join(' ')}
              >
                <MessageCircle className="size-5" />
              </span>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-[var(--foreground)]">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Loading your conversations…
                </p>
              </div>
            </div>
          </header>

          <div
            aria-label="Loading conversations"
            className={[
              'flex min-h-32 items-center justify-center',
              'rounded-[var(--radius-lg)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
            ].join(' ')}
            role="status"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <Loader2
                aria-hidden="true"
                className="size-4 animate-spin"
              />

              <span>
                Loading conversations…
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}