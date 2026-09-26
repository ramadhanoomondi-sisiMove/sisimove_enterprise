// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Card
// -----------------------------------------------------------------------------
//
// Presentation-only message card.
//
// This is intentionally a compact reusable wrapper around the canonical
// MessagingMessage presentation component.
//
// Responsibilities:
// - Present a single Messaging message in a card-like surface.
// - Preserve ownership alignment through currentMemberPublicId.
// - Provide an optional consumer-owned selection callback.
//
// Non-responsibilities:
// - Fetching messages.
// - Editing/deleting/moderating messages.
// - Sending messages.
// - Loading Assets.
// - Resolving Asset URLs.
//
// Message lifecycle actions belong to the dedicated message-actions surface.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
} from 'react';

import {
  cn,
} from '@/foundation';

import type {
  MessagingMessage as MessagingMessageModel,
} from '@/features/messaging/models';

import {
  MessagingMessage,
} from '../message';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MessagingMessageCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children' | 'onClick' | 'onSelect'
  > {
  /**
   * Fully mapped Messaging message.
   */
  readonly message: MessagingMessageModel;

  /**
   * Authenticated member public ID.
   *
   * Used only to determine visual ownership/alignment.
   */
  readonly currentMemberPublicId?: string;

  /**
   * Optional presentation-level selection state.
   */
  readonly selected?: boolean;

  /**
   * Optional consumer-owned selection callback.
   *
   * The card supplies the canonical Messaging message rather than
   * exposing the underlying DOM event.
   */
  readonly onSelect?: (
    message: MessagingMessageModel,
  ) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MessagingMessageCard({
  message,
  currentMemberPublicId,
  selected = false,
  onSelect,
  className,
  ...props
}: MessagingMessageCardProps) {
  const isInteractive = Boolean(onSelect);

  const handleSelect = () => {
    onSelect?.(message);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!isInteractive) {
      return;
    }

    if (
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return;
    }

    event.preventDefault();
    handleSelect();
  };

  return (
    <div
      {...props}
      className={cn(
        'w-full rounded-[var(--radius-lg)]',
        selected &&
          'bg-[var(--background-subtle)]',
        isInteractive &&
          'cursor-pointer',
        className,
      )}
      data-message-card-public-id={
        message.publicId
      }
      onClick={
        isInteractive
          ? handleSelect
          : undefined
      }
      onKeyDown={
        isInteractive
          ? handleKeyDown
          : undefined
      }
      role={
        isInteractive
          ? 'button'
          : undefined
      }
      tabIndex={
        isInteractive
          ? 0
          : undefined
      }
    >
      <MessagingMessage
        message={message}
        currentMemberPublicId={
          currentMemberPublicId
        }
      />
    </div>
  );
}