// -----------------------------------------------------------------------------
// sisiMove — Close Messaging Conversation Action
// -----------------------------------------------------------------------------
//
// Owns the close-conversation mutation for a Messaging conversation.
//
// Responsibilities:
// - expose a close trigger;
// - provide explicit confirmation;
// - invoke useCloseMessagingConversation();
// - close the confirmation surface after successful mutation.
//
// Non-responsibilities:
// - fetching conversation data;
// - determining whether the current member is authorized;
// - implementing conversation lifecycle rules;
// - calling the HTTP API directly.
//
// The backend remains authoritative for whether the conversation can be closed.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Archive,
  Loader2,
} from 'lucide-react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import type {
  MessagingConversation,
} from '@/features/messaging/models';

import {
  useCloseMessagingConversation,
} from '@/features/messaging/hooks/mutations';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CloseConversationActionProps {
  /**
   * Conversation targeted by the close action.
   */
  readonly conversation: MessagingConversation;

  /**
   * Disables the action.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CloseConversationAction({
  conversation,
  disabled = false,
}: CloseConversationActionProps) {
  const [open, setOpen] = useState(false);

  const closeConversationMutation =
    useCloseMessagingConversation();

  const isClosing =
    closeConversationMutation.isPending;

  // ---------------------------------------------------------------------------
  // Open confirmation
  // ---------------------------------------------------------------------------

  const handleOpen = () => {
    if (disabled || isClosing) {
      return;
    }

    setOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------

  const handleOpenChange = (nextOpen: boolean) => {
    if (isClosing) {
      return;
    }

    setOpen(nextOpen);
  };

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    if (isClosing) {
      return;
    }

    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Confirm close
  // ---------------------------------------------------------------------------

  const handleConfirm = async () => {
    if (isClosing) {
      return;
    }

    await closeConversationMutation.mutateAsync(
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
        aria-label="Close conversation"
        title="Close conversation"
        disabled={disabled || isClosing}
        onClick={handleOpen}
        leadingIcon={
          isClosing ? (
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
            />
          ) : (
            <Archive
              aria-hidden="true"
              className="size-4"
            />
          )
        }
      >
        <span className="sr-only">
          Close conversation
        </span>
      </Button>

      {/* --------------------------------------------------------------------- */}
      {/* Confirmation dialog                                                   */}
      {/* --------------------------------------------------------------------- */}

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Close conversation"
        description="This conversation will no longer accept new messages."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning-soft)] p-3">
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--warning)]"
            />

            <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
              Closing the conversation ends its active
              messaging lifecycle. Existing conversation
              history remains available.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isClosing}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={isClosing}
              onClick={() => {
                void handleConfirm();
              }}
            >
              Close conversation
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}