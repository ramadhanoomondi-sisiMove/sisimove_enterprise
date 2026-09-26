// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Actions
// -----------------------------------------------------------------------------
//
// Action surface for a single Messaging message.
//
// Responsibilities:
// - compose the available message-level actions;
// - determine presentation-level ownership context;
// - respect backend-provided message capabilities.
//
// Non-responsibilities:
// - fetching message data;
// - performing mutations;
// - authorizing the current member;
// - reconstructing Messaging domain rules;
// - calling HTTP APIs directly.
//
// Mutation ownership:
//
//     EditMessageAction
//         └── useEditMessagingMessage()
//
//     DeleteMessageAction
//         └── useDeleteMessagingMessage()
//
// The backend remains authoritative for mutation authorization. The capability
// flags exposed by MessagingMessage are used as the UI-level availability
// contract.
// -----------------------------------------------------------------------------

'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation';

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

import { DeleteMessageAction } from './delete-message-action';
import { EditMessageAction } from './edit-message-action';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MessagingMessageActionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Messaging message represented by this action surface.
   */
  readonly message: MessagingMessageModel;

  /**
   * Public ID of the authenticated member.
   *
   * Used for presentation-level ownership context only.
   * The backend remains authoritative for authorization.
   */
  readonly currentMemberPublicId?: string;

  /**
   * Disables all message actions.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingMessageActions({
  message,
  currentMemberPublicId,
  disabled = false,
  className,
  ...props
}: MessagingMessageActionsProps) {
  // ---------------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------------
  //
  // Edit and delete are member-owned actions. We therefore only expose them
  // when the current member is the sender.
  //
  // This is not an authorization mechanism. The backend must independently
  // enforce the same domain rule.
  //
  const isOwnMessage =
    Boolean(currentMemberPublicId) &&
    message.senderPublicId === currentMemberPublicId;

  // ---------------------------------------------------------------------------
  // Backend-provided capabilities
  // ---------------------------------------------------------------------------

  const canEdit =
    isOwnMessage &&
    message.canBeEdited &&
    !disabled;

  const canDelete =
    isOwnMessage &&
    message.canBeDeleted &&
    !disabled;

  // ---------------------------------------------------------------------------
  // Nothing available
  // ---------------------------------------------------------------------------

  if (!canEdit && !canDelete) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Action surface
  // ---------------------------------------------------------------------------

  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-end gap-1',
        className,
      )}
      data-message-actions={message.publicId}
    >
      {canEdit ? (
        <EditMessageAction
          message={message}
          disabled={disabled}
        />
      ) : null}

      {canDelete ? (
        <DeleteMessageAction
          message={message}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}