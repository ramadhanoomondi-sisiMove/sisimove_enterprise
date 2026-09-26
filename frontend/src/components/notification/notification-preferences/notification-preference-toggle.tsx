// -----------------------------------------------------------------------------
// sisiMove — Notification Preference Toggle
// -----------------------------------------------------------------------------
//
// Reusable presentation row for an individual notification preference.
//
// Responsibilities:
// - display preference label;
// - display optional supporting description;
// - expose an accessible toggle control;
// - communicate state changes to the parent.
//
// Non-responsibilities:
// - persistence;
// - HTTP;
// - notification policy;
// - authentication;
// - query or mutation management.
//
// -----------------------------------------------------------------------------

'use client';

import type {
  ChangeEvent,
} from 'react';

import { cn } from '@/foundation/utils';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationPreferenceToggleProps {
  /**
   * Human-readable preference label.
   */
  label: string;

  /**
   * Optional explanation of what enabling the preference does.
   */
  description?: string;

  /**
   * Current persisted preference state.
   */
  checked: boolean;

  /**
   * Prevents interaction while an update is in progress.
   */
  disabled?: boolean;

  /**
   * Called after the user changes the toggle.
   */
  onCheckedChange: (
    checked: boolean,
  ) => void;
}

// -----------------------------------------------------------------------------
// Toggle
// -----------------------------------------------------------------------------

export function NotificationPreferenceToggle({
  label,
  description,
  checked,
  disabled = false,
  onCheckedChange,
}: NotificationPreferenceToggleProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onCheckedChange(event.target.checked);
  };

  return (
    <label
      className={cn(
        'flex',
        'min-h-16',
        'items-center',
        'justify-between',
        'gap-4',
        'px-4',
        'py-3.5',
        'sm:px-5',
        'transition-colors',
        'duration-150',
        'ease-out',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:bg-[var(--background-subtle)]',
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-sm leading-5 text-[var(--foreground-muted)]">
            {description}
          </span>
        )}
      </span>

      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
        />

        <span
          aria-hidden="true"
          className={cn(
            'relative',
            'h-6',
            'w-11',
            'shrink-0',
            'rounded-full',
            'border',
            'transition-colors',
            'duration-150',
            'ease-out',
            'peer-focus-visible:outline-2',
            'peer-focus-visible:outline-[var(--brand)]',
            'peer-focus-visible:outline-offset-2',

            checked
              ? [
                  'border-[var(--brand)]',
                  'bg-[var(--brand)]',
                ].join(' ')
              : [
                  'border-[var(--border-strong)]',
                  'bg-[var(--background-muted)]',
                ].join(' '),
          )}
        >
          <span
            className={cn(
              'absolute',
              'top-0.5',
              'h-5',
              'w-5',
              'rounded-full',
              'bg-white',
              'shadow-[var(--shadow-sm)]',
              'transition-transform',
              'duration-150',
              'ease-out',
              checked
                ? 'translate-x-5'
                : 'translate-x-0.5',
            )}
          />
        </span>

        <span className="sr-only">
          {checked ? 'Enabled' : 'Disabled'}
        </span>
      </span>
    </label>
  );
}