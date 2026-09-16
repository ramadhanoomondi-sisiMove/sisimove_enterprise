// -----------------------------------------------------------------------------
// sisiMove — Site Header
// -----------------------------------------------------------------------------
//
// Public site header.
//
// Responsibilities:
// - Render the sisiMove brand.
// - Compose desktop and mobile navigation.
// - Provide public authentication entry points.
// - Remain independent of authentication implementation details.
//
// Architectural boundary:
//
// - SiteHeader is a public-shell composition component.
// - It does not access authentication state.
// - It does not perform authentication.
// - It does not call APIs.
// - It does not contain marketplace/domain logic.
//
// Import boundary:
//
// - Sibling layout components are imported directly.
// - Shared account-action primitives are imported from their shared boundary.
// - This component must not import from './index'.
// - The layout barrel is intended for consumers outside this module.
//
// Account actions:
//
// - SignIn owns the presentation of the sign-in action.
// - JoinSisiMove owns the presentation of the registration action.
// - SiteHeader only composes those actions.
//
// Authentication state, session handling, authorization, and registration
// behavior remain outside this component.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { cn } from '@/foundation';

import { Container } from '../ui';

import {
  JoinSisiMove,
  SignIn,
} from '../landing/shared/account-actions';

import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';

// =============================================================================
// Site Header
// =============================================================================

export function SiteHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'w-full min-w-0',
        'border-b border-[var(--border)]',
        'bg-[var(--surface)]/95',
        'backdrop-blur',
      )}
    >
      <Container
        size="xl"
        className={cn(
          'flex min-w-0',
          'min-h-14',
          'items-center',
          'justify-between',
          'gap-3',
          'sm:min-h-16 sm:gap-4',
        )}
      >
        {/* ===================================================================
            Brand
        =================================================================== */}

        <Link
          href="/"
          aria-label="sisiMove home"
          className={cn(
            'shrink-0',
            'rounded-[var(--radius-md)]',
            'text-xl font-bold tracking-tight',
            'text-[var(--foreground)]',
            'outline-none',
            'transition-colors duration-150 ease-out',
            'hover:text-[var(--brand)]',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[var(--surface)]',
            'sm:text-2xl',
          )}
        >
          sisi
          <span className="text-[var(--brand)]">Move</span>
        </Link>

        {/* ===================================================================
            Desktop Navigation
        =================================================================== */}

        <div
          className={cn(
            'hidden min-w-0 flex-1',
            'justify-center',
            'md:flex',
          )}
        >
          <DesktopNavigation />
        </div>

        {/* ===================================================================
            Desktop Account Actions
        =================================================================== */}

        <div
          className={cn(
            'hidden shrink-0',
            'items-center gap-1.5',
            'md:flex',
          )}
        >
          <SignIn compact />

          <JoinSisiMove compact />
        </div>

        {/* ===================================================================
            Mobile Navigation
        =================================================================== */}

        <div
          className={cn(
            'flex min-w-0 shrink-0',
            'items-center gap-1.5',
            'md:hidden',
          )}
        >
          <MobileNavigation />

          <SignIn compact />
        </div>
      </Container>
    </header>
  );
}