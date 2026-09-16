// -----------------------------------------------------------------------------
// sisiMove — Navigation Link
// -----------------------------------------------------------------------------
//
// Reusable navigation-link primitive for the sisiMove application shell.
//
// Responsibilities:
// - Render consistent navigation links.
// - Support active/inactive visual states.
// - Support optional leading content.
// - Preserve native Next.js navigation behavior.
//
// Architectural boundary:
//
// - Presentation only.
// - Domain-agnostic.
// - No authentication or business logic.
// - No API calls.
// - Does not determine the current route.
// - The parent navigation component owns active-state calculation.
//
// -----------------------------------------------------------------------------
//
// ACCESSIBILITY
//
// `active` represents an actual current navigation destination, so the active
// state is exposed through `aria-current="page"`.
//
// `leadingContent` is decorative from the link's accessible-name perspective;
// the visible navigation label remains the accessible name.
//
// -----------------------------------------------------------------------------

'use client';

import Link, {
  type LinkProps,
} from 'next/link';

import type {
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';


// =============================================================================
// Types
// =============================================================================

export interface NavigationLinkProps extends LinkProps {
  /**
   * Link destination.
   */
  href: LinkProps['href'];

  /**
   * Visible navigation label.
   */
  children: ReactNode;

  /**
   * Whether this navigation item represents the current route.
   *
   * Active-state calculation belongs to the parent navigation component.
   */
  active?: boolean;

  /**
   * Optional content rendered before the navigation label.
   *
   * Intended primarily for icons or other compact visual indicators.
   */
  leadingContent?: ReactNode;

  /**
   * Additional classes supplied by the consumer.
   */
  className?: string;

  /**
   * Optional click handler.
   *
   * This does not replace Next.js navigation behavior.
   */
  onClick?: () => void;
}


// =============================================================================
// Navigation Link
// =============================================================================

export function NavigationLink({
  href,
  children,
  active = false,
  leadingContent,
  className,
  onClick,
  ...props
}: NavigationLinkProps) {
  const hasLeadingContent = Boolean(leadingContent);

  return (
    <Link
      {...props}
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        // ---------------------------------------------------------------------
        // Base
        // ---------------------------------------------------------------------

        'inline-flex',
        'min-h-9',
        'min-w-0',
        'shrink-0',
        'items-center',
        'gap-2',
        'rounded-[var(--radius-md)]',
        'px-3',
        'text-sm',
        'font-medium',
        'leading-5',
        'outline-none',
        'transition-colors',
        'duration-150',
        'ease-out',

        // ---------------------------------------------------------------------
        // Keyboard focus
        // ---------------------------------------------------------------------

        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background)]',

        // ---------------------------------------------------------------------
        // Active / inactive state
        // ---------------------------------------------------------------------

        active
          ? [
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
            ].join(' ')
          : [
              'text-[var(--foreground-secondary)]',
              'hover:bg-[var(--background-subtle)]',
              'hover:text-[var(--foreground)]',
              'active:bg-[var(--background-muted)]',
            ].join(' '),

        // ---------------------------------------------------------------------
        // Leading content
        // ---------------------------------------------------------------------

        hasLeadingContent && 'pl-2.5',

        // ---------------------------------------------------------------------
        // Consumer overrides
        // ---------------------------------------------------------------------

        className,
      )}
    >
      {leadingContent && (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex',
            'shrink-0',
            'items-center',
            active
              ? 'text-[var(--brand)]'
              : 'text-[var(--foreground-muted)]',
          )}
        >
          {leadingContent}
        </span>
      )}

      <span className="min-w-0 truncate">
        {children}
      </span>
    </Link>
  );
}