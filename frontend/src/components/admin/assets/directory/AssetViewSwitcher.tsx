
'use client';

import { Grid2X2, List } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { cn } from '@/foundation/utils/cn';

export type AssetViewMode = 'table' | 'grid';

export interface AssetViewSwitcherProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  readonly value: AssetViewMode;
  readonly onChange: (view: AssetViewMode) => void;
  readonly disabled?: boolean;
}

const VIEW_OPTIONS: ReadonlyArray<{
  value: AssetViewMode;
  label: string;
  Icon: typeof List;
}> = [
  { value: 'table', label: 'Table view', Icon: List },
  { value: 'grid', label: 'Grid view', Icon: Grid2X2 },
];

export function AssetViewSwitcher({
  value,
  onChange,
  disabled = false,
  className,
  ...props
}: AssetViewSwitcherProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label="Asset display mode"
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-xl border',
        'border-[var(--border)] bg-[var(--background)] p-1',
        className,
      )}
    >
      {VIEW_OPTIONS.map(({ value: option, label, Icon }) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-lg',
              'transition-colors focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
              isActive
                ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Icon aria-hidden="true" className="size-[18px]" />
          </button>
        );
      })}
    </div>
  );
}

export default AssetViewSwitcher;
