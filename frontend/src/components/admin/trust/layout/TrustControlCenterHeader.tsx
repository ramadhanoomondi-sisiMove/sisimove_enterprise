
/**
 * sisiMove — Trust Control Center Header
 *
 * Reusable page header for the Trust administration control center.
 *
 * Responsibilities:
 * - Establish the page title and supporting context.
 * - Optionally display an eyebrow label and contextual badge.
 * - Support primary and secondary page-level actions.
 * - Adapt to narrow screens without compromising readability.
 *
 * Non-responsibilities:
 * - Fetching Trust metrics or profile data.
 * - Enforcing permissions.
 * - Managing navigation or mutations.
 */

import type { ReactNode } from 'react';

import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustControlCenterHeaderAction {
  /**
   * Visible action label.
   */
  label: string;

  /**
   * Callback invoked when the action is selected.
   */
  onClick: () => void;

  /**
   * Optional icon or visual content before the label.
   */
  leadingContent?: ReactNode;

  /**
   * Visual treatment for the action.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';

  /**
   * Disable the action while unavailable or pending.
   */
  disabled?: boolean;

  /**
   * Accessible description for an icon-led action, if needed.
   */
  ariaLabel?: string;
}

export interface TrustControlCenterHeaderProps {
  /**
   * Main page heading.
   */
  title?: string;

  /**
   * Supporting page description.
   */
  description?: string;

  /**
   * Small contextual label above the heading.
   */
  eyebrow?: string;

  /**
   * Optional contextual badge.
   */
  badgeLabel?: string;

  /**
   * Badge appearance from the shared design system.
   */
  badgeVariant?: BadgeVariant;

  /**
   * Optional actions aligned with the page heading.
   */
  actions?: TrustControlCenterHeaderAction[];

  /**
   * Optional supplementary content below the heading.
   */
  children?: ReactNode;

  /**
   * Additional classes for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Action styles
// -----------------------------------------------------------------------------

const actionVariantClasses: Record<
  NonNullable<TrustControlCenterHeaderAction['variant']>,
  string
> = {
  primary: [
    'border border-transparent',
    'bg-[var(--brand)] text-[var(--brand-foreground)]',
    'hover:bg-[var(--brand-hover)]',
  ].join(' '),

  secondary: [
    'border border-transparent',
    'bg-[var(--background-muted)] text-[var(--foreground)]',
    'hover:bg-[var(--background-subtle)]',
  ].join(' '),

  outline: [
    'border border-[var(--border)]',
    'bg-[var(--surface)] text-[var(--foreground)]',
    'hover:border-[var(--border-strong)]',
    'hover:bg-[var(--background-muted)]',
  ].join(' '),

  ghost: [
    'border border-transparent',
    'bg-transparent text-[var(--foreground-secondary)]',
    'hover:bg-[var(--background-muted)]',
    'hover:text-[var(--foreground)]',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustControlCenterHeader({
  title = 'Trust Control Center',
  description = 'Monitor trust profiles, verification, ratings, reviews, and badge activity.',
  eyebrow = 'ADMINISTRATION',
  badgeLabel,
  badgeVariant = 'outline',
  actions = [],
  children,
  className,
}: TrustControlCenterHeaderProps) {
  return (
    <header
      className={cn(
        'w-full',
        'border-b border-[var(--border-subtle)]',
        'pb-6',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-5',
          'lg:flex-row lg:items-start lg:justify-between',
        )}
      >
        <div className="min-w-0 flex-1">
          {(eyebrow || badgeLabel) && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {eyebrow && (
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                  {eyebrow}
                </span>
              )}

              {badgeLabel && (
                <Badge variant={badgeVariant} size="sm">
                  {badgeLabel}
                </Badge>
              )}
            </div>
          )}

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              {description}
            </p>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions.map((action, index) => {
              const variant = action.variant ?? 'outline';

              return (
                <button
                  key={`${action.label}-${index}`}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  aria-label={action.ariaLabel}
                  className={cn(
                    'inline-flex min-h-10 items-center justify-center gap-2',
                    'rounded-[var(--radius-md)] px-4',
                    'text-sm font-medium transition-colors duration-150',
                    'focus-visible:outline-2',
                    'focus-visible:outline-[var(--brand)]',
                    'focus-visible:outline-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    actionVariantClasses[variant],
                  )}
                >
                  {action.leadingContent && (
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 items-center"
                    >
                      {action.leadingContent}
                    </span>
                  )}

                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {children && (
        <div className="mt-5">
          {children}
        </div>
      )}
    </header>
  );
}

export default TrustControlCenterHeader;
