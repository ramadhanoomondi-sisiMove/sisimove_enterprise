
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Metric Card
 * -----------------------------------------------------------------------------
 *
 * Reusable metric card for the Admin Overview dashboard.
 *
 * Responsibilities:
 *
 * - display a metric title and value;
 * - optionally display an icon, supporting text, and status badge;
 * - support an optional trend or contextual indicator when real data exists;
 * - provide consistent responsive styling using sisiMove design tokens;
 * - optionally support a click action supplied by the parent.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch data.
 * - It does not calculate metric values.
 * - It does not invent trends or compare historical values.
 * - The parent owns navigation and metric data.
 *
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { Badge, Card } from '@/components/ui';


// =============================================================================
// Types
// =============================================================================

export interface OverviewMetricCardProps {
  /**
   * Stable identifier for the metric.
   */
  id?: string;

  /**
   * Metric heading.
   */
  title: string;

  /**
   * Metric value, such as a count or formatted amount.
   */
  value: ReactNode;

  /**
   * Optional icon displayed in the card header.
   */
  icon?: ReactNode;

  /**
   * Optional supporting explanation.
   */
  description?: string;

  /**
   * Optional contextual status badge.
   */
  badge?: {
    label: string;
    variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline';
  };

  /**
   * Optional secondary information displayed beneath the value.
   */
  supportingText?: string;

  /**
   * Optional click handler.
   *
   * When supplied, the card becomes a keyboard-accessible button.
   */
  onClick?: () => void;

  /**
   * Optional accessible description for interactive cards.
   */
  ariaLabel?: string;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// =============================================================================
// Component
// =============================================================================

export default function OverviewMetricCard({
  id,
  title,
  value,
  icon,
  description,
  badge,
  supportingText,
  onClick,
  ariaLabel,
  className,
}: OverviewMetricCardProps) {
  const content = (
    <Card
      variant="default"
      padding="md"
      className={[
        'h-full',
        'min-w-0',
        'rounded-[var(--radius-xl)]',
        'shadow-[var(--shadow-sm)]',
        'transition-all',
        'duration-150',
        onClick
          ? 'hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]'
          : '',
        className ?? '',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Metric Header                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium leading-5 text-[var(--foreground-secondary)]">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <span
            aria-hidden="true"
            className={[
              'flex',
              'h-10',
              'w-10',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-lg)]',
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
            ].join(' ')}
          >
            {icon}
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Metric Value                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 min-w-0">
        <p className="break-words text-3xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
          {value}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Supporting Information                                              */}
      {/* ------------------------------------------------------------------- */}

      {(badge || supportingText) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {badge && (
            <Badge
              variant={badge.variant ?? 'default'}
              size="sm"
            >
              {badge.label}
            </Badge>
          )}

          {supportingText && (
            <span className="text-xs leading-5 text-[var(--foreground-muted)]">
              {supportingText}
            </span>
          )}
        </div>
      )}
    </Card>
  );

  if (onClick) {
    return (
      <button
        id={id}
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? `View ${title}`}
        className={[
          'block',
          'h-full',
          'w-full',
          'rounded-[var(--radius-xl)]',
          'text-left',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--brand)]',
          'focus-visible:ring-offset-2',
        ].join(' ')}
      >
        {content}
      </button>
    );
  }

  return (
    <div id={id} className="h-full">
      {content}
    </div>
  );
}
