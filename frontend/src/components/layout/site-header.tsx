// -----------------------------------------------------------------------------
// sisiMove — Site Header
// -----------------------------------------------------------------------------
//
// Public site header.
//
// Responsibilities:
// - Render the sisiMove brand.
// - Compose desktop and mobile navigation.
// - Provide authentication entry points.
// - Remain independent of authentication implementation details.
//
// Architectural boundary:
//
// - Sibling components are imported directly.
// - This component must not import from './index'.
// - The layout barrel is intended for consumers outside this module.
// - Direct sibling imports prevent a circular dependency through the barrel.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { Container } from '../ui';

import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation } from './mobile-navigation';

// -----------------------------------------------------------------------------
// Site Header
// -----------------------------------------------------------------------------

export function SiteHeader() {
  return (
    <header
      className={[
        'sticky',
        'top-0',
        'z-40',
        'border-b',
        'border-[var(--border)]',
        'bg-[var(--surface)]/95',
        'backdrop-blur',
      ].join(' ')}
    >
      <Container
        size="xl"
        className={[
          'flex',
          'min-h-16',
          'items-center',
          'justify-between',
          'gap-4',
        ].join(' ')}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Brand                                                             */}
        {/* ----------------------------------------------------------------- */}

        <Link
          href="/"
          aria-label="sisiMove home"
          className={[
            'shrink-0',
            'rounded-[var(--radius-sm)]',
            'text-2xl',
            'font-bold',
            'tracking-tight',
            'text-[var(--foreground)]',
            'outline-none',
            'transition-colors',
            'duration-150',
            'ease-out',
            'hover:text-[var(--brand)]',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]/30',
            'focus-visible:ring-offset-2',
          ].join(' ')}
        >
          sisi<span className="text-[var(--brand)]">Move</span>
        </Link>

        {/* ----------------------------------------------------------------- */}
        {/* Desktop Navigation                                                */}
        {/* ----------------------------------------------------------------- */}

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <DesktopNavigation />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Desktop Actions                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div className="hidden shrink-0 items-center gap-1.5 md:flex">
          {/* ---------------------------------------------------------------- */}
          {/* Log In                                                           */}
          {/* ---------------------------------------------------------------- */}

          <Link
            href="/login"
            className={[
              'inline-flex',
              'min-h-10',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'px-3',
              'text-sm',
              'font-medium',
              'leading-5',
              'text-[var(--foreground-secondary)]',
              'outline-none',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:bg-[var(--background-muted)]',
              'hover:text-[var(--foreground)]',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Log in
          </Link>

          {/* ---------------------------------------------------------------- */}
          {/* Join sisiMove                                                    */}
          {/* ---------------------------------------------------------------- */}

          <Link
            href="/register"
            className={[
              'inline-flex',
              'min-h-10',
              'shrink-0',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'border',
              'border-transparent',
              'bg-[var(--brand)]',
              'px-4',
              'text-sm',
              'font-semibold',
              'leading-5',
              '!text-white',
              'whitespace-nowrap',
              'select-none',
              'shadow-[var(--shadow-sm)]',
              'outline-none',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:bg-[var(--brand-hover)]',
              'hover:shadow-[var(--shadow-md)]',
              'active:bg-[var(--brand-hover)]',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Join sisiMove
          </Link>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Mobile Navigation                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <MobileNavigation />

          <Link
            href="/login"
            className={[
              'shrink-0',
              'rounded-[var(--radius-sm)]',
              'text-sm',
              'font-medium',
              'leading-5',
              'text-[var(--foreground-secondary)]',
              'outline-none',
              'transition-colors',
              'duration-150',
              'ease-out',
              'hover:text-[var(--foreground)]',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Log in
          </Link>
        </div>
      </Container>
    </header>
  );
}