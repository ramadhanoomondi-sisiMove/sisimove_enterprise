'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Header
// -----------------------------------------------------------------------------
//
// Conversation header boundary for an authenticated Messaging conversation.
//
// Responsibilities:
// - resolve the conversation by public ID;
// - own the conversation query lifecycle;
// - display conversation identity and context;
// - display conversation type and lifecycle status;
// - display participant and message counts;
// - display last activity when available;
// - compose conversation-level actions.
//
// Non-responsibilities:
// - performing conversation mutations directly;
// - deciding authorization;
// - loading Journey, Booking, Identity, or Traveller Profile data;
// - resolving conversation participants or messages;
// - implementing Messaging API transport.
//
// Data ownership:
// - This component owns useMessagingConversation().
// - Action components own their individual mutations.
// - The page supplies only the route public ID and presentation context.
//
// This component is intentionally the query-owning boundary for the header.
// There is no separate conversation-header container in the component tree,
// so the page can remain a thin route/composition boundary.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import {
  MessageCircle,
  Users,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import {
  useMessagingConversation,
} from '@/features/messaging/hooks/queries';

import {
  getMessagingConversationTypeLabel,
} from '@/features/messaging/presentation';

import { MessagingConversationStatusBadge } from '../conversation-status';

import { MessagingConversationHeaderActions } from './messaging-conversation-header-actions';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationHeaderProps
  extends Omit<ComponentPropsWithoutRef<'header'>, 'children'> {
  /**
   * Opaque public identifier of the conversation.
   *
   * This is the route-level conversation identifier.
   */
  readonly conversationPublicId: string;

  /**
   * Public identifier of the currently authenticated member.
   *
   * This is presentation context passed to conversation actions.
   *
   * It is not an authorization decision.
   */
  readonly currentMemberPublicId?: string;

  /**
   * Whether conversation-level actions should be displayed.
   *
   * Defaults to true.
   */
  readonly showActions?: boolean;
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Formats the conversation's most recent message activity for display.
 *
 * The Messaging model owns the timestamp.
 * Presentation owns its human-readable formatting.
 */
function formatLastActivity(
  lastMessageAt: Date | undefined,
): string | null {
  if (!lastMessageAt) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(lastMessageAt);
}

// =============================================================================
// Loading State
// =============================================================================

function MessagingConversationHeaderLoading({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <header
      aria-busy="true"
      aria-label="Loading conversation"
      className={cn(
        'bg-[var(--surface)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-h-16 items-center gap-3',
          'px-4 py-3 sm:px-5',
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'size-10 shrink-0 animate-pulse',
            'rounded-[var(--radius-full)]',
            'bg-[var(--background-muted)]',
          )}
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div
            aria-hidden="true"
            className={cn(
              'h-4 w-36 max-w-full animate-pulse',
              'rounded-[var(--radius-sm)]',
              'bg-[var(--background-muted)]',
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              'h-3 w-52 max-w-full animate-pulse',
              'rounded-[var(--radius-sm)]',
              'bg-[var(--background-muted)]',
            )}
          />
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// Error State
// =============================================================================

function MessagingConversationHeaderError({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <header
      role="alert"
      className={cn(
        'bg-[var(--surface)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-h-16 items-center gap-3',
          'px-4 py-3 sm:px-5',
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'flex size-10 shrink-0 items-center justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[var(--danger-soft)]',
            'text-[var(--danger)]',
          )}
        >
          <MessageCircle className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Conversation unavailable
          </p>

          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            The conversation could not be loaded.
          </p>
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationHeader({
  conversationPublicId,
  currentMemberPublicId,
  showActions = true,
  className,
  ...props
}: MessagingConversationHeaderProps) {
  // ---------------------------------------------------------------------------
  // Conversation query
  // ---------------------------------------------------------------------------
  //
  // This is the only Messaging server-state operation owned by the header.
  //
  // The page intentionally does not fetch the conversation.
  // ---------------------------------------------------------------------------

  const conversationQuery =
    useMessagingConversation(
      conversationPublicId,
    );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (conversationQuery.isLoading) {
    return (
      <MessagingConversationHeaderLoading
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Error / unavailable conversation
  // ---------------------------------------------------------------------------

  if (
    conversationQuery.isError ||
    !conversationQuery.data
  ) {
    return (
      <MessagingConversationHeaderError
        className={className}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Resolved conversation
  // ---------------------------------------------------------------------------

  const conversation =
    conversationQuery.data;

  const typeLabel =
    getMessagingConversationTypeLabel(
      conversation.type,
    );

  const lastActivity =
    formatLastActivity(
      conversation.lastMessageAt,
    );

  const participantLabel =
    conversation.participantCount === 1
      ? 'participant'
      : 'participants';

  const messageLabel =
    conversation.messageCount === 1
      ? 'message'
      : 'messages';

  return (
    <header
      {...props}
      className={cn(
        'bg-[var(--surface)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-h-16 items-center gap-3',
          'px-4 py-3 sm:px-5',
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Conversation identity                                            */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
          )}
          aria-hidden="true"
        >
          <MessageCircle className="size-5" />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Conversation information                                         */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h1
              className={cn(
                'min-w-0 truncate',
                'text-sm font-semibold',
                'text-[var(--foreground)]',
                'sm:text-base',
              )}
            >
              {typeLabel} conversation
            </h1>

            <MessagingConversationStatusBadge
              status={conversation.status}
              size="sm"
            />
          </div>

          <div
            className={cn(
              'mt-1 flex min-w-0 flex-wrap items-center',
              'gap-x-3 gap-y-1',
              'text-xs text-[var(--foreground-muted)]',
            )}
          >
            {/* ------------------------------------------------------------- */}
            {/* Participants                                                  */}
            {/* ------------------------------------------------------------- */}

            <span className="inline-flex items-center gap-1.5">
              <Users
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />

              <span>
                {conversation.participantCount}{' '}
                {participantLabel}
              </span>
            </span>

            <span
              className="text-[var(--foreground-subtle)]"
              aria-hidden="true"
            >
              ·
            </span>

            {/* ------------------------------------------------------------- */}
            {/* Messages                                                     */}
            {/* ------------------------------------------------------------- */}

            <span>
              {conversation.messageCount}{' '}
              {messageLabel}
            </span>

            {/* ------------------------------------------------------------- */}
            {/* Last activity                                                */}
            {/* ------------------------------------------------------------- */}

            {lastActivity ? (
              <>
                <span
                  className="text-[var(--foreground-subtle)]"
                  aria-hidden="true"
                >
                  ·
                </span>

                <span className="min-w-0 truncate">
                  Last activity {lastActivity}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Conversation actions                                              */}
        {/* ----------------------------------------------------------------- */}

        {showActions ? (
          <MessagingConversationHeaderActions
            conversation={conversation}
            currentMemberPublicId={
              currentMemberPublicId
            }
          />
        ) : null}
      </div>
    </header>
  );
}