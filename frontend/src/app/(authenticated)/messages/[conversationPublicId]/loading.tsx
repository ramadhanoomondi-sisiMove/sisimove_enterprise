// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Route Loading State
// -----------------------------------------------------------------------------
//
// This is the route-level loading fallback displayed while the conversation
// page is being prepared.
//
// Feature-level loading states remain owned by their respective components.
// This fallback therefore represents the whole route rather than pretending
// to know which Messaging query is currently loading.
// -----------------------------------------------------------------------------

import { Loader2, MessageCircle } from 'lucide-react';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

export default function MessagingConversationLoading() {
  return (
    <main
      className="page-shell"
      data-route={AUTHENTICATED_ROUTES.MESSAGING_CONVERSATION(
        'loading',
      )}
    >
      <div className="page-container">
        <section className="section-sm">
          <header className="mb-4">
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
                  Conversation
                </h1>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Loading conversation…
                </p>
              </div>
            </div>
          </header>

          <div
            className={[
              'flex min-h-80 items-center justify-center',
              'rounded-[var(--radius-xl)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')}
            role="status"
            aria-label="Loading conversation"
          >
            <div className="flex items-center gap-3 text-sm text-[var(--foreground-secondary)]">
              <Loader2
                aria-hidden="true"
                className="size-5 animate-spin text-[var(--brand)]"
              />

              <span>Loading conversation…</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}