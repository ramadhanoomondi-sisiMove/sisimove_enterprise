
'use client';

import { useState } from 'react';
import {
  Archive,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface AssetActionsMenuProps {
  readonly visibility: 'PUBLIC' | 'PRIVATE';
  readonly archived?: boolean;
  readonly deleted?: boolean;
  readonly disabled?: boolean;
  readonly onChangeVisibility?: () => void;
  readonly onArchive?: () => void;
  readonly onDelete?: () => void;
  readonly className?: string;
}

export function AssetActionsMenu({
  visibility,
  archived = false,
  deleted = false,
  disabled = false,
  onChangeVisibility,
  onArchive,
  onDelete,
  className,
}: AssetActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const actions = [
    ...(onChangeVisibility
      ? [
          {
            label:
              visibility === 'PUBLIC'
                ? 'Make private'
                : 'Make public',
            icon: visibility === 'PUBLIC' ? EyeOff : Eye,
            onClick: onChangeVisibility,
            danger: false,
          },
        ]
      : []),
    ...(!archived && !deleted && onArchive
      ? [
          {
            label: 'Archive asset',
            icon: Archive,
            onClick: onArchive,
            danger: false,
          },
        ]
      : []),
    ...(!deleted && onDelete
      ? [
          {
            label: 'Delete asset',
            icon: Trash2,
            onClick: onDelete,
            danger: true,
          },
        ]
      : []),
  ];

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-label="Asset actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-lg',
          'border border-[var(--border)] bg-[var(--background)]',
          'text-[var(--muted-foreground)]',
          'transition-colors hover:bg-[var(--background-subtle)]',
          'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
          'focus-visible:outline-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </button>

      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close asset actions menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            aria-label="Asset actions"
            className={cn(
              'absolute right-0 top-full z-50 mt-2 w-52',
              'rounded-xl border border-[var(--border)]',
              'bg-[var(--background)] p-1.5 shadow-lg',
            )}
          >
            {actions.map(({ label, icon: Icon, onClick, danger }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                disabled={disabled}
                onClick={() => {
                  setOpen(false);
                  onClick();
                }}
                className={cn(
                  'flex min-h-10 w-full items-center gap-3 rounded-lg',
                  'px-3 py-2 text-left text-sm font-medium',
                  'transition-colors hover:bg-[var(--background-subtle)]',
                  'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
                  'focus-visible:outline-offset-[-2px]',
                  'disabled:pointer-events-none disabled:opacity-50',
                  danger
                    ? 'text-[var(--danger)]'
                    : 'text-[var(--foreground)]',
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AssetActionsMenu;
