
/**
 * -----------------------------------------------------------------------------
 * sisiMove — Overview Section Header
 * -----------------------------------------------------------------------------
 *
 * Reusable section heading for the Admin Overview feature.
 *
 * Responsibilities:
 *
 * - establish a consistent visual hierarchy between dashboard sections;
 * - display a section title and optional description;
 * - support optional leading icon content;
 * - display optional contextual information or a status badge;
 * - support an optional action supplied by the parent.
 *
 * Architectural boundaries:
 *
 * - This component does not fetch data.
 * - It does not manage navigation.
 * - It does not prescribe icon libraries.
 * - The parent supplies optional icon, badge, and action content.
 *
 * -----------------------------------------------------------------------------
 */

import type { ReactNode } from 'react';

import { cn } from '@/foundation/utils/cn';


// =============================================================================
// Types
// =============================================================================

export interface OverviewSectionHeaderProps {
  /**
   * Main section heading.
   */
  title: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Optional icon or visual content displayed beside the heading.
   */
  icon?: ReactNode;

  /**
   * Optional contextual content, such as a Badge.
   */
  badge?: ReactNode;

  /**
   * Optional action, such as a Button or link.
   */
  action?: ReactNode;

  /**
   * Additional classes for the root element.
   */
  className?: string;

  /**
   * Heading level used for semantic document structure.
   */
  headingLevel?: 2 | 3 | 4;
}


// =============================================================================
// Component
// =============================================================================

export default function OverviewSectionHeader({
  title,
  description,
  icon,
  badge,
  action,
  className,
  headingLevel = 2,
}: OverviewSectionHeaderProps) {
  const headingClasses = cn(
    'min-w-0',
    'text-base',
    'font-semibold',
    'tracking-tight',
    'text-[var(--foreground)]',
    'sm:text-lg',
  );

  const heading = (() => {
    const content = (
      <>
        {title}
        {badge && (
          <span className="ml-2 inline-flex align-middle">
            {badge}
          </span>
        )}
      </>
    );

    switch (headingLevel) {
      case 3:
        return <h3 className={headingClasses}>{content}</h3>;

      case 4:
        return <h4 className={headingClasses}>{content}</h4>;

      default:
        return <h2 className={headingClasses}>{content}</h2>;
    }
  })();

  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'gap-3',
        'sm:flex-row',
        'sm:items-start',
        'sm:justify-between',
        'sm:gap-6',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <div
            aria-hidden="true"
            className={[
              'flex',
              'h-10',
              'w-10',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-lg)]',
              'border',
              'border-[var(--border)]',
              'bg-[var(--background-subtle)]',
              'text-[var(--foreground-secondary)]',
            ].join(' ')}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          {heading}

          {description && (
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          {action}
        </div>
      )}
    </div>
  );
}
