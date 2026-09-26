// -----------------------------------------------------------------------------
// sisiMove — Messaging Empty State
// -----------------------------------------------------------------------------
//
// Presentation-only empty state for Messaging.
//
// Responsibilities:
// - Provide a reusable Messaging-specific empty-state presentation.
// - Explain why the Messaging area may currently be empty.
// - Allow optional consumer-owned content below the empty-state primitive.
//
// Non-responsibilities:
// - Loading Messaging data.
// - Creating conversations.
// - Fetching conversations.
// - Performing navigation implicitly.
// - Owning domain or mutation logic.
//
// The component intentionally remains generic enough to be used by both the
// conversation list and other Messaging surfaces.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import {
  MessageCircle,
} from 'lucide-react';

import {
  cn,
} from '@/foundation';

import {
  EmptyState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingEmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Optional custom title.
   *
   * Defaults to the standard Messaging empty-state title.
   */
  readonly title?: string;

  /**
   * Optional custom description.
   *
   * Defaults to the standard Messaging explanation.
   */
  readonly description?: string;

  /**
   * Optional consumer-owned action/content.
   *
   * The Messaging empty state does not decide what action should be available.
   * The supplied node is rendered beneath the canonical EmptyState primitive.
   */
  readonly action?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingEmptyState({
  title = 'No conversations yet',
  description =
    'Conversations related to your journeys and bookings will appear here.',
  action,
  className,
  ...props
}: MessagingEmptyStateProps) {
  return (
    <div
      {...props}
      className={cn(
        'w-full',
        className,
      )}
    >
      <EmptyState
        icon={
          <MessageCircle
            aria-hidden="true"
            className="size-6"
          />
        }
        title={title}
        description={description}
      />

      {action ? (
        <div className="mt-4 flex justify-center">
          {action}
        </div>
      ) : null}
    </div>
  );
}