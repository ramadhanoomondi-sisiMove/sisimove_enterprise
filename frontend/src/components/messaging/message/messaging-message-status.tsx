// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Status
// -----------------------------------------------------------------------------
//
// Presentation of the Messaging message lifecycle state.
//
// Responsibilities:
// - Translate the existing backend-provided message state into a compact
//   visual representation.
//
// Non-responsibilities:
// - Changing message state.
// - Determining authorization.
// - Performing mutations.
// - API communication.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import {
  Check,
  CheckCheck,
  CircleAlert,
} from 'lucide-react';

import { cn } from '@/foundation';

import type { MessagingMessage } from '@/features/messaging/models';

export interface MessagingMessageStatusProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  readonly message: MessagingMessage;
  readonly isOwnMessage?: boolean;
}

export function MessagingMessageStatus({
  message,
  isOwnMessage = false,
  className,
  ...props
}: MessagingMessageStatusProps) {
  if (message.isDeleted) {
    return (
      <span
        {...props}
        className={cn(
          'italic',
          className,
        )}
      >
        Deleted
      </span>
    );
  }

  if (message.isModerated) {
    return (
      <span
        {...props}
        className={cn(
          'inline-flex items-center gap-1',
          className,
        )}
      >
        <CircleAlert
          aria-hidden="true"
          className="size-3"
        />

        <span>Unavailable</span>
      </span>
    );
  }

  if (message.isEdited) {
    return (
      <span
        {...props}
        className={className}
      >
        Edited
      </span>
    );
  }

  if (!isOwnMessage) {
    return null;
  }

  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center',
        className,
      )}
    >
      {message.isSent ? (
        <CheckCheck
          aria-label="Sent"
          className="size-3.5"
        />
      ) : (
        <Check
          aria-label="Sent"
          className="size-3.5"
        />
      )}
    </span>
  );
}