// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Header
// -----------------------------------------------------------------------------
//
// Presentation header for public traveller discovery.
//
// Responsibilities:
// - Present the section eyebrow.
// - Present the section title.
// - Present an optional description.
// - Present optional supporting/trailing content.
// - Present optional content below the heading area.
//
// This component does not:
// - fetch discovery data;
// - own discovery state;
// - filter travellers;
// - perform routing;
// - perform authentication;
// - contain business rules.
//
// The parent discovery section owns those responsibilities.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerDiscoveryHeaderProps {
  /**
   * Small section eyebrow.
   */
  readonly eyebrow?: ReactNode;

  /**
   * Main section heading.
   */
  readonly title?: ReactNode;

  /**
   * Supporting description.
   */
  readonly description?: ReactNode;

  /**
   * Optional content displayed alongside the heading.
   *
   * Examples:
   * - "View all" link
   * - Result summary
   * - Secondary action
   */
  readonly trailingContent?: ReactNode;

  /**
   * Optional content displayed below the heading area.
   *
   * Examples:
   * - Search summary
   * - Filter controls
   * - Discovery tabs
   */
  readonly bottomContent?: ReactNode;

  /**
   * ID applied to the heading element.
   *
   * The parent section can use this for aria-labelledby.
   */
  readonly headingId?: string;

  /**
   * Additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function hasContent(
  content: ReactNode,
): boolean {
  return (
    content !== null &&
    content !== undefined
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoveryHeader({
  eyebrow = 'PEOPLE TRAVELLING YOUR WAY',
  title =
    'Discover people sharing journeys and looking for one.',
  description,
  trailingContent,
  bottomContent,
  headingId,
  className,
}: TravellerDiscoveryHeaderProps) {
  const hasTrailingContent =
    hasContent(trailingContent);

  const hasBottomContent =
    hasContent(bottomContent);

  return (
    <div
      className={cn(
        'w-full',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading area                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'flex',
          'flex-col',
          'gap-5',
          'lg:flex-row',
          'lg:items-end',
          'lg:justify-between',
          hasTrailingContent &&
            'lg:gap-8',
        )}
      >
        <div
          className={cn(
            'min-w-0',
            'max-w-3xl',
          )}
        >
          {hasContent(eyebrow) && (
            <p
              className={cn(
                'text-xs',
                'font-semibold',
                'uppercase',
                'tracking-[0.12em]',
                'text-[var(--brand)]',
              )}
            >
              {eyebrow}
            </p>
          )}

          {hasContent(title) && (
            <h2
              id={headingId}
              className={cn(
                'mt-2',
                'text-2xl',
                'font-semibold',
                'tracking-tight',
                'text-[var(--foreground)]',
                'sm:text-3xl',
              )}
            >
              {title}
            </h2>
          )}

          {hasContent(description) && (
            <p
              className={cn(
                'mt-3',
                'max-w-2xl',
                'text-sm',
                'leading-6',
                'text-[var(--foreground-secondary)]',
                'sm:text-base',
              )}
            >
              {description}
            </p>
          )}
        </div>

        {hasTrailingContent && (
          <div
            className={cn(
              'flex',
              'shrink-0',
              'items-center',
              'gap-3',
            )}
          >
            {trailingContent}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Supporting content                                                  */}
      {/* ------------------------------------------------------------------- */}

      {hasBottomContent && (
        <div className="mt-6">
          {bottomContent}
        </div>
      )}
    </div>
  );
}