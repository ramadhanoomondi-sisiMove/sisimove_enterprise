
'use client';

import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyPublicIdProps {
  publicId: string;
  copyable?: boolean;
  compact?: boolean;
  className?: string;
}

export function JourneyPublicId({
  publicId,
  copyable = true,
  compact = false,
  className,
}: JourneyPublicIdProps) {
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'copied' | 'error'
  >('idle');

  const normalizedPublicId = publicId.trim();

  async function handleCopy() {
    if (!normalizedPublicId || !navigator.clipboard?.writeText) {
      setCopyStatus('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedPublicId);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  }

  if (!normalizedPublicId) {
    return (
      <span
        className={cn(
          'text-xs text-[var(--foreground-muted)]',
          className,
        )}
      >
        Not available
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex min-w-0 max-w-full items-center gap-2',
        className,
      )}
    >
      <code
        title={normalizedPublicId}
        className={cn(
          'min-w-0 truncate font-mono tracking-tight',
          'text-[var(--foreground-secondary)]',
          compact ? 'text-[11px]' : 'text-xs',
        )}
      >
        {normalizedPublicId}
      </code>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy journey ID ${normalizedPublicId}`}
          title={
            copyStatus === 'copied'
              ? 'Copied'
              : copyStatus === 'error'
                ? 'Unable to copy journey ID'
                : 'Copy journey ID'
          }
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center',
            'rounded-[var(--radius-md)]',
            'text-[var(--foreground-muted)]',
            'transition-colors duration-150',
            'hover:bg-[var(--background-muted)]',
            'hover:text-[var(--foreground)]',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]/30',
          )}
        >
          {copyStatus === 'copied' ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 text-[var(--success)]"
            >
              <path
                d="m4.5 10 3.5 3.5 7.5-7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
            >
              <rect
                x="7"
                y="7"
                width="9"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 7V4.5A1.5 1.5 0 0 0 10.5 3h-6A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      )}
    </span>
  );
}

export default JourneyPublicId;
