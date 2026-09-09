// -----------------------------------------------------------------------------
// sisiMove — Desktop Navigation
// -----------------------------------------------------------------------------
//
// Desktop navigation for the sisiMove application shell.
//
// Responsibilities:
// - Render primary public navigation
// - Provide consistent desktop spacing and alignment
// - Support active navigation state
// - Remain presentation-focused
//
// Architectural boundary:
// - Presentation only
// - No authentication or business logic
// - No API calls
// - No feature/domain dependencies
//
// -----------------------------------------------------------------------------

'use client';

import {
  usePathname,
} from 'next/navigation';

import {
  NavigationLink,
} from './navigation-link';

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
// Desktop Navigation
// -----------------------------------------------------------------------------

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-1 md:flex"
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