
'use client';

import { useState } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface TransactionPublicIdProps {
  publicId: string;
  className?: string;
  truncate?: boolean;
  copyable?: boolean;
}

export function TransactionPublicId({
  publicId,
  className,
  truncate = true,
  copyable = false,
}: TransactionPublicIdProps) {
  const [copied, setCopied] = useState(false);

  const displayId =
    truncate && publicId.length > 18
      ? `${publicId.slice(0, 10)}…${publicId.slice(-6)}`
      : publicId;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2', className)}>
      <code
        title={publicId}
        aria-label={`Transaction public ID: ${publicId}`}
        className="min-w-0 truncate rounded-md bg-[var(--background-muted)] px-2 py-1 font-mono text-xs text-[var(--foreground-secondary)]"
      >
        {displayId}
      </code>

      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 text-xs font-medium text-[var(--foreground-secondary)] underline-offset-4 hover:text-[var(--foreground)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
          aria-label={`Copy transaction ID ${publicId}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
    </span>
  );
}

export default TransactionPublicId;
