// -----------------------------------------------------------------------------
// sisiMove — Navigation Link
// -----------------------------------------------------------------------------
//
// Reusable navigation-link primitive for the sisiMove application shell.
//
// Responsibilities:
// - Render consistent navigation links
// - Support active/inactive states
// - Support optional leading content
// - Preserve native Next.js navigation behavior
//
// Architectural boundary:
// - Presentation only
// - Domain-agnostic
// - No authentication or business logic
// - No API calls
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

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NavigationLinkProps
  extends LinkProps {
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
   */
  active?: boolean;

  /**
   * Optional content rendered before the navigation label.
   */
  leadingContent?: ReactNode;

  /**
   * Additional classes.
   */
  className?: string;

  /**
   * Optional click handler.
   */
  onClick?: () => void;
}

// -----------------------------------------------------------------------------
// Navigation Link
// -----------------------------------------------------------------------------

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
        'inline-flex',
        'min-h-9',
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
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]/30',

        active
          ? [
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
            ].join(' ')
          : [
              'text-[var(--foreground-secondary)]',
              'hover:bg-[var(--background-muted)]',
              'hover:text-[var(--foreground)]',
            ].join(' '),

        hasLeadingContent && 'pl-2.5',
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

      <span>{children}</span>
    </Link>
  );
}