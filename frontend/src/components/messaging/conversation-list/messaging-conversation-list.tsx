// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation List
// -----------------------------------------------------------------------------
//
// Authenticated presentation component for the user's Messaging conversations.
//
// Responsibilities:
// - own the conversation-list query;
// - render loading state;
// - render query error state;
// - render the conversation collection;
// - expose selected-conversation presentation state;
// - delegate individual conversation presentation to the list-item component.
//
// Non-responsibilities:
// - page-level routing;
// - authentication/session management;
// - Traveller Profile resolution;
// - Journey resolution;
// - Booking resolution;
// - Asset resolution;
// - conversation business rules;
// - direct HTTP/API access.
//
// The component owns its Messaging query boundary. The page composes this
// feature component rather than fetching Messaging conversations itself.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  ErrorState,
  Skeleton,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversation } from '@/features/messaging/models';

import { useMessagingConversations } from '@/features/messaging/hooks/queries';

import { MessagingConversationListEmpty } from './messaging-conversation-list-empty';
import { MessagingConversationListItem } from './messaging-conversation-list-item';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationListProps
  extends Omit<ComponentPropsWithoutRef<'section'>, 'children'> {
  /**
   * Optional conversation public ID used only for presentation selection.
   *
   * Navigation remains outside the component. The selected identifier can be
   * derived by the page from the current route and passed into the component.
   */
  readonly selectedConversationPublicId?: string;

  /**
   * Optional callback invoked when a conversation is selected.
   *
   * The component does not perform navigation itself.
   */
  readonly onConversationSelect?: (
    conversation: MessagingConversation,
  ) => void;
}

// =============================================================================
// Loading
// =============================================================================

function MessagingConversationListLoading({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Loading conversations"
      aria-busy="true"
    >
      <div className="divide-y divide-[var(--border-subtle)]">
        <div className="flex items-start gap-3 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-[var(--radius-full)]" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-28" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-[var(--radius-full)]" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-2 h-3 w-24" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        </div>

        <div className="flex items-start gap-3 px-4 py-4">
          <Skeleton className="h-10 w-10 rounded-[var(--radius-full)]" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-2 h-3 w-28" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Error
// =============================================================================

function MessagingConversationListError({
  message,
  className,
}: {
  readonly message: string;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <ErrorState
        title="Unable to load conversations"
        description={message}
      />
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationList({
  selectedConversationPublicId,
  onConversationSelect,
  className,
  ...props
}: MessagingConversationListProps) {
  // ---------------------------------------------------------------------------
  // Conversation query
  // ---------------------------------------------------------------------------
  //
  // The component owns its server-state boundary.
  //
  // The page does not need to know:
  //
  // - the Messaging endpoint;
  // - the query key;
  // - the API adapter;
  // - the mapper;
  // - the TanStack Query configuration.
  //
  // ---------------------------------------------------------------------------

  const conversationsQuery =
    useMessagingConversations();

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (conversationsQuery.isPending) {
    return (
      <MessagingConversationListLoading
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (conversationsQuery.isError) {
    return (
      <MessagingConversationListError
        className={className}
        message={
          conversationsQuery.error instanceof Error
            ? conversationsQuery.error.message
            : 'We could not load your conversations. Please try again.'
        }
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------

  const conversations =
    conversationsQuery.data ?? [];

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------

  if (conversations.length === 0) {
    return (
      <MessagingConversationListEmpty
        className={className}
        {...props}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Conversation collection
  // ---------------------------------------------------------------------------

  return (
    <section
      {...props}
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Messaging conversations"
    >
      <div className="divide-y divide-[var(--border-subtle)]">
        {conversations.map((conversation) => (
          <MessagingConversationListItem
            key={conversation.publicId}
            conversation={conversation}
            selected={
              conversation.publicId ===
              selectedConversationPublicId
            }
            onSelect={onConversationSelect}
          />
        ))}
      </div>
    </section>
  );
}