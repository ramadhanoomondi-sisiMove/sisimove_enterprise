// src/features/admin/boardings/shared/BoardingPublicId.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Boarding Public ID
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a boarding public ID consistently
// - Support compact and regular presentation
// - Optionally copy the ID to the clipboard
// - Provide accessible labels and feedback
// - Avoid exposing internal database identifiers
//
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BoardingPublicIdProps {
  publicId: string;
  copyable?: boolean;
  compact?: boolean;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BoardingPublicId({
  publicId,
  copyable = false,
  compact = false,
  className,
}: BoardingPublicIdProps) {
  const [copied, setCopied] = useState(false);

  const normalizedPublicId = publicId.trim();

  async function handleCopy() {
    if (!normalizedPublicId || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedPublicId);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!normalizedPublicId) {
    return (
      <span
        className={cn(
          'text-sm text-[var(--foreground-muted)]',
          className,
        )}
      >
        —
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex',
        'min-w-0',
        'max-w-full',
        'items-center',
        'gap-2',
        className,
      )}
    >
      <code
        title={normalizedPublicId}
        className={cn(
          'min-w-0',
          'truncate',
          'font-mono',
          'font-medium',
          'text-[var(--foreground-secondary)]',
          compact ? 'text-xs' : 'text-sm',
        )}
      >
        {normalizedPublicId}
      </code>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          disabled={!normalizedPublicId}
          aria-label={
            copied
              ? 'Public ID copied'
              : `Copy public ID ${normalizedPublicId}`
          }
          title={copied ? 'Copied' : 'Copy public ID'}
          className={cn(
            'inline-flex',
            'h-7',
            'w-7',
            'shrink-0',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-sm)]',
            'text-[var(--foreground-muted)]',
            'transition-colors',
            'hover:bg-[var(--background-muted)]',
            'hover:text-[var(--foreground)]',
            'focus-visible:outline-2',
            'focus-visible:outline-offset-2',
            'focus-visible:outline-[var(--brand)]',
          )}
        >
          {copied ? (
            <Check
              aria-hidden="true"
              className="h-4 w-4 text-[var(--success)]"
            />
          ) : (
            <Copy
              aria-hidden="true"
              className="h-4 w-4"
            />
          )}
        </button>
      )}
    </span>
  );
}
