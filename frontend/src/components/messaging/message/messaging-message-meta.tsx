// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Meta
// -----------------------------------------------------------------------------
//
// Presentation of message metadata.
//
// Responsibilities:
// - Render the sent timestamp.
// - Render message lifecycle status.
//
// Non-responsibilities:
// - Changing message state.
// - Performing mutations.
// - Authorization.
// - API communication.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation';

import type { MessagingMessage } from '@/features/messaging/models';

import { MessagingMessageStatus } from './messaging-message-status';

export interface MessagingMessageMetaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly message: MessagingMessage;
  readonly isOwnMessage?: boolean;
}

function formatMessageTime(
  value: Date,
): string {
  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

export function MessagingMessageMeta({
  message,
  isOwnMessage = false,
  className,
  ...props
}: MessagingMessageMetaProps) {
  return (
    <div
      {...props}
      className={cn(
        'mt-1.5 flex items-center justify-end gap-2 text-[11px] leading-4',
        isOwnMessage
          ? 'text-white/75'
          : 'text-[var(--foreground-muted)]',
        className,
      )}
    >
      <time dateTime={message.sentAt.toISOString()}>
        {formatMessageTime(message.sentAt)}
      </time>

      <MessagingMessageStatus
        message={message}
        isOwnMessage={isOwnMessage}
      />
    </div>
  );
}