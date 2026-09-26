// -----------------------------------------------------------------------------
// sisiMove — Messages Page
// -----------------------------------------------------------------------------
//
// Authenticated Messaging conversation-list surface.
//
// Responsibilities:
// - Compose the Messaging conversation list.
// - Provide the route-level page structure.
//
// Non-responsibilities:
// - Loading conversations.
// - Calling Messaging query hooks.
// - Creating or mutating conversations.
// - Owning Messaging business logic.
// - Performing navigation.
//
// Query ownership:
//
//     MessagingConversationList
//         └── useMessagingConversations()
//
// Route ownership:
//
//     AUTHENTICATED_ROUTES.MESSAGES
//         └── /messages
//
// The page therefore remains a thin composition boundary.
// -----------------------------------------------------------------------------

'use client';

import {
  MessageCircle,
} from 'lucide-react';

import {
  AUTHENTICATED_ROUTES,
} from '@/foundation/routing';

import {
  MessagingConversationList,
} from '@/components/messaging';

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function MessagesPage() {
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
                  Conversations related to your journeys and bookings.
                </p>
              </div>
            </div>
          </header>

          <MessagingConversationList />
        </section>
      </div>
    </main>
  );
}