// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Actions
// -----------------------------------------------------------------------------
//
// Action surface for a single Messaging conversation.
//
// Responsibilities:
// - compose conversation-level actions;
// - use backend-provided conversation capabilities;
// - provide the current member context to individual actions.
//
// Non-responsibilities:
// - fetching conversation data;
// - performing conversation mutations;
// - authorizing the current member;
// - reconstructing Messaging domain rules;
// - calling HTTP APIs directly.
//
// Mutation ownership:
//
//     LeaveConversationAction
//         └── useLeaveMessagingConversation()
//
//     CloseConversationAction
//         └── useCloseMessagingConversation()
//
// The backend remains authoritative for authorization and lifecycle rules.
// -----------------------------------------------------------------------------

'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation';

import type {
  MessagingConversation,
} from '@/features/messaging/models';

import { CloseConversationAction } from './close-conversation-action';
import { LeaveConversationAction } from './leave-conversation-action';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MessagingConversationActionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Conversation represented by this action surface.
   */
  readonly conversation: MessagingConversation;

  /**
   * Public ID of the currently authenticated member.
   *
   * Passed to actions where member-specific presentation context is required.
   */
  readonly currentMemberPublicId?: string;

  /**
   * Disables all conversation actions.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingConversationActions({
  conversation,
  currentMemberPublicId,
  disabled = false,
  className,
  ...props
}: MessagingConversationActionsProps) {
  // ---------------------------------------------------------------------------
  // Conversation-level capability gates
  // ---------------------------------------------------------------------------
  //
  // These flags originate from the backend response model. We do not recreate
  // the aggregate's lifecycle rules in the frontend.
  //
  const canClose =
    conversation.canBeClosed &&
    conversation.isActive &&
    !disabled;

  const canLeave =
    conversation.isActive &&
    !disabled;

  // ---------------------------------------------------------------------------
  // Nothing available
  // ---------------------------------------------------------------------------

  if (!canClose && !canLeave) {
    return null;
  }

  return (
    <div
      {...props}
      className={cn(
        'flex items-center gap-2',
        className,
      )}
      data-conversation-actions={
        conversation.publicId
      }
    >
      {canLeave ? (
        <LeaveConversationAction
          conversation={conversation}
          currentMemberPublicId={currentMemberPublicId}
          disabled={disabled}
        />
      ) : null}

      {canClose ? (
        <CloseConversationAction
          conversation={conversation}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}