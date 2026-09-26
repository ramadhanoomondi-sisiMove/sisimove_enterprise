// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Content
// -----------------------------------------------------------------------------
//
// Presentation of textual Messaging message content.
//
// Responsibilities:
// - Render message text.
// - Preserve intentional line breaks.
// - Present deleted/moderated states.
//
// Non-responsibilities:
// - Editing.
// - Sending.
// - Validation.
// - API communication.
// - Mutation ownership.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation';

import type { MessagingMessage } from '@/features/messaging/models';

export interface MessagingMessageContentProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
  readonly message: MessagingMessage;
}

export function MessagingMessageContent({
  message,
  className,
  ...props
}: MessagingMessageContentProps) {
  const content = message.content?.trim();

  if (!content) {
    return null;
  }

  return (
    <p
      {...props}
      className={cn(
        'whitespace-pre-wrap break-words text-sm leading-6',
        message.isDeleted && 'italic',
        className,
      )}
    >
      {message.isDeleted
        ? 'This message was deleted.'
        : message.isModerated
          ? 'This message is unavailable.'
          : content}
    </p>
  );
}