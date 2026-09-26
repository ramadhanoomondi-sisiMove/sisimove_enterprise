'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Header Actions
// -----------------------------------------------------------------------------
//
// Conversation-level action composition for the Messaging header.
//
// Responsibilities:
// - compose conversation lifecycle actions;
// - expose actions represented by the conversation projection;
// - delegate mutations to the dedicated action components;
// - remain below the page data boundary.
//
// Non-responsibilities:
// - fetching the conversation;
// - performing mutations directly;
// - implementing authorization;
// - loading Identity or membership data;
// - deciding backend authorization;
// - controlling the internal presentation contract of lifecycle actions.
//
// The backend/domain conversation projection remains authoritative for
// conversation lifecycle capabilities.
//
// Each lifecycle action owns:
// - its mutation hook;
// - confirmation UI;
// - pending state;
// - mutation error handling.
//
// This component only composes those actions.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { MoreHorizontal } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { MessagingConversation } from '@/features/messaging/models';

import { CloseConversationAction } from '../conversation-actions/close-conversation-action';
import { LeaveConversationAction } from '../conversation-actions/leave-conversation-action';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationHeaderActionsProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /**
   * Resolved conversation projection.
   *
   * Capability flags originate from the backend/domain projection and are
   * treated as authoritative presentation inputs.
   */
  readonly conversation: MessagingConversation;

  /**
   * Public identifier of the authenticated member.
   *
   * This is contextual information passed to the action composition boundary.
   * It is not an authorization decision.
   */
  readonly currentMemberPublicId?: string;
}

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationHeaderActions({
  conversation,
  currentMemberPublicId,
  className,
  ...props
}: MessagingConversationHeaderActionsProps) {
  // ---------------------------------------------------------------------------
  // Capability composition
  // ---------------------------------------------------------------------------
  //
  // Closing is explicitly represented by the conversation projection.
  //
  // Leaving is a participant/member operation. The current member identifier
  // provides the action component with authenticated-member context, but its
  // presence alone must not be treated as backend authorization.
  //
  // The action component/backend remains responsible for enforcing whether
  // the operation is actually permitted.
  // ---------------------------------------------------------------------------

  const canShowCloseAction =
    conversation.canBeClosed;

  const canShowLeaveAction =
    conversation.isActive &&
    Boolean(currentMemberPublicId);

  const hasActions =
    canShowCloseAction ||
    canShowLeaveAction;

  if (!hasActions) {
    return null;
  }

  return (
    <div
      {...props}
      className={cn(
        'flex shrink-0 items-center gap-1',
        className,
      )}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Desktop actions                                                   */}
      {/* ----------------------------------------------------------------- */}

      <div
        className="hidden items-center gap-1 sm:flex"
        aria-label="Conversation actions"
      >
        {canShowCloseAction ? (
          <CloseConversationAction
            conversation={conversation}
          />
        ) : null}

        {canShowLeaveAction ? (
          <LeaveConversationAction
            conversation={conversation}
          />
        ) : null}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Mobile affordance                                                */}
      {/* ----------------------------------------------------------------- */}
      {/*
       * The current component contract does not include an interactive
       * mobile menu.
       *
       * Therefore this remains an explicit visual affordance rather than a
       * misleading button that appears actionable but performs no operation.
       *
       * When a real menu is introduced, it should compose the same lifecycle
       * action components instead of duplicating mutation logic here.
       */}

      <div
        className="sm:hidden"
        aria-hidden="true"
        title="Conversation actions"
      >
        <div
          className={cn(
            'flex size-9 items-center justify-center',
            'rounded-[var(--radius-md)]',
            'border border-[var(--border)]',
            'text-[var(--foreground-muted)]',
          )}
        >
          <MoreHorizontal className="size-4" />
        </div>
      </div>
    </div>
  );
}