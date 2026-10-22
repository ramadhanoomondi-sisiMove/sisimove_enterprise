
/**
 * sisiMove — Trust Workspace Navigation
 *
 * Navigation for the Trust administration workspace.
 *
 * Responsibilities:
 * - Provide navigation between Trust administration sections.
 * - Indicate the currently active section.
 * - Support responsive horizontal scrolling on smaller screens.
 * - Use canonical administrative route definitions.
 *
 * Non-responsibilities:
 * - Enforcing permissions.
 * - Fetching Trust data.
 * - Defining application-wide admin navigation.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustWorkspaceNavigationItem {
  /** Visible navigation label. */
  label: string;

  /** Destination route. */
  href: string;

  /** Optional accessible description. */
  description?: string;

  /** Match only the exact route when true. */
  exact?: boolean;

  /** Hide when unavailable to the consuming page. */
  hidden?: boolean;
}

export interface TrustWorkspaceNavigationProps {
  /** Custom navigation items; defaults to the standard Trust workspace routes. */
  items?: TrustWorkspaceNavigationItem[];

  /** Label for the navigation landmark. */
  ariaLabel?: string;

  /** Additional classes for the navigation root. */
  className?: string;
}

// -----------------------------------------------------------------------------
// Default Items
// -----------------------------------------------------------------------------

const DEFAULT_ITEMS: TrustWorkspaceNavigationItem[] = [
  {
    label: 'Overview',
    href: ADMIN_ROUTES.TRUST,
    exact: true,
    description: 'Trust control center overview',
  },
  {
    label: 'Profiles',
    href: ADMIN_ROUTES.TRUST_PROFILES,
    description: 'Browse and manage Trust profiles',
  },
  {
    label: 'Moderation',
    href: ADMIN_ROUTES.TRUST_RATINGS,
    description: 'Review and moderate ratings',
  },
  {
    label: 'Reviews',
    href: ADMIN_ROUTES.TRUST_REVIEWS,
    description: 'Review and moderate member reviews',
  },
  {
    label: 'Badges',
    href: ADMIN_ROUTES.TRUST_BADGES,
    description: 'Manage Trust badge definitions',
  },
];

// -----------------------------------------------------------------------------
// Active Route
// -----------------------------------------------------------------------------

function isNavigationItemActive(
  pathname: string,
  item: TrustWorkspaceNavigationItem,
): boolean {
  const normalizedHref =
    item.href.length > 1
      ? item.href.replace(/\/+$/, '')
      : item.href;

  if (item.exact) {
    return pathname === normalizedHref;
  }

  return (
    pathname === normalizedHref ||
    pathname.startsWith(`${normalizedHref}/`)
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustWorkspaceNavigation({
  items = DEFAULT_ITEMS,
  ariaLabel = 'Trust workspace navigation',
  className,
}: TrustWorkspaceNavigationProps) {
  const pathname = usePathname();

  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'w-full min-w-0',
        'border-b border-[var(--border)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex min-w-0 items-center gap-1',
          'overflow-x-auto overscroll-x-contain',
          'scrollbar-none',
        )}
      >
        {visibleItems.map((item) => {
          const active = isNavigationItemActive(pathname, item);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={item.description}
              className={cn(
                'relative inline-flex min-h-11 shrink-0',
                'items-center justify-center',
                'whitespace-nowrap px-3 py-2',
                'text-sm font-medium',
                'transition-colors duration-150',
                'focus-visible:outline-2',
                'focus-visible:outline-[var(--brand)]',
                'focus-visible:outline-offset-[-2px]',
                active
                  ? 'text-[var(--brand)]'
                  : [
                      'text-[var(--foreground-secondary)]',
                      'hover:text-[var(--foreground)]',
                    ].join(' '),
              )}
            >
              <span>{item.label}</span>

              {active && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3 bottom-0 h-0.5',
                    'rounded-t-full bg-[var(--brand)]',
                  )}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default TrustWorkspaceNavigation;
