// -----------------------------------------------------------------------------
// sisiMove — Messaging Message Asset
// -----------------------------------------------------------------------------
//
// Presentation boundary for a Messaging message attachment.
//
// Messaging owns only the assetPublicId reference.
// It does not resolve Asset URLs or call the Assets API.
//
// A future Assets presentation integration can resolve the reference without
// changing the Messaging domain model or message component contract.
//
// Responsibilities:
// - Present the existence/type of an attached asset.
// - Preserve the assetPublicId as the domain reference.
//
// Non-responsibilities:
// - Uploading assets.
// - Resolving asset URLs.
// - Downloading assets.
// - Asset authorization.
// - API communication.
// -----------------------------------------------------------------------------

import type { HTMLAttributes } from 'react';

import {
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

import { cn } from '@/foundation';

import type { MessagingMessage } from '@/features/messaging/models';
import {
  MESSAGING_MESSAGE_TYPES,
} from '@/features/messaging/models/messaging-message-type';

export interface MessagingMessageAssetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly message: MessagingMessage;
  readonly isOwnMessage?: boolean;
}

export function MessagingMessageAsset({
  message,
  isOwnMessage = false,
  className,
  ...props
}: MessagingMessageAssetProps) {
  if (!message.assetPublicId) {
    return null;
  }

  const isImage =
    message.type === MESSAGING_MESSAGE_TYPES.IMAGE;

  const Icon = isImage ? ImageIcon : FileText;

  return (
    <div
      {...props}
      className={cn(
        'mt-2 flex items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-xs',
        isOwnMessage
          ? 'border-white/20 bg-white/10 text-[var(--brand-foreground)]'
          : 'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
        className,
      )}
      data-asset-public-id={message.assetPublicId}
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0"
      />

      <span className="min-w-0 truncate">
        {isImage
          ? 'Image attachment'
          : 'File attachment'}
      </span>
    </div>
  );
}