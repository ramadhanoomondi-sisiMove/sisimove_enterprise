// src/features/admin/boardings/layout/BoardingSectionHeader.tsx

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

export interface BoardingSectionHeaderProps {
  title: string;
  description?: string;
  trailingContent?: ReactNode;
  className?: string;
}

export function BoardingSectionHeader({
  title,
  description,
  trailingContent,
  className,
}: BoardingSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
            {description}
          </p>
        )}
      </div>

      {trailingContent && (
        <div className="shrink-0">{trailingContent}</div>
      )}
    </div>
  );
}
