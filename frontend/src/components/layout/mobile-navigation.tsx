// -----------------------------------------------------------------------------
// sisiMove — Mobile Navigation
// -----------------------------------------------------------------------------
//
// Primary public navigation for compact/mobile layouts.
//
// Responsibilities:
// - Render public navigation links on small screens.
// - Highlight the active route.
// - Reuse the shared NavigationLink primitive.
// - Remain independent of feature/domain implementations.
//
// Architectural boundary:
//
// - Presentation only.
// - No authentication or business logic.
// - No API calls.
// - No feature/domain dependencies.
// - Does not own navigation destinations outside this public navigation list.
//
// Active-route detection is intentionally kept here rather than inside
// NavigationLink. NavigationLink remains a reusable presentation primitive,
// while this component owns the router-specific pathname interpretation.
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
// Keep this list declarative.
//
// These are public site-navigation destinations, not authenticated application
// routes.
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
 * Determines whether a navigation item represents the current route.
 *
 * Root is treated specially because every pathname begins with `/`.
 *
 * For nested public routes, both the exact route and descendants are treated
 * as active:
 *
 *     /how-it-works
 *     /how-it-works/example
 *
 * This keeps active-state calculation local to the navigation layer and
 * prevents NavigationLink from becoming coupled to Next.js routing state.
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
// Mobile Navigation
// =============================================================================

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className={[
        'flex',
        'min-w-0',
        'items-center',
        'gap-1',
        'md:hidden',
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
          className="shrink-0"
        >
          {item.label}
        </NavigationLink>
      ))}
    </nav>
  );
}