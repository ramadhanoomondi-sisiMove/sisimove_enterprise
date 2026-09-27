// -----------------------------------------------------------------------------
// sisiMove — Support Case Conversation
// -----------------------------------------------------------------------------
//
// Member-facing Support conversation surface.
//
// Responsibilities:
// - load messages for the selected Support case;
// - display the message collection;
// - expose the message composer for operational cases;
// - display conversation-level loading/error/empty states.
//
// Non-responsibilities:
// - case lifecycle mutation;
// - participant administration;
// - internal notes;
// - resolution creation;
// - assignment management;
// - message transport;
// - optimistic mutation state.
//
// Message sending/editing/deletion remains delegated to the dedicated
// message components and mutation hooks.
//
// -----------------------------------------------------------------------------

'use client';

import { Card } from '@/components/ui/card';

import type { SupportCase } from '@/features/support-case/models';

import { useSupportCaseMessages } from '@/features/support-case/hooks';
import { SupportCaseMessageList } from '../support-case-message-list';

export interface SupportCaseConversationProps {
  supportCase: SupportCase;
}

export function SupportCaseConversation({
  supportCase,
}: SupportCaseConversationProps) {
  const {
    data: messages,
    isLoading,
    isError,
  } = useSupportCaseMessages(supportCase.publicId);

  return (
    <Card
      variant="default"
      padding="md"
    >
      <div className="space-y-4">
        <div
          className={[
            'flex',
            'items-center',
            'justify-between',
            'gap-3',
          ].join(' ')}
        >
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Conversation
            </h2>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Messages between you and SisiMove support.
            </p>
          </div>

          {supportCase.messageCount > 0 && (
            <span className="text-xs text-[var(--foreground-muted)]">
              {supportCase.messageCount}{' '}
              {supportCase.messageCount === 1 ? 'message' : 'messages'}
            </span>
          )}
        </div>

        {isLoading ? (
          <ConversationLoading />
        ) : isError ? (
          <div
            role="alert"
            className={[
              'rounded-[var(--radius-md)]',
              'bg-[var(--danger-soft)]',
              'p-3',
              'text-sm',
              'text-[var(--danger)]',
            ].join(' ')}
          >
            We could not load the conversation. Please try again.
          </div>
        ) : (
          <SupportCaseMessageList
            supportCase={supportCase}
            messages={messages ?? []}
          />
        )}
      </div>
    </Card>
  );
}

function ConversationLoading() {
  return (
    <div
      aria-label="Loading conversation"
      aria-busy="true"
      className="space-y-3 animate-pulse"
    >
      <div className="h-16 w-4/5 rounded-[var(--radius-lg)] bg-[var(--background-muted)]" />
      <div className="ml-auto h-14 w-3/4 rounded-[var(--radius-lg)] bg-[var(--background-muted)]" />
      <div className="h-20 w-4/5 rounded-[var(--radius-lg)] bg-[var(--background-muted)]" />
    </div>
  );
}