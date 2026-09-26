// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Status Badge
// -----------------------------------------------------------------------------
//
// Compact presentation of Messaging Conversation lifecycle status.
//
// Responsibilities:
// - Render the conversation's current status.
// - Map backend-compatible status to a design-system Badge variant.
// - Provide an accessible status label.
//
// Non-responsibilities:
// - Authorization.
// - Conversation lifecycle transitions.
// - Capability calculation.
// - API calls.
// - Data fetching.
// - Mutation.
//
// The backend remains authoritative for conversation status.
// -----------------------------------------------------------------------------

import type { ComponentPropsWithoutRef } from 'react';

import {
  Badge,
  type BadgeVariant,
} from '@/components/ui/badge';

import type { MessagingConversationStatus } from '@/features/messaging/models/messaging-conversation-status';

import { MESSAGING_CONVERSATION_STATUSES } from '@/features/messaging/models/messaging-conversation-status';

import { getMessagingConversationStatusLabel } from'@/features/messaging/presentation/messaging-conversation-labels';

// =============================================================================
// Types
// =============================================================================

export interface MessagingConversationStatusBadgeProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Badge>,
    'children' | 'variant'
  > {
  /**
   * Backend-provided Messaging Conversation lifecycle status.
   */
  status: MessagingConversationStatus;

  /**
   * Optional override for the semantic Badge variant.
   *
   * Normally the component derives this from the conversation status.
   */
  variant?: BadgeVariant;
}

// =============================================================================
// Presentation Mapping
// =============================================================================

const statusVariants: Record<
  MessagingConversationStatus,
  BadgeVariant
> = {
  [MESSAGING_CONVERSATION_STATUSES.ACTIVE]: 'success',
  [MESSAGING_CONVERSATION_STATUSES.CLOSED]: 'default',
};

// =============================================================================
// Component
// =============================================================================

export function MessagingConversationStatusBadge({
  status,
  variant,
  size = 'sm',
  className,
  ...props
}: MessagingConversationStatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariants[status];

  const label = getMessagingConversationStatusLabel(status);

  return (
    <Badge
      {...props}
      variant={resolvedVariant}
      size={size}
      className={className}
      aria-label={`Conversation status: ${label}`}
    >
      {label}
    </Badge>
  );
}