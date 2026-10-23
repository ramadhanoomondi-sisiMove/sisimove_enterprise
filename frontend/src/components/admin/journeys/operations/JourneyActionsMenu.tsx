
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  CircleAlert,
  Ellipsis,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

export interface JourneyActionItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  destructive?: boolean;
  hidden?: boolean;
  onSelect: () => void;
}

export interface JourneyActionsMenuProps {
  actions: JourneyActionItem[];
  label?: string;
  variant?: 'icon' | 'button';
  align?: 'start' | 'end';
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function JourneyActionsMenu({
  actions,
  label = 'Journey actions',
  variant = 'icon',
  align = 'end',
  disabled = false,
  className,
  onOpenChange,
}: JourneyActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = 'journey-actions-menu';

  const visibleActions = actions.filter((action) => !action.hidden);

  const changeOpen = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        changeOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        changeOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, changeOpen]);

  const handleAction = useCallback(
    (action: JourneyActionItem) => {
      if (action.disabled) return;

      changeOpen(false);
      action.onSelect();
    },
    [changeOpen],
  );

  if (visibleActions.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={cn('relative inline-flex', className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        disabled={disabled}
        onClick={() => changeOpen(!open)}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'icon'
            ? 'h-10 w-10'
            : 'min-h-10 px-3 py-2',
        )}
      >
        {variant === 'icon' ? (
          <Ellipsis className="h-5 w-5" aria-hidden="true" />
        ) : (
          <>
            <span>{label}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute top-full z-50 mt-2 min-w-60 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-1 shadow-xl',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {visibleActions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              onClick={() => handleAction(action)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50',
                action.destructive && 'text-[var(--danger)]',
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {action.label}
                </span>

                {action.description ? (
                  <span className="mt-0.5 block text-xs leading-5 text-[var(--foreground-secondary)]">
                    {action.description}
                  </span>
                ) : null}
              </span>

              {action.destructive ? (
                <CircleAlert
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default JourneyActionsMenu;
