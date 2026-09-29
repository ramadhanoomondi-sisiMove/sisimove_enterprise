// -----------------------------------------------------------------------------
// sisiMove — Support Case Message
// -----------------------------------------------------------------------------
//
// Presentation of one Support case message.
//
// Responsibilities:
// - display message type/content;
// - display server-provided edited/deleted state;
// - display sent time;
// - distinguish system messages visually.
//
// Non-responsibilities:
// - resolving sender identities through another domain;
// - determining whether a message belongs to the current member;
// - editing/deleting the message;
// - sending messages;
// - resolving message assets.
//
// Sender identity is intentionally represented by the opaque sender public ID
// at this presentation boundary. A future identity/profile composition layer
// may supply a display identity without changing this Support model.
//
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui/badge';

import type { SupportCaseMessage as SupportCaseMessageModel } from '@/features/support-case/models';

export interface SupportCaseMessageProps {
  message: SupportCaseMessageModel;
}

export function SupportCaseMessageItem({
  message,
}: SupportCaseMessageProps) {
  const isSystemMessage = message.type === 'SYSTEM';
  const isDeleted = message.isDeleted;

  return (
    <article
      className={[
        'rounded-[var(--radius-lg)]',
        'border',
        'p-3',
        isSystemMessage
          ? [
              'border-[var(--border-subtle)]',
              'bg-[var(--background-subtle)]',
            ].join(' ')
          : [
              'border-[var(--border)]',
              'bg-[var(--surface)]',
            ].join(' '),
      ].join(' ')}
    >
      <div
        className={[
          'flex',
          'items-start',
          'justify-between',
          'gap-3',
        ].join(' ')}
      >
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            {isSystemMessage ? 'SisiMove' : 'Support message'}
          </p>

          {!isSystemMessage && (
            <p className="mt-0.5 truncate text-[11px] text-[var(--foreground-subtle)]">
              {message.senderPublicId}
            </p>
          )}
        </div>

        {isSystemMessage && (
          <Badge
            variant="default"
            size="sm"
          >
            System
          </Badge>
        )}
      </div>

      <div className="mt-3">
        {isDeleted ? (
          <p
            className={[
              'text-sm',
              'italic',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            This message was deleted.
          </p>
        ) : message.content ? (
          <p
            className={[
              'whitespace-pre-wrap',
              'break-words',
              'text-sm',
              'leading-6',
              'text-[var(--foreground)]',
            ].join(' ')}
          >
            {message.content}
          </p>
        ) : message.type === 'IMAGE' ? (
          <p className="text-sm text-[var(--foreground-secondary)]">
            Image attachment
          </p>
        ) : message.type === 'FILE' ? (
          <p className="text-sm text-[var(--foreground-secondary)]">
            File attachment
          </p>
        ) : (
          <p className="text-sm text-[var(--foreground-muted)]">
            No message content.
          </p>
        )}
      </div>

      <div
        className={[
          'mt-3',
          'flex',
          'items-center',
          'gap-2',
          'text-[11px]',
          'text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        <time dateTime={message.sentAt.toISOString()}>
          {formatMessageDate(message.sentAt)}
        </time>

        {message.isEdited && !isDeleted && (
          <span aria-label="Edited">
            · Edited
          </span>
        )}

        {message.assetId && !isDeleted && (
          <span>
            · Attachment
          </span>
        )}
      </div>
    </article>
  );
}

function formatMessageDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}