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
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { Container } from '../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FooterLink {
  href: string;
  label: string;
}

// -----------------------------------------------------------------------------
// Navigation
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
    label: 'Log in',
  },
  {
    href: '/register',
    label: 'Join SisiMove',
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

// -----------------------------------------------------------------------------
// Footer Link List
// -----------------------------------------------------------------------------

function FooterLinkList({
  links,
}: {
  links: readonly FooterLink[];
}) {
  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={[
              'inline-flex',
              'rounded-[var(--radius-sm)]',
              'text-sm',
              'leading-6',
              'text-[var(--foreground-muted)]',
              'transition-colors',
              'duration-150',
              'hover:text-[var(--foreground)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]/30',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------
// Footer Group
// -----------------------------------------------------------------------------

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly FooterLink[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h2>

      <div className="mt-3">
        <FooterLinkList links={links} />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Site Footer
// -----------------------------------------------------------------------------

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={[
        'border-t',
        'border-[var(--border)]',
        'bg-[var(--background-muted)]',
      ].join(' ')}
    >
      <Container size="xl">
        {/* ----------------------------------------------------------------- */}
        {/* Main footer                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'grid',
            'gap-10',
            'py-12',
            'sm:py-14',
            'lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]',
            'lg:gap-12',
            'lg:py-16',
          ].join(' ')}
        >
          {/* --------------------------------------------------------------- */}
          {/* Brand                                                           */}
          {/* --------------------------------------------------------------- */}

          <div className="max-w-md">
            <Link
              href="/"
              aria-label="sisiMove home"
              className={[
                'inline-flex',
                'rounded-[var(--radius-sm)]',
                'text-xl',
                'font-bold',
                'tracking-tight',
                'text-[var(--foreground)]',
                'outline-none',
                'transition-colors',
                'duration-150',
                'hover:text-[var(--brand)]',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]/30',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              sisi<span className="text-[var(--brand)]">Move</span>
            </Link>

            <p
              className={[
                'mt-3',
                'max-w-md',
                'text-sm',
                'leading-6',
                'text-[var(--foreground-muted)]',
              ].join(' ')}
            >
              Kenya&apos;s long-distance travel network.
              Find people travelling your way and share the journey.
            </p>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Explore                                                         */}
          {/* --------------------------------------------------------------- */}

          <FooterGroup
            title="Explore"
            links={exploreLinks}
          />

          {/* --------------------------------------------------------------- */}
          {/* Account                                                         */}
          {/* --------------------------------------------------------------- */}

          <FooterGroup
            title="Account"
            links={accountLinks}
          />

          {/* --------------------------------------------------------------- */}
          {/* Support                                                         */}
          {/* --------------------------------------------------------------- */}

          <FooterGroup
            title="Support"
            links={supportLinks}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Bottom bar                                                        */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={[
            'flex',
            'flex-col',
            'gap-2',
            'border-t',
            'border-[var(--border)]',
            'py-5',
            'text-xs',
            'text-[var(--foreground-subtle)]',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-between',
          ].join(' ')}
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