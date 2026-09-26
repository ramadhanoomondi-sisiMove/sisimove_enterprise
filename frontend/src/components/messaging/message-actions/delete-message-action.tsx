// -----------------------------------------------------------------------------
// sisiMove — Delete Messaging Message Action
// -----------------------------------------------------------------------------
//
// Owns the delete mutation for one Messaging message.
//
// Responsibilities:
// - expose a delete trigger;
// - provide explicit confirmation before deletion;
// - invoke useDeleteMessagingMessage();
// - prevent accidental dismissal while deletion is processing;
// - close the confirmation surface after successful deletion.
//
// Non-responsibilities:
// - fetching message data;
// - authorizing the member;
// - implementing message lifecycle rules;
// - directly calling the HTTP API;
// - deciding whether the current member is allowed to delete the message.
//
// Authorization and lifecycle rules remain backend/domain responsibilities.
// The parent action surface is responsible for using the message capability
// flags to decide whether this action should be presented.
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';

import {
  Button,
  Dialog,
} from '@/components/ui';

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

import {
  useDeleteMessagingMessage,
} from '@/features/messaging/hooks/mutations';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DeleteMessageActionProps {
  /**
   * Messaging message targeted by this action.
   */
  readonly message: MessagingMessageModel;

  /**
   * Prevents opening or interacting with the action.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DeleteMessageAction({
  message,
  disabled = false,
}: DeleteMessageActionProps) {
  // ---------------------------------------------------------------------------
  // Local confirmation state
  // ---------------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const deleteMessageMutation =
    useDeleteMessagingMessage();

  const isDeleting =
    deleteMessageMutation.isPending;

  // ---------------------------------------------------------------------------
  // Open confirmation
  // ---------------------------------------------------------------------------

  const handleOpen = () => {
    if (disabled || isDeleting) {
      return;
    }

    setOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Dialog state
  // ---------------------------------------------------------------------------
  //
  // While deletion is in progress, the confirmation surface remains open.
  // This prevents the user from accidentally dismissing the interaction while
  // the mutation is being processed.
  //
  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) {
      return;
    }

    setOpen(nextOpen);
  };

  // ---------------------------------------------------------------------------
  // Cancel
  // ---------------------------------------------------------------------------

  const handleCancel = () => {
    if (isDeleting) {
      return;
    }

    setOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Confirm deletion
  // ---------------------------------------------------------------------------

  const handleConfirm = async () => {
    if (isDeleting) {
      return;
    }

    await deleteMessageMutation.mutateAsync(
      message.publicId,
    );

    // The dialog closes only after the mutation resolves successfully.
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
        aria-label="Delete message"
        title="Delete message"
        disabled={disabled || isDeleting}
        onClick={handleOpen}
        leadingIcon={
          isDeleting ? (
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
            />
          ) : (
            <Trash2
              aria-hidden="true"
              className="size-4"
            />
          )
        }
      >
        <span className="sr-only">
          Delete message
        </span>
      </Button>

      {/* --------------------------------------------------------------------- */}
      {/* Confirmation dialog                                                   */}
      {/* --------------------------------------------------------------------- */}

      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Delete message"
        description="This action cannot be undone."
      >
        <div className="space-y-4">
          {/* ----------------------------------------------------------------- */}
          {/* Consequence notice                                                */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={[
              'flex',
              'items-start',
              'gap-3',
              'rounded-[var(--radius-md)]',
              'border',
              'border-[var(--danger)]',
              'bg-[var(--danger-soft)]',
              'p-3',
            ].join(' ')}
          >
            <AlertTriangle
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
            />

            <p className="text-sm leading-5 text-[var(--foreground-secondary)]">
              The message will be deleted from the
              conversation and its content will no
              longer be available.
            </p>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Actions                                                           */}
          {/* ----------------------------------------------------------------- */}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isDeleting}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              loading={isDeleting}
              onClick={() => {
                void handleConfirm();
              }}
            >
              Delete message
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}