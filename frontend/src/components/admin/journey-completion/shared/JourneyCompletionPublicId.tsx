
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionPublicIdProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  publicId: string;
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
  const normalizedId = publicId.trim();

  const visibleId =
    normalizedId.length > maxLength
      ? `${normalizedId.slice(0, maxLength)}…`
      : normalizedId;

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
