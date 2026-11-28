// src/components/admin/commissions/shared/CommissionPublicId.tsx
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Public ID
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a commission public identifier.
// - Provide a consistent monospace presentation.
// - Optionally allow copying the identifier.
// - Support compact display through truncation.
// - Remain reusable across commission surfaces.
//
// -----------------------------------------------------------------------------

import {
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CommissionPublicIdProps {
  readonly publicId: string;
  readonly copyable?: boolean;
  readonly truncate?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionPublicId({
  publicId,
  copyable = false,
  truncate = true,
  className,
}: CommissionPublicIdProps) {
  const [copied, setCopied] = useState(false);

  const normalizedPublicId = publicId.trim();

  async function handleCopy(): Promise<void> {
    if (!normalizedPublicId || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedPublicId);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span
      className={[
        'inline-flex',
        'max-w-full',
        'items-center',
        'gap-2',
        className,
      ].filter(Boolean).join(' ')}
    >
      <code
        title={normalizedPublicId}
        className={[
          'min-w-0',
          'font-mono',
          'text-xs',
          'text-[var(--foreground-secondary)]',
          truncate && 'truncate',
        ].filter(Boolean).join(' ')}
      >
        {normalizedPublicId || '—'}
      </code>

      {copyable && normalizedPublicId && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={!navigator.clipboard?.writeText}
          onClick={handleCopy}
          aria-label="Copy commission public ID"
          title="Copy public ID"
          className="min-h-7 px-2 text-xs"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      )}
    </span>
  );
}