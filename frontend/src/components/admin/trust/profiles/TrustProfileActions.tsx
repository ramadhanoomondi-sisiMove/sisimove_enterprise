
/**
 * sisiMove — Trust Profile Actions
 *
 * Configurable action toolbar for an individual Trust profile.
 *
 * Responsibilities:
 * - Present profile-level administrative actions.
 * - Support primary, secondary, outline, and destructive actions.
 * - Indicate pending operations and prevent repeated clicks.
 * - Allow the parent workspace to control action availability.
 *
 * Non-responsibilities:
 * - Fetching profile data.
 * - Enforcing permissions.
 * - Executing Trust mutations.
 * - Deciding when confirmation is required.
 */

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustProfileActionVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

export interface TrustProfileAction {
  /**
   * Stable action identifier.
   */
  id: string;

  /**
   * Visible action label.
   */
  label: string;

  /**
   * Callback supplied by the consuming workspace.
   */
  onClick: () => void;

  /**
   * Visual treatment.
   */
  variant?: TrustProfileActionVariant;

  /**
   * Optional visual content displayed before the label.
   */
  leadingContent?: ReactNode;

  /**
   * Accessible label override, useful for icon-led actions.
   */
  ariaLabel?: string;

  /**
   * Whether the action is unavailable.
   */
  disabled?: boolean;

  /**
   * Whether this specific action is in progress.
   */
  isPending?: boolean;

  /**
   * Alternative label while this action is pending.
   */
  pendingLabel?: string;
}

export interface TrustProfileActionsProps {
  /**
   * Actions explicitly provided by the parent.
   */
  actions: TrustProfileAction[];

  /**
   * Optional heading above the action toolbar.
   */
  title?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Whether every action should be disabled.
   */
  disabled?: boolean;

  /**
   * Additional classes for the toolbar root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const actionVariantClasses: Record<
  TrustProfileActionVariant,
  string
> = {
  primary: [
    'border border-transparent',
    'bg-[var(--brand)] text-[var(--brand-foreground)]',
    'hover:bg-[var(--brand-hover)]',
    'focus-visible:outline-[var(--brand)]',
  ].join(' '),

  secondary: [
    'border border-transparent',
    'bg-[var(--background-muted)] text-[var(--foreground)]',
    'hover:bg-[var(--background-subtle)]',
    'focus-visible:outline-[var(--brand)]',
  ].join(' '),

  outline: [
    'border border-[var(--border)]',
    'bg-[var(--surface)] text-[var(--foreground)]',
    'hover:border-[var(--border-strong)]',
    'hover:bg-[var(--background-muted)]',
    'focus-visible:outline-[var(--brand)]',
  ].join(' '),

  ghost: [
    'border border-transparent',
    'bg-transparent text-[var(--foreground-secondary)]',
    'hover:bg-[var(--background-muted)]',
    'hover:text-[var(--foreground)]',
    'focus-visible:outline-[var(--brand)]',
  ].join(' '),

  danger: [
    'border border-[var(--danger)]',
    'bg-[var(--danger)] text-white',
    'hover:opacity-90',
    'focus-visible:outline-[var(--danger)]',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Action Button
// -----------------------------------------------------------------------------

function TrustProfileActionButton({
  action,
  disabled,
}: {
  action: TrustProfileAction;
  disabled: boolean;
}) {
  const variant = action.variant ?? 'outline';
  const isDisabled = disabled || Boolean(action.disabled) ||
    Boolean(action.isPending);

  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={isDisabled}
      aria-label={action.ariaLabel}
      aria-busy={action.isPending || undefined}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2',
        'rounded-[var(--radius-md)] px-4',
        'text-sm font-medium transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        actionVariantClasses[variant],
      )}
    >
      {action.isPending ? (
        <span
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 animate-spin rounded-full',
            'border-2 border-current border-r-transparent',
          )}
        />
      ) : action.leadingContent ? (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center"
        >
          {action.leadingContent}
        </span>
      ) : null}

      <span>
        {action.isPending
          ? action.pendingLabel ?? 'Processing…'
          : action.label}
      </span>
    </button>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustProfileActions({
  actions,
  title,
  description,
  disabled = false,
  className,
}: TrustProfileActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={title ?? 'Trust profile actions'}
      className={cn('w-full min-w-0', className)}
    >
      {(title || description) && (
        <header className="mb-3">
          {title && (
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              {description}
            </p>
          )}
        </header>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <TrustProfileActionButton
            key={action.id}
            action={action}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}

export default TrustProfileActions;
