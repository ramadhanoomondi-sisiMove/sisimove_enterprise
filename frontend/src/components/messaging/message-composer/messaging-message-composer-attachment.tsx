// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Composer Attachment
// -----------------------------------------------------------------------------
//
// Attachment action for the Messaging composer.
//
// Responsibilities:
// - Present the attachment affordance.
// - Notify the owning composer when the user requests an attachment.
//
// Non-responsibilities:
// - Uploading Assets.
// - Creating Assets.
// - Resolving Asset URLs.
// - Sending Messaging messages.
// - API communication.
//
// The parent MessagingMessageComposer owns the complete upload/send workflow.
// -----------------------------------------------------------------------------

'use client';

import {
  Paperclip,
} from 'lucide-react';

import { cn } from '@/foundation';

export interface MessagingMessageComposerAttachmentProps {
  readonly disabled?: boolean;
  readonly onOpen: () => void;
  readonly className?: string;
}

export function MessagingMessageComposerAttachment({
  disabled = false,
  onOpen,
  className,
}: MessagingMessageComposerAttachmentProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center',
        className,
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        aria-label="Attach a file"
        title="Attach a file"
        className={cn(
          'inline-flex size-10 items-center justify-center',
          'rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'text-[var(--foreground-muted)]',
          'transition-colors duration-150 ease-out',
          'hover:border-[var(--border-strong)]',
          'hover:bg-[var(--background-subtle)]',
          'hover:text-[var(--foreground)]',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[var(--brand)]/20',
          'disabled:cursor-not-allowed',
          'disabled:opacity-50',
        )}
      >
        <Paperclip
          aria-hidden="true"
          className="size-4"
        />
      </button>
    </div>
  );
}