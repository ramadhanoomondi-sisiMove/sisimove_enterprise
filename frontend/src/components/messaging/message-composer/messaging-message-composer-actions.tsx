// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Composer Actions
// -----------------------------------------------------------------------------
//
// Presentation actions for the Messaging composer.
//
// Responsibilities:
// - Render the send action.
// - Represent sending/disabled state.
//
// Non-responsibilities:
// - Calling the Messaging API.
// - Constructing the message command.
// - Owning mutation state.
//
// The parent MessagingMessageComposer owns useSendMessagingMessage().
// -----------------------------------------------------------------------------

'use client';

import {
  Loader2,
  Send,
} from 'lucide-react';

import { cn } from '@/foundation';

export interface MessagingMessageComposerActionsProps {
  readonly canSend: boolean;
  readonly isSending?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function MessagingMessageComposerActions({
  canSend,
  isSending = false,
  disabled = false,
  className,
}: MessagingMessageComposerActionsProps) {
  const isDisabled =
    disabled ||
    !canSend ||
    isSending;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center',
        className,
      )}
    >
      <button
        type="submit"
        disabled={isDisabled}
        aria-label={
          isSending
            ? 'Sending message'
            : 'Send message'
        }
        className={cn(
          'inline-flex min-h-10 min-w-10 items-center justify-center',
          'rounded-[var(--radius-md)]',
          'bg-[var(--brand)]',
          'text-[var(--brand-foreground)]',
          'transition-colors duration-150 ease-out',
          'hover:bg-[var(--brand-hover)]',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[var(--brand)]/20',
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
        )}
      >
        {isSending ? (
          <Loader2
            aria-hidden="true"
            className="size-4 animate-spin"
          />
        ) : (
          <Send
            aria-hidden="true"
            className="size-4"
          />
        )}
      </button>
    </div>
  );
}