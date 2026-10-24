// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Public ID
// -----------------------------------------------------------------------------
//
// Displays a public ID with optional copy interaction. Never displays an
// internal database identifier.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui';

export interface FinancialAccountPublicIdProps {
  publicId: string;
  truncate?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

export function FinancialAccountPublicId({
  publicId,
  truncate = true,
  showCopyButton = true,
  className,
}: FinancialAccountPublicIdProps) {
  const [copied, setCopied] = useState(false);
  const normalizedPublicId = publicId.trim();

  const handleCopy = async () => {
    if (!normalizedPublicId || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(normalizedPublicId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className ?? ''}`}>
      <code
        title={normalizedPublicId}
        className={[
          'min-w-0 font-mono text-xs text-[var(--foreground-secondary)]',
          truncate ? 'truncate' : 'break-all',
        ].join(' ')}
      >
        {normalizedPublicId || '—'}
      </code>

      {showCopyButton && normalizedPublicId && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={copied ? 'Public ID copied' : 'Copy public ID'}
          title={copied ? 'Copied' : 'Copy public ID'}
          onClick={handleCopy}
          className="h-8 min-h-8 w-8 shrink-0 px-0"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
    </span>
  );
}

export default FinancialAccountPublicId;
