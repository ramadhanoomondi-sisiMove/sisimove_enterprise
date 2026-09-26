// -----------------------------------------------------------------------------
// sisiMove — Leave Messaging Conversation Action
// -----------------------------------------------------------------------------
//
// Owns the leave-conversation mutation for the current member.
//
// Responsibilities:
// - expose a leave trigger;
// - provide explicit confirmation;
// - invoke useLeaveMessagingConversation();
// - close the confirmation surface after successful mutation.
//
// Non-responsibilities:
// - fetching conversation data;
// - determining membership;
// - authorizing the current member;
// - implementing participant lifecycle rules;
// - calling the HTTP API directly.
//
// The backend remains authoritative for whether the current member can leave
// the conversation.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Loader2,
  LogOut,
} from 'lucide-react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import type {
  MessagingConversation,
} from '@/features/messaging/models';

import {
  useLeaveMessagingConversation,
} from '@/features/messaging/hooks/mutations';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface LeaveConversationActionProps {
  /**
   * Conversation the current member wants to leave.
   */
  readonly conversation: MessagingConversation;

  /**
   * Current authenticated member.
   *
   * Kept as presentation/context information. The mutation itself derives
   * authorization from the authenticated backend session.
   */
  readonly currentMemberPublicId?: string;

  /**
   * Disables the action.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LeaveConversationAction({
  conversation,
  disabled = false,
}: LeaveConversationActionProps) {
  const [open, setOpen] = useState(false);

  const leaveConversationMutation =
    useLeaveMessagingConversation();

  const isLeaving =
    leaveConversationMutation.isPending;

  // ---------------------------------------------------------------------------
  // Open confirmation
  // ---------------------------------------------------------------------------

  const handleOpen = () => {
    if (disabled || isLeaving) {
      return;
    }

    setOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLeaving) {
      return;
    }

    setOpen(nextOpen);
  };

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    if (isLeaving) {
      return;
    }

    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Confirm leave
  // ---------------------------------------------------------------------------

  const handleConfirm = async () => {
    if (isLeaving) {
      return;
    }

    await leaveConversationMutation.mutateAsync(
      conversation.publicId,
    );

    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Trigger
  // ---------------------------------------------------------------------------

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 shrink-0 px-0"
        aria-label="Leave conversation"
        title="Leave conversation"
        disabled={disabled || isLeaving}
        onClick={handleOpen}
        leadingIcon={
          isLeaving ? (
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
            />
          ) : (
            <LogOut
              aria-hidden="true"
              className="size-4"
            />
          )
        }
      >
        <span className="sr-only">
          Leave conversation
        </span>
      </Button>

      {/* --------------------------------------------------------------------- */}
      {/* Confirmation dialog                                                   */}
      {/* --------------------------------------------------------------------- */}

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Leave conversation"
        description="You will no longer be an active participant in this conversation."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning-soft)] p-3">
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--warning)]"
            />

            <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
              Leaving this conversation will remove
              your active participation. You may no
              longer be able to send messages here.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isLeaving}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={isLeaving}
              onClick={() => {
                void handleConfirm();
              }}
            >
              Leave conversation
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}