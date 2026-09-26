// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Card
// -----------------------------------------------------------------------------
//
// Presentation-only conversation card.
//
// Responsibilities:
// - Present a Messaging conversation as a compact navigable card.
// - Display conversation type, status, participant/message counts, and activity.
// - Expose selection handling to the consuming component.
//
// Non-responsibilities:
// - Loading conversations.
// - Fetching participants/messages.
// - Creating or mutating conversations.
// - Performing navigation internally.
// - Deciding whether a conversation is authorized for the current member.
//
// The conversation list owns the query and supplies the fully mapped model.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
} from 'react';

import {
  ChevronRight,
  MessageCircle,
  Users,
} from 'lucide-react';

import {
  cn,
} from '@/foundation';

import type {
  MessagingConversation,
} from '@/features/messaging/models';

import {
  MessagingConversationStatusBadge,
} from '../conversation-status';

import {
  getMessagingConversationTypeLabel,
} from '@/features/messaging/presentation';

import {
  Button,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingConversationCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'onClick' | 'onSelect'
  > {
  /**
   * Fully mapped Messaging conversation.
   */
  readonly conversation: MessagingConversation;

  /**
   * Whether this card represents the currently selected conversation.
   */
  readonly selected?: boolean;

  /**
   * Called when the consumer wants to select/open this conversation.
   *
   * The card supplies the canonical Messaging conversation rather than
   * exposing the underlying DOM event.
   */
  readonly onSelect?: (
    conversation: MessagingConversation,
  ) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingConversationCard({
  conversation,
  selected = false,
  onSelect,
  className,
  ...props
}: MessagingConversationCardProps) {
  const typeLabel =
    getMessagingConversationTypeLabel(
      conversation.type,
    );

  const lastActivityLabel =
    conversation.lastMessageAt
      ? new Intl.DateTimeFormat(
          'en-KE',
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          },
        ).format(conversation.lastMessageAt)
      : 'No messages yet';

  const isInteractive = Boolean(onSelect);

  const handleSelect = () => {
    onSelect?.(conversation);
  };

  return (
    <div
      {...props}
      className={cn(
        'w-full',
        className,
      )}
      data-conversation-public-id={
        conversation.publicId
      }
    >
      <Button
        type="button"
        variant="ghost"
        size="md"
        disabled={!isInteractive}
        onClick={handleSelect}
        className={cn(
          'h-auto w-full justify-start',
          'rounded-[var(--radius-lg)]',
          'border px-3 py-3 text-left',
          'transition-colors',
          selected
            ? [
                'border-[var(--brand)]',
                'bg-[var(--brand-soft)]',
              ].join(' ')
            : [
                'border-[var(--border)]',
                'bg-[var(--surface)]',
                'hover:border-[var(--border-strong)]',
                'hover:bg-[var(--background-subtle)]',
              ].join(' '),
        )}
        trailingIcon={
          isInteractive ? (
            <ChevronRight
              aria-hidden="true"
              className="size-4 shrink-0"
            />
          ) : undefined
        }
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-9 shrink-0 items-center justify-center',
              'rounded-[var(--radius-md)]',
              selected
                ? 'bg-[var(--brand)] text-[var(--brand-foreground)]'
                : 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
            )}
          >
            <MessageCircle
              className="size-4"
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                {typeLabel}
              </span>

              <MessagingConversationStatusBadge
                status={conversation.status}
              />
            </span>

            <span className="mt-1 block truncate text-xs text-[var(--foreground-muted)]">
              Journey {conversation.journeyPublicId}
            </span>

            <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
              <span className="inline-flex items-center gap-1">
                <Users
                  aria-hidden="true"
                  className="size-3.5"
                />
                <span>
                  {conversation.participantCount}{' '}
                  {conversation.participantCount === 1
                    ? 'participant'
                    : 'participants'}
                </span>
              </span>

              <span>
                {conversation.messageCount}{' '}
                {conversation.messageCount === 1
                  ? 'message'
                  : 'messages'}
              </span>
            </span>

            <span className="mt-1 block text-xs text-[var(--foreground-subtle)]">
              {lastActivityLabel}
            </span>
          </span>
        </div>
      </Button>
    </div>
  );
}