
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionDurationProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  start: string | Date | null | undefined;
  end: string | Date | null | undefined;
  fallback?: string;
}

function toTimestamp(value: string | Date): number {
  return value instanceof Date
    ? value.getTime()
    : new Date(value).getTime();
}

function formatDuration(durationMs: number): string {
  const totalMinutes = Math.floor(durationMs / 60_000);

  const days = Math.floor(totalMinutes / 1_440);
  const hours = Math.floor((totalMinutes % 1_440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return [
      `${days}d`,
      hours > 0 ? `${hours}h` : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  if (hours > 0) {
    return [
      `${hours}h`,
      minutes > 0 ? `${minutes}m` : null,
    ]
      .filter(Boolean)
      .join(' ');
  }

  return `${minutes}m`;
}

export function JourneyCompletionDuration({
  start,
  end,
  fallback = '—',
  className,
  ...props
}: JourneyCompletionDurationProps) {
  if (!start || !end) {
    return (
      <span
        className={cn(
          'text-sm text-[var(--foreground-muted)]',
          className,
        )}
      >
        {fallback}
      </span>
    );
  }

  const startTime = toTimestamp(start);
  const endTime = toTimestamp(end);

  if (
    !Number.isFinite(startTime) ||
    !Number.isFinite(endTime) ||
    endTime < startTime
  ) {
    return (
      <span
        className={cn(
          'text-sm text-[var(--foreground-muted)]',
          className,
        )}
      >
        {fallback}
      </span>
    );
  }

  return (
    <span
      {...props}
      className={cn(
        'text-sm',
        'tabular-nums',
        'text-[var(--foreground-secondary)]',
        className,
      )}
    >
      {formatDuration(endTime - startTime)}
    </span>
  );
}
