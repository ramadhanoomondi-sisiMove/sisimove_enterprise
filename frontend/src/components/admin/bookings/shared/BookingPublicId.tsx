
'use client';

import { useState } from 'react';

interface BookingPublicIdProps {
  publicId: string;
  showCopyButton?: boolean;
  truncate?: boolean;
  className?: string;
}

export function BookingPublicId({
  publicId,
  showCopyButton = false,
  truncate = true,
  className = '',
}: BookingPublicIdProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );

  const normalizedId = publicId.trim();

  async function handleCopy() {
    if (!normalizedId || !navigator.clipboard?.writeText) {
      setCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedId);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    window.setTimeout(() => setCopyState('idle'), 1800);
  }

  if (!normalizedId) {
    return (
      <span className={className || 'text-sm text-[var(--foreground-muted)]'}>
        —
      </span>
    );
  }

  return (
    <span
      className={`inline-flex min-w-0 max-w-full items-center gap-2 ${className}`}
    >
      <code
        title={normalizedId}
        className={`min-w-0 rounded-md bg-[var(--background-subtle)] px-2 py-1 font-mono text-xs text-[var(--foreground-secondary)] ${
          truncate ? 'truncate' : 'break-all'
        }`}
      >
        {normalizedId}
      </code>

      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy booking public ID"
          title={
            copyState === 'copied'
              ? 'Copied'
              : copyState === 'error'
                ? 'Unable to copy'
                : 'Copy ID'
          }
          className="shrink-0 rounded-md p-1.5 text-xs text-[var(--foreground-muted)] transition hover:bg-[var(--background-muted)] hover:text-[var(--foreground)]"
        >
          {copyState === 'copied' ? (
            <span aria-hidden="true">✓</span>
          ) : (
            <span aria-hidden="true">⧉</span>
          )}
        </button>
      )}

      {copyState !== 'idle' && (
        <span role="status" className="sr-only">
          {copyState === 'copied' ? 'Booking ID copied' : 'Unable to copy ID'}
        </span>
      )}
    </span>
  );
}
