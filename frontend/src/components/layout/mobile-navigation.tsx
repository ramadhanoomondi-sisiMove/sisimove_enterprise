// -----------------------------------------------------------------------------
// sisiMove — Mobile Navigation
// -----------------------------------------------------------------------------
//
// Primary navigation for compact/mobile layouts.
//
// Responsibilities:
// - Render public navigation links on small screens
// - Highlight the active route
// - Remain presentation-only
// - Reuse the shared NavigationLink primitive
//
// Architectural boundary:
// - Presentation only
// - No authentication or business logic
// - No API calls
// - No feature/domain dependencies
//
// -----------------------------------------------------------------------------

'use client';

import { usePathname } from 'next/navigation';

import { NavigationLink } from './navigation-link';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NavigationItem {
  href: string;
  label: string;
}

// -----------------------------------------------------------------------------
// Navigation Items
// -----------------------------------------------------------------------------

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'Explore',
  },
  {
    href: '/how-it-works',
    label: 'How it works',
  },
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Mobile Navigation
// -----------------------------------------------------------------------------

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="flex items-center gap-1 md:hidden"
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