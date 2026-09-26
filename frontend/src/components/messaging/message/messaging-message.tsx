// -----------------------------------------------------------------------------
// sisiMove — Messaging Message
// -----------------------------------------------------------------------------
//
// Presentation component for a single Messaging message.
//
// Responsibilities:
// - Render one MessagingMessage model.
// - Determine whether the message belongs to the current member.
// - Compose message content, asset, metadata, and status presentation.
//
// Non-responsibilities:
// - Fetching messages.
// - Sending messages.
// - Editing messages.
// - Deleting messages.
// - Moderating messages.
// - Conversation membership.
// - Authorization.
// - Asset URL resolution.
// - API communication.
//
// Query/mutation ownership:
// - None.
//
// Parent data owner:
// - MessagingMessageList owns useMessagingConversationMessages().
// - MessagingMessageActions owns message mutations.
// -----------------------------------------------------------------------------

'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation';

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

import { MessagingMessageAsset } from './messaging-message-asset';
import { MessagingMessageContent } from './messaging-message-content';
import { MessagingMessageMeta } from './messaging-message-meta';

export interface MessagingMessageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly message: MessagingMessageModel;
  readonly currentMemberPublicId?: string;
}

export function MessagingMessage({
  message,
  currentMemberPublicId,
  className,
  ...props
}: MessagingMessageProps) {
  const isOwnMessage =
    Boolean(currentMemberPublicId) &&
    message.senderPublicId === currentMemberPublicId;

  const hasContent =
    message.hasContent && Boolean(message.content);

  const hasAsset =
    message.hasAsset && Boolean(message.assetPublicId);

  return (
    <div
      {...props}
      className={cn(
        'flex w-full',
        isOwnMessage
          ? 'justify-end'
          : 'justify-start',
        className,
      )}
      data-message-public-id={message.publicId}
    >
      <article
        className={cn(
          'max-w-[min(85%,36rem)] rounded-[var(--radius-lg)] border px-3 py-2 shadow-[var(--shadow-sm)]',
          isOwnMessage
            ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)]'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]',
          message.isDeleted && 'opacity-70',
          message.isModerated && 'opacity-80',
        )}
        aria-label={
          isOwnMessage
            ? 'Message sent by you'
            : 'Message from conversation member'
        }
      >
        {hasContent ? (
          <MessagingMessageContent
            message={message}
          />
        ) : null}

        {hasAsset ? (
          <MessagingMessageAsset
            message={message}
            isOwnMessage={isOwnMessage}
          />
        ) : null}

        <MessagingMessageMeta
          message={message}
          isOwnMessage={isOwnMessage}
        />
      </article>
    </div>
  );
}