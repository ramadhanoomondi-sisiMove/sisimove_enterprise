// -----------------------------------------------------------------------------
// sisiMove — Messaging Conversation Participant Status
// -----------------------------------------------------------------------------
//
// Small presentation component for participant lifecycle state.
//
// The backend projection is authoritative. No local lifecycle inference is
// performed here.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/badge';

import type { MessagingParticipantStatus } from '@/features/messaging/models/messaging-participant-status';
import { MESSAGING_PARTICIPANT_STATUSES } from '@/features/messaging/models/messaging-participant-status';
import {
  getMessagingParticipantStatusLabel,
} from '@/features/messaging/presentation/messaging-participant-labels';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingConversationParticipantStatusProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Badge>,
    'children' | 'variant'
  > {
  readonly status: MessagingParticipantStatus;
  readonly variant?: BadgeVariant;
}

// -----------------------------------------------------------------------------
// Status presentation
// -----------------------------------------------------------------------------

const statusVariants: Record<
  MessagingParticipantStatus,
  BadgeVariant
> = {
  [MESSAGING_PARTICIPANT_STATUSES.ACTIVE]: 'success',
  [MESSAGING_PARTICIPANT_STATUSES.LEFT]: 'default',
  [MESSAGING_PARTICIPANT_STATUSES.REMOVED]: 'danger',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingConversationParticipantStatus({
  status,
  variant,
  size = 'sm',
  className,
  ...props
}: MessagingConversationParticipantStatusProps) {
  const resolvedVariant =
    variant ?? statusVariants[status];

  const label =
    getMessagingParticipantStatusLabel(status);

  return (
    <Badge
      {...props}
      variant={resolvedVariant}
      size={size}
      className={className}
      aria-label={`Participant status: ${label}`}
    >
      {label}
    </Badge>
  );
}