'use client';

// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Participants
// -----------------------------------------------------------------------------
//
// Feature component responsible for loading and presenting the participants
// belonging to a messaging conversation.
//
// Responsibilities:
// - own the participants query;
// - handle loading, error, and empty states;
// - render participant presentation components.
//
// Non-responsibilities:
// - authorization;
// - participant mutations;
// - loading Identity / Traveller Profile data;
// - deciding participant roles;
// - modifying conversation state.
//
// Participant lifecycle actions remain separate feature components.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { ErrorState, Skeleton } from '@/components/ui';
import { cn } from '@/foundation/utils/cn';
import type { MessagingConversationParticipant } from '@/features/messaging/models';
import { useMessagingConversationParticipants } from '@/features/messaging/hooks/queries';

import { MessagingConversationParticipantItem } from './messaging-conversation-participant';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingConversationParticipantsProps
  extends Omit<ComponentPropsWithoutRef<'section'>, 'children'> {
  readonly conversationPublicId: string;
  readonly currentMemberPublicId?: string;
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function MessagingConversationParticipantsLoading({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Loading conversation participants"
      aria-busy="true"
    >
      <div className="border-b border-[var(--border-subtle)] px-4 py-3">
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-9 w-9 rounded-[var(--radius-full)]" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-9 w-9 rounded-[var(--radius-full)]" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Error
// -----------------------------------------------------------------------------

function MessagingConversationParticipantsError({
  message,
  className,
}: {
  readonly message: string;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <ErrorState
        title="Unable to load participants"
        description={message}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Empty
// -----------------------------------------------------------------------------

function MessagingConversationParticipantsEmpty({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Conversation participants"
    >
      <div className="px-4 py-6 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">
          No participants
        </p>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          This conversation does not have any participants yet.
        </p>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingConversationParticipants({
  conversationPublicId,
  currentMemberPublicId,
  className,
  ...props
}: MessagingConversationParticipantsProps) {
  const participantsQuery =
    useMessagingConversationParticipants(conversationPublicId);

  if (participantsQuery.isPending) {
    return (
      <MessagingConversationParticipantsLoading
        className={className}
      />
    );
  }

  if (participantsQuery.isError) {
    return (
      <MessagingConversationParticipantsError
        className={className}
        message={
          participantsQuery.error instanceof Error
            ? participantsQuery.error.message
            : 'We could not load the conversation participants. Please try again.'
        }
      />
    );
  }

  const participants: MessagingConversationParticipant[] =
    participantsQuery.data ?? [];

  if (participants.length === 0) {
    return (
      <MessagingConversationParticipantsEmpty
        className={className}
      />
    );
  }

  return (
    <section
      {...props}
      className={cn(
        'overflow-hidden rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        className,
      )}
      aria-label="Conversation participants"
    >
      <div className="border-b border-[var(--border-subtle)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Participants
        </h2>

        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
          {participants.length}{' '}
          {participants.length === 1 ? 'participant' : 'participants'}
        </p>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {participants.map((participant) => (
          <MessagingConversationParticipantItem
            key={participant.publicId}
            participant={participant}
            currentMemberPublicId={currentMemberPublicId}
          />
        ))}
      </div>
    </section>
  );
}