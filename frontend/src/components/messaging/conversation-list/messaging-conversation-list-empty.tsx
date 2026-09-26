// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation List Empty State
// -----------------------------------------------------------------------------
//
// Empty state for the Messaging conversation list.
//
// Responsibilities:
// - communicate that no conversations currently exist;
// - provide concise contextual guidance.
//
// Non-responsibilities:
// - fetching conversations;
// - creating conversations;
// - navigation;
// - Journey discovery;
// - Booking discovery.
//
// Messaging does not determine which Journey or Booking the user should act
// upon, so contextual actions belong to the consuming workflow.
//
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { MessageCircle } from 'lucide-react';

import { EmptyState } from '@/components/ui';

// =============================================================================
// Props
// =============================================================================

export type MessagingConversationListEmptyProps =
  Omit<
    ComponentPropsWithoutRef<'div'>,
    'children'
  >;

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationListEmpty({
  className,
  ...props
}: MessagingConversationListEmptyProps) {
  return (
    <div
      {...props}
      className={className}
    >
      <EmptyState
        icon={
          <MessageCircle className="h-5 w-5" />
        }
        title="No conversations yet"
        description="Conversations related to your journeys and bookings will appear here."
      />
    </div>
  );
}