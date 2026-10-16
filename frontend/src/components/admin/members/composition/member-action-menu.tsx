
'use client';

import { useState, type ReactNode } from 'react';

export interface MemberActionMenuItem {
  /** Stable identifier for this action. */
  readonly id: string;

  /** Visible action label. */
  readonly label: string;

  /** Action handler supplied by the parent. */
  readonly onSelect: () => void;

  /** Optional leading icon or visual element. */
  readonly icon?: ReactNode;

  /** Whether the action should be visually marked as destructive. */
  readonly destructive?: boolean;

  /** Whether the action is unavailable. */
  readonly disabled?: boolean;
}

export interface MemberActionMenuProps {
  /** Actions prepared by the parent for this member. */
  readonly actions: readonly MemberActionMenuItem[];

  /** Optional accessible label for the trigger. */
  readonly label?: string;

  /** Optional additional CSS classes. */
  readonly className?: string;
}

export function MemberActionMenu({
  actions,
  label = 'Member actions',
  className,
}: MemberActionMenuProps): ReactNode {
  const [open, setOpen] = useState(false);

  if (actions.length === 0) {
    return null;
  }

  function handleSelect(action: MemberActionMenuItem): void {
    if (action.disabled) {
      return;
    }

    setOpen(false);
    action.onSelect();
  }

  return (
    <div
      className={[
        'relative inline-flex',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          'inline-flex h-9 w-9 items-center justify-center',
          'rounded-[var(--radius-md)] text-[var(--foreground-secondary)]',
          'transition-colors hover:bg-[var(--background-muted)]',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]/30',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <circle cx="5" cy="12" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="19" cy="12" r="1.75" />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close member actions"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            aria-label={label}
            className={[
              'absolute right-0 top-full z-20 mt-2 min-w-48',
              'rounded-[var(--radius-lg)] border border-[var(--border)]',
              'bg-[var(--surface)] p-1 shadow-lg',
            ].join(' ')}
          >
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                role="menuitem"
                disabled={action.disabled}
                onClick={() => handleSelect(action)}
                className={[
                  'flex w-full items-center gap-3 rounded-[var(--radius-md)]',
                  'px-3 py-2 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]/30',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  action.destructive
                    ? 'text-[var(--danger)] hover:bg-[var(--danger-soft)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--background-muted)]',
                ].join(' ')}
              >
                {action.icon ? (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                    {action.icon}
                  </span>
                ) : null}

                <span className="min-w-0 flex-1">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default MemberActionMenu;
