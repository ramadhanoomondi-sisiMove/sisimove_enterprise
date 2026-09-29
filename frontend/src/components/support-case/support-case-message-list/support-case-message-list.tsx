// -----------------------------------------------------------------------------
// sisiMove — Support Case Message List
// -----------------------------------------------------------------------------
//
// Presentation collection for Support case messages.
//
// Responsibilities:
// - preserve the server-provided message ordering;
// - render each Support message;
// - provide an appropriate empty conversation state.
//
// Non-responsibilities:
// - fetching messages;
// - sorting messages;
// - identifying participants through other domains;
// - editing/deleting messages;
// - sending messages.
//
// The API response order is treated as authoritative. The frontend does not
// reorder messages by timestamp because message ordering is a transport/query
// responsibility.
//
// -----------------------------------------------------------------------------

import type { SupportCase } from '@/features/support-case/models';
import type { SupportCaseMessage } from '@/features/support-case/models/support-case-message';

import { SupportCaseMessageItem } from '../support-case-message';

export interface SupportCaseMessageListProps {
  supportCase: SupportCase;
  messages: SupportCaseMessage[];
}

export function SupportCaseMessageList({
  supportCase,
  messages,
}: SupportCaseMessageListProps) {
  if (messages.length === 0) {
    return (
      <div
        className={[
          'rounded-[var(--radius-md)]',
          'border',
          'border-dashed',
          'border-[var(--border)]',
          'bg-[var(--background-subtle)]',
          'px-4',
          'py-8',
          'text-center',
        ].join(' ')}
      >
        <p className="text-sm text-[var(--foreground-secondary)]">
          No messages have been sent yet.
        </p>

        {!supportCase.isOpen && (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            This case is no longer accepting conversation activity.
          </p>
        )}
      </div>
    );
  }

  return (
    <ol
      aria-label="Support case messages"
      className="space-y-3"
    >
      {messages.map((message) => (
        <li key={message.publicId}>
          <SupportCaseMessageItem message={message} />
        </li>
      ))}
    </ol>
  );
}