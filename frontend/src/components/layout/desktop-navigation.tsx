// -----------------------------------------------------------------------------
// sisiMove — Desktop Navigation
// -----------------------------------------------------------------------------
//
// Desktop navigation for the sisiMove public site shell.
//
// Responsibilities:
// - Render primary public navigation.
// - Provide consistent desktop spacing and alignment.
// - Highlight the active route.
// - Reuse the shared NavigationLink primitive.
//
// Architectural boundary:
//
// - Presentation only.
// - No authentication or business logic.
// - No API calls.
// - No feature/domain dependencies.
//
// Active-route detection belongs to this navigation component because it
// requires Next.js router state. NavigationLink remains router-state agnostic
// apart from receiving the presentation-level `active` value.
//
// -----------------------------------------------------------------------------

'use client';

import { usePathname } from 'next/navigation';

import { NavigationLink } from './navigation-link';


// =============================================================================
// Types
// =============================================================================

interface NavigationItem {
  readonly href: string;
  readonly label: string;
}


// =============================================================================
// Navigation Items
// =============================================================================
//
// Keep public navigation declarative.
//
// These destinations belong to the public site shell. Authenticated
// application navigation should be introduced separately rather than making
// this component aware of account/application state.
//
// -----------------------------------------------------------------------------

const navigationItems: readonly NavigationItem[] = [
  {
    href: '/',
    label: 'Explore',
  },
  {
    href: '/how-it-works',
    label: 'How it works',
  },
];


// =============================================================================
// Helpers
// =============================================================================

/**
 * Determines whether a public navigation item represents the current route.
 *
 * The root route is handled separately because every pathname starts with
 * `/`.
 *
 * Nested routes are considered active for both their exact path and their
 * descendants:
 *
 *     /how-it-works
 *     /how-it-works/example
 *
 * This keeps route interpretation inside the navigation layer rather than
 * coupling the reusable NavigationLink primitive to pathname state.
 */
function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}


// =============================================================================
// Desktop Navigation
// =============================================================================

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className={[
        'hidden',
        'min-w-0',
        'items-center',
        'gap-1',
        'md:flex',
      ].join(' ')}
    >
      {navigationItems.map((item) => (
        <NavigationLink
          key={item.href}
          href={item.href}
          active={isNavigationItemActive(
            pathname,
            item.href,
          )}
        >
          {item.label}
        </NavigationLink>
      ))}
    </nav>
  );
}