
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionPublicIdProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  publicId?: string | null;
  prefix?: string;
  maxLength?: number;
}

export function JourneyCompletionPublicId({
  publicId,
  prefix,
  maxLength = 16,
  className,
  ...props
}: JourneyCompletionPublicIdProps) {
  // ---------------------------------------------------------------------------
  // Normalize Public ID
  // ---------------------------------------------------------------------------

  const normalizedId =
    typeof publicId === 'string'
      ? publicId.trim()
      : '';

  // ---------------------------------------------------------------------------
  // Determine Visible ID
  // ---------------------------------------------------------------------------

  const safeMaxLength =
    Number.isFinite(maxLength) && maxLength > 0
      ? Math.floor(maxLength)
      : 16;

  const visibleId =
    normalizedId.length > safeMaxLength
      ? `${normalizedId.slice(0, safeMaxLength)}…`
      : normalizedId;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <span
      {...props}
      title={normalizedId || undefined}
      className={cn(
        'inline-flex',
        'min-w-0',
        'items-center',
        'gap-1',
        'font-mono',
        'text-xs',
        'text-[var(--foreground-secondary)]',
        className,
      )}
    >
      {prefix && (
        <span className="shrink-0 text-[var(--foreground-muted)]">
          {prefix}
        </span>
      )}

      <span className="truncate">
        {visibleId || '—'}
      </span>
    </span>
  );
}
