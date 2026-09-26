// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation List Item
// -----------------------------------------------------------------------------
//
// Presentation component for a single Messaging conversation.
//
// Responsibilities:
// - display information already available on MessagingConversation;
// - communicate selected state;
// - notify the parent when selected.
//
// Non-responsibilities:
// - querying conversations;
// - resolving Traveller Profiles;
// - resolving Journey data;
// - resolving Booking data;
// - resolving Asset URLs;
// - navigation;
// - conversation mutations;
// - business rules.
//
// Cross-domain presentation data should be supplied by an appropriate
// composition boundary rather than fetched from this component.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { MessageCircle } from 'lucide-react';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

import type { MessagingConversation } from '@/features/messaging/models';

import { MessagingConversationStatusBadge } from '../conversation-status';

import {
  getMessagingConversationTypeLabel,
} from '@/features/messaging/presentation';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationListItemProps {
  /**
   * Conversation represented by this item.
   */
  readonly conversation: MessagingConversation;

  /**
   * Whether this conversation is selected.
   */
  readonly selected?: boolean;

  /**
   * Called when the conversation is selected.
   *
   * Navigation remains the responsibility of the consuming workflow.
   */
  readonly onSelect?: (
    conversation: MessagingConversation,
  ) => void;
}

// =============================================================================
// Date Formatting
// =============================================================================

function formatLastMessageAt(
  value: Date | undefined,
): string {
  if (!value) {
    return 'No messages yet';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationListItem({
  conversation,
  selected = false,
  onSelect,
}: MessagingConversationListItemProps) {
  const typeLabel =
    getMessagingConversationTypeLabel(
      conversation.type,
    );

  return (
    <button
      type="button"
      onClick={() => onSelect?.(conversation)}
      className={cn(
        'flex w-full items-start gap-3 px-4 py-3',
        'text-left transition-colors duration-150',
        'hover:bg-[var(--background-subtle)]',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-inset',
        'focus-visible:ring-[var(--brand)]',
        selected &&
          'bg-[var(--brand-soft)]',
      )}
      aria-label={`${typeLabel} conversation`}
      aria-pressed={selected}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Conversation icon                                                   */}
      {/* ------------------------------------------------------------------- */}

      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center',
          'justify-center rounded-[var(--radius-full)] border',
          selected
            ? [
                'border-[var(--brand)]',
                'bg-[var(--brand-soft)]',
                'text-[var(--brand)]',
              ].join(' ')
            : [
                'border-[var(--border)]',
                'bg-[var(--background-subtle)]',
                'text-[var(--foreground-muted)]',
              ].join(' '),
        )}
      >
        <MessageCircle className="h-5 w-5" />
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Conversation information                                            */}
      {/* ------------------------------------------------------------------- */}

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-semibold text-[var(--foreground)]">
            {typeLabel} conversation
          </span>

          <MessagingConversationStatusBadge
            status={conversation.status}
            size="sm"
            className="shrink-0"
          />
        </span>

        <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
          {conversation.participantCount}{' '}
          {conversation.participantCount === 1
            ? 'participant'
            : 'participants'}
          {' · '}
          {conversation.messageCount}{' '}
          {conversation.messageCount === 1
            ? 'message'
            : 'messages'}
        </span>

        <span className="mt-1 block truncate text-xs text-[var(--foreground-subtle)]">
          {formatLastMessageAt(
            conversation.lastMessageAt,
          )}
        </span>
      </span>
    </button>
  );
}