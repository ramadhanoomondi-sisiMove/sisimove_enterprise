// -----------------------------------------------------------------------------
// sisiMove — Site Footer
// -----------------------------------------------------------------------------
//
// Public site footer.
//
// Responsibilities:
// - Provide secondary public navigation.
// - Reinforce the sisiMove brand.
// - Provide basic legal/support entry points.
// - Remain independent of authenticated application state.
//
// Architectural boundary:
//
// - This component owns presentation and public navigation only.
// - It does not access authentication state.
// - It does not fetch data.
// - It does not perform account actions.
// - It does not contain marketplace/business logic.
//
// Account routes remain ordinary public links. Authentication behavior is
// owned by the authentication boundary.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  Compass,
  HelpCircle,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/foundation';

import { Container } from '../ui';

// =============================================================================
// Types
// =============================================================================

interface FooterLink {
  readonly href: string;
  readonly label: string;
}

interface FooterGroupProps {
  readonly title: string;
  readonly icon: LucideIcon;
  readonly links: readonly FooterLink[];
}

// =============================================================================
// Navigation
// =============================================================================
//
// Keep navigation declarative.
//
// The footer should not contain conditional routing or authentication logic.
// -----------------------------------------------------------------------------

const exploreLinks: readonly FooterLink[] = [
  {
    href: '/',
    label: 'Explore',
  },
  {
    href: '/how-it-works',
    label: 'How it works',
  },
];

const accountLinks: readonly FooterLink[] = [
  {
    href: '/login',
    label: 'Sign in',
  },
  {
    href: '/register',
    label: 'Join sisiMove',
  },
];

const supportLinks: readonly FooterLink[] = [
  {
    href: '/support',
    label: 'Support',
  },
  {
    href: '/terms',
    label: 'Terms',
  },
  {
    href: '/privacy',
    label: 'Privacy',
  },
];

// =============================================================================
// Footer Link List
// =============================================================================

function FooterLinkList({
  links,
}: {
  readonly links: readonly FooterLink[];
}) {
  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={cn(
              'inline-flex min-h-8 items-center',
              'rounded-[var(--radius-md)]',
              'text-sm leading-5',
              'text-[var(--foreground-muted)]',
              'transition-colors duration-150 ease-out',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'focus-visible:ring-offset-[var(--background-subtle)]',
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// =============================================================================
// Footer Group
// =============================================================================

function FooterGroup({
  title,
  icon: Icon,
  links,
}: FooterGroupProps) {
  return (
    <div className="min-w-0">
      <h2
        className={cn(
          'inline-flex items-center gap-2',
          'text-sm font-semibold',
          'text-[var(--foreground)]',
        )}
      >
        <Icon
          aria-hidden="true"
          className="h-3.5 w-3.5 text-[var(--brand)]"
        />

        <span>{title}</span>
      </h2>

      <div className="mt-2">
        <FooterLinkList links={links} />
      </div>
    </div>
  );
}

// =============================================================================
// Site Footer
// =============================================================================

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full min-w-0',
        'border-t border-[var(--border)]',
        'bg-[var(--background-subtle)]',
      )}
    >
      <Container size="xl">
        {/* ===================================================================
            Main footer
        =================================================================== */}

        <div
          className={cn(
            'grid min-w-0',
            'gap-7',
            'py-8',
            'sm:grid-cols-2',
            'sm:gap-x-10 sm:gap-y-8',
            'sm:py-9',
            'lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]',
            'lg:gap-12',
            'lg:py-10',
          )}
        >
          {/* ===============================================================
              Brand
          =============================================================== */}

          <div className="min-w-0 max-w-md">
            <Link
              href="/"
              aria-label="sisiMove home"
              className={cn(
                'inline-flex items-center',
                'rounded-[var(--radius-md)]',
                'text-xl font-bold tracking-tight',
                'text-[var(--foreground)]',
                'outline-none',
                'transition-colors duration-150 ease-out',
                'hover:text-[var(--brand)]',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-[var(--background-subtle)]',
              )}
            >
              sisi
              <span className="text-[var(--brand)]">Move</span>
            </Link>

            <p
              className={cn(
                'mt-2.5 max-w-md',
                'text-sm leading-6',
                'text-[var(--foreground-muted)]',
              )}
            >
              Kenya&apos;s long-distance travel network.
              Find people travelling your way and share the journey.
            </p>
          </div>

          {/* ===============================================================
              Explore
          =============================================================== */}

          <FooterGroup
            title="Explore"
            icon={Compass}
            links={exploreLinks}
          />

          {/* ===============================================================
              Account
          =============================================================== */}

          <FooterGroup
            title="Account"
            icon={UserRound}
            links={accountLinks}
          />

          {/* ===============================================================
              Support
          =============================================================== */}

          <FooterGroup
            title="Support"
            icon={HelpCircle}
            links={supportLinks}
          />
        </div>

        {/* ===================================================================
            Bottom bar
        =================================================================== */}

        <div
          className={cn(
            'flex min-w-0',
            'flex-col gap-1.5',
            'border-t border-[var(--border)]',
            'py-4',
            'text-xs leading-5',
            'text-[var(--foreground-subtle)]',
            'sm:flex-row sm:items-center sm:justify-between',
            'sm:gap-4',
          )}
        >
          <p>
            © {currentYear} sisiMove. All rights reserved.
          </p>

          <p>
            Travel together. Go further.
          </p>
        </div>
      </Container>
    </footer>
  );
}