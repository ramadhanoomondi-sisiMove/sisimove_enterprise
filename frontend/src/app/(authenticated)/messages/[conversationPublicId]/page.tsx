'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Page
// -----------------------------------------------------------------------------
//
// Authenticated Messaging conversation surface.
//
// Responsibilities:
// - Read the conversation public ID from the route.
// - Load the current authenticated Identity for presentation context.
// - Compose Messaging feature components.
// - Provide the conversation public ID to feature components.
//
// Non-responsibilities:
// - Fetching the conversation.
// - Fetching participants.
// - Fetching messages.
// - Sending/editing/deleting messages.
// - Leaving/closing the conversation.
// - Participant mutations.
// - Asset upload configuration.
// - Messaging API access.
//
// Query ownership:
//
//     MessagingConversationHeader
//         └── useMessagingConversation()
//
//     MessagingConversationParticipants
//         └── useMessagingConversationParticipants()
//
//     MessagingMessageList
//         └── useMessagingConversationMessages()
//
//     MessagingMessageComposer
//         └── useSendMessagingMessage()
//
// The page is therefore only a route/composition boundary.
//
// Route:
//     /messages/:conversationPublicId
//
// The route value is always the public conversation identifier.
// Internal persistence IDs must never be exposed through the route.
// -----------------------------------------------------------------------------

import { use } from 'react';

import { MessageCircle } from 'lucide-react';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import { useCurrentIdentity } from '@/features/identity';

import {
  MessagingConversationHeader,
  MessagingConversationParticipants,
  MessagingMessageComposer,
  MessagingMessageList,
} from '@/components/messaging';

// -----------------------------------------------------------------------------
// Route props
// -----------------------------------------------------------------------------

interface MessagingConversationPageProps {
  readonly params: Promise<{
    conversationPublicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function MessagingConversationPage({
  params,
}: MessagingConversationPageProps) {
  const { conversationPublicId } = use(params);

  // ---------------------------------------------------------------------------
  // Current member presentation context
  // ---------------------------------------------------------------------------
  //
  // Identity is not a Messaging query.
  //
  // It supplies the authenticated member public ID used by Messaging
  // presentation components to distinguish the current member's messages
  // and participant row.
  //
  // Authentication/Identity remains outside the Messaging domain.
  // ---------------------------------------------------------------------------

  const identityQuery = useCurrentIdentity();

  const currentMemberPublicId =
    identityQuery.data?.publicId;

  return (
    <main
      className="page-shell"
      data-route={AUTHENTICATED_ROUTES.MESSAGING_CONVERSATION(
        conversationPublicId,
      )}
      data-conversation-public-id={conversationPublicId}
    >
      <div className="page-container">
        <section className="section-sm">
          {/* -----------------------------------------------------------------
              Route heading
          ----------------------------------------------------------------- */}

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

                <p className="mt-1 truncate text-sm text-[var(--foreground-secondary)]">
                  {conversationPublicId}
                </p>
              </div>
            </div>
          </header>

          {/* -----------------------------------------------------------------
              Conversation surface

              Each child owns its own feature server-state boundary.
          ----------------------------------------------------------------- */}

          <div
            className={[
              'overflow-hidden',
              'rounded-[var(--radius-xl)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'shadow-[var(--shadow-sm)]',
            ].join(' ')}
          >
            {/* -----------------------------------------------------------------
                Conversation header

                Owns:
                - conversation query;
                - conversation lifecycle presentation;
                - conversation actions.
            ----------------------------------------------------------------- */}

            <MessagingConversationHeader
              conversationPublicId={conversationPublicId}
              currentMemberPublicId={currentMemberPublicId}
            />

            {/* -----------------------------------------------------------------
                Conversation participants

                Owns:
                - participant query;
                - participant loading/error/empty state;
                - participant presentation.
            ----------------------------------------------------------------- */}

            <div className="border-t border-[var(--border-subtle)]">
              <MessagingConversationParticipants
                conversationPublicId={conversationPublicId}
                currentMemberPublicId={currentMemberPublicId}
              />
            </div>

            {/* -----------------------------------------------------------------
                Messages

                Owns:
                - conversation-message query;
                - message loading/error/empty state;
                - message presentation.
            ----------------------------------------------------------------- */}

            <div className="border-t border-[var(--border-subtle)]">
              <MessagingMessageList
                conversationPublicId={conversationPublicId}
                currentMemberPublicId={currentMemberPublicId}
              />
            </div>

            {/* -----------------------------------------------------------------
                Composer

                Owns:
                - draft state;
                - send-message mutation;
                - attachment workflow when configured.
            ----------------------------------------------------------------- */}

            <div className="border-t border-[var(--border-subtle)]">
              <MessagingMessageComposer
                conversationPublicId={conversationPublicId}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}