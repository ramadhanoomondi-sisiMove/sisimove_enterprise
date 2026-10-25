
import { cn } from '@/foundation/utils/cn';

export interface AccountHoldPublicIdProps {
  publicId: string;
  visibleCharacters?: number;
  className?: string;
}

export function AccountHoldPublicId({
  publicId,
  visibleCharacters = 16,
  className,
}: AccountHoldPublicIdProps) {
  const normalizedId = publicId.trim();
  const limit = Math.max(4, visibleCharacters);

  const displayId =
    normalizedId.length > limit
      ? `${normalizedId.slice(0, limit)}…`
      : normalizedId;

  return (
    <code
      className={cn(
        'inline-block max-w-full truncate',
        'rounded-[var(--radius-sm)]',
        'border border-[var(--border-subtle)]',
        'bg-[var(--background-muted)]',
        'px-2 py-1',
        'font-mono text-xs',
        'text-[var(--foreground-secondary)]',
        className,
      )}
      title={normalizedId || undefined}
      aria-label={
        normalizedId ? `Public ID: ${normalizedId}` : 'No public ID'
      }
    >
      {displayId || '—'}
    </code>
  );
}
