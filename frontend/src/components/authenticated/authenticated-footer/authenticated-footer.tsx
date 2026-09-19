// -----------------------------------------------------------------------------
// sisiMove — Authenticated Footer
// -----------------------------------------------------------------------------
//
// Footer for authenticated application surfaces.
//
// Responsibilities:
// - Provide lightweight application footer content.
// - Provide secondary navigation for authenticated users.
// - Provide sisiMove copyright information.
// - Establish the visual boundary below authenticated page content.
//
// This component does NOT:
// - inspect authentication state,
// - manage sessions,
// - perform authorization,
// - contain marketplace logic,
// - fetch data,
// - determine verification status,
// - contain marketplace capabilities.
//
// Authenticated shell:
//
//     AuthenticatedShell
//         ├── AuthenticatedHeader
//         ├── Page content
//         └── AuthenticatedFooter
//
// The footer intentionally remains smaller than the public landing footer.
// Authenticated users are already inside the application, so the footer
// provides only essential identity, copyright, help, support, and legal links.
//
// Branding:
//
//     sisi + Move
//
// "sisi" is black / foreground.
// "Move" is sisiMove blue / brand.
//
// The authenticated footer uses the same sisiMove brand expression as the
// public and authenticated headers.
//
// -----------------------------------------------------------------------------


import Link from 'next/link';

import { AUTHENTICATED_ROUTES } from '@/foundation/routing';


// =============================================================================
// Footer Links
// =============================================================================

const AUTHENTICATED_FOOTER_LINKS = [
  {
    label: 'Safety',
    href: '/safety',
  },
  {
    label: 'Help',
    href: '/help',
  },
  {
    label: 'Support',
    href: '/support',
  },
  {
    label: 'Terms',
    href: '/terms',
  },
  {
    label: 'Privacy',
    href: '/privacy',
  },
] as const;


// =============================================================================
// Authenticated Footer
// =============================================================================

export function AuthenticatedFooter() {
  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--surface)]"
      aria-label="Application footer"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">

        {/* =================================================================
            Brand + Copyright
        ================================================================= */}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

          <div className="flex flex-col gap-1">
            <Link
              href={AUTHENTICATED_ROUTES.HOME}
              aria-label="sisiMove home"
              className="w-fit rounded-[var(--radius-md)] text-sm font-semibold tracking-tight outline-none transition-opacity duration-150 ease-out hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              <span className="text-[var(--foreground)]">
                sisi
              </span>

              <span className="text-[var(--brand)]">
                Move
              </span>
            </Link>

            <p className="text-sm text-[var(--muted-foreground)]">
              Long-distance journeys shared by people travelling the same way.
            </p>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} sisiMove. All rights reserved.
          </p>
        </div>


        {/* =================================================================
            Secondary Navigation
        ================================================================= */}

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          {AUTHENTICATED_FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-md)] text-sm text-[var(--muted-foreground)] outline-none transition-colors duration-150 ease-out hover:text-[var(--brand)] focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}


export default AuthenticatedFooter;