'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Message List
// -----------------------------------------------------------------------------
//
// Feature component responsible for loading and presenting the messages
// belonging to a Messaging Conversation.
//
// Responsibilities:
// - own the conversation-messages query;
// - handle loading, error, and empty states;
// - render the MessagingMessage presentation component;
// - provide current-member presentation context.
//
// Non-responsibilities:
// - authorization;
// - sending messages;
// - editing/deleting/moderating messages;
// - conversation lifecycle mutations;
// - constructing API URLs;
// - loading Identity / Traveller Profile data;
// - resolving message assets;
// - implementing message business rules.
//
// The backend remains authoritative for authorization and lifecycle rules.
//
// Query ownership:
//
//   MessagingMessageList
//          │
//          ▼
//   useMessagingConversationMessages()
//          │
//          ▼
//   MessagingMessage[]
//          │
//          ▼
//   MessagingMessage
//
// -----------------------------------------------------------------------------

import type {
  ComponentPropsWithoutRef,
} from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  ErrorState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Messaging — Models
// -----------------------------------------------------------------------------
//
// Alias the application model because the presentation component has the same
// domain name: MessagingMessage.
//
// -----------------------------------------------------------------------------

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

// -----------------------------------------------------------------------------
// Messaging — Query
// -----------------------------------------------------------------------------

import {
  useMessagingConversationMessages,
} from '@/features/messaging/hooks/queries';

// -----------------------------------------------------------------------------
// Messaging — Presentation
// -----------------------------------------------------------------------------

import {
  MessagingMessage,
} from '../message';

// -----------------------------------------------------------------------------
// Local Components
// -----------------------------------------------------------------------------

import {
  MessagingMessageListEmpty,
} from './messaging-message-list-empty';

import {
  MessagingMessageListLoading,
} from './messaging-message-list-loading';

// =============================================================================
// Props
// =============================================================================

export interface MessagingMessageListProps
  extends Omit<
    ComponentPropsWithoutRef<'section'>,
    'children'
  > {
  /**
   * Public identifier of the Messaging Conversation.
   *
   * Used by the conversation-message query.
   */
  readonly conversationPublicId: string;

  /**
   * Public identifier of the currently authenticated member.
   *
   * Used only as presentation context by the message component.
   *
   * Authorization remains a backend responsibility.
   */
  readonly currentMemberPublicId?: string;
}

// =============================================================================
// Error
// =============================================================================

function MessagingMessageListError({
  message,
  className,
}: {
  readonly message: string;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <ErrorState
        title="Unable to load messages"
        description={message}
      />
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function MessagingMessageList({
  conversationPublicId,
  currentMemberPublicId,
  className,
  ...props
}: MessagingMessageListProps) {
  // ---------------------------------------------------------------------------
  // Query ownership
  // ---------------------------------------------------------------------------
  //
  // The component owns the server-state query.
  //
  // The page therefore does not need to:
  // - import the query hook;
  // - know the API operation;
  // - manage query loading/error state;
  // - pass the message collection into this component.
  //
  // ---------------------------------------------------------------------------

  const messagesQuery =
    useMessagingConversationMessages(
      conversationPublicId,
    );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (messagesQuery.isPending) {
    return (
      <MessagingMessageListLoading
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (messagesQuery.isError) {
    return (
      <MessagingMessageListError
        className={className}
        message={
          messagesQuery.error instanceof Error
            ? messagesQuery.error.message
            : 'We could not load the conversation messages. Please try again.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  const messages: MessagingMessageModel[] =
    messagesQuery.data ?? [];

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------

  if (messages.length === 0) {
    return (
      <MessagingMessageListEmpty
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Message List
  // ---------------------------------------------------------------------------

  return (
    <section
      {...props}
      className={cn(
        'flex',
        'min-h-0',
        'w-full',
        'flex-col',
        'overflow-hidden',
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Conversation messages"
    >
      <div className="border-b border-[var(--border-subtle)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Messages
        </h2>

        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          {messages.length}{' '}
          {messages.length === 1
            ? 'message'
            : 'messages'}
        </p>
      </div>

      <div
        className="flex min-h-0 flex-col divide-y divide-[var(--border-subtle)]"
        role="list"
        aria-label="Conversation message list"
      >
        {messages.map((message) => (
          <MessagingMessage
            key={message.publicId}
            message={message}
            currentMemberPublicId={
              currentMemberPublicId
            }
          />
        ))}
      </div>
    </section>
  );
}