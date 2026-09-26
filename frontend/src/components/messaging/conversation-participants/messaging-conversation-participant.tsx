// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Participant
// -----------------------------------------------------------------------------
//
// Presentation component for one conversation participant.
//
// This component intentionally does not fetch Identity / Traveller Profile
// information. The messaging participant projection only gives us the opaque
// memberPublicId. Resolving public profile information is a separate concern.
//
// It also does not perform participant mutations. Lifecycle operations belong
// to dedicated action components so that mutation ownership remains explicit.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { ShieldCheck, UserRound } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { MessagingConversationParticipant } from '@/features/messaging/models';
import {
  getMessagingParticipantRoleLabel,
} from '@/features/messaging/presentation';

import { MessagingConversationParticipantStatus } from './messaging-conversation-participant-status';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingConversationParticipantProps
  extends Omit<ComponentPropsWithoutRef<'article'>, 'children'> {
  readonly participant: MessagingConversationParticipant;
  readonly currentMemberPublicId?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getParticipantLabel(
  participant: MessagingConversationParticipant,
): string {
  if (participant.isProvider) {
    return 'Provider';
  }

  if (participant.isPassenger) {
    return 'Passenger';
  }

  return getMessagingParticipantRoleLabel(participant.role);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingConversationParticipantItem({
  participant,
  currentMemberPublicId,
  className,
  ...props
}: MessagingConversationParticipantProps) {
  const isCurrentMember =
    currentMemberPublicId === participant.memberPublicId;

  const roleLabel = getParticipantLabel(participant);

  return (
    <article
      {...props}
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        className,
      )}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Participant avatar                                                */}
      {/* ----------------------------------------------------------------- */}

      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center',
          'rounded-[var(--radius-full)]',
          participant.isProvider
            ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
            : 'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
        )}
        aria-hidden="true"
      >
        {participant.isProvider ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <UserRound className="h-4 w-4" />
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Participant identity reference                                    */}
      {/* ----------------------------------------------------------------- */}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {isCurrentMember
              ? 'You'
              : participant.memberPublicId}
          </p>

          {isCurrentMember ? (
            <span className="shrink-0 text-xs text-[var(--foreground-muted)]">
              (you)
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-[var(--foreground-muted)]">
            {roleLabel}
          </span>

          {participant.hasReadPosition ? (
            <span
              className="text-xs text-[var(--foreground-subtle)]"
              title={
                participant.lastReadAt
                  ? `Last read ${new Intl.DateTimeFormat('en-KE', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(participant.lastReadAt)}`
                  : 'Has a read position'
              }
            >
              · Read position available
            </span>
          ) : null}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Lifecycle status                                                   */}
      {/* ----------------------------------------------------------------- */}

      <MessagingConversationParticipantStatus
        status={participant.status}
      />
    </article>
  );
}