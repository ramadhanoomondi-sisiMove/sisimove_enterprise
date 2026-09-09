// -----------------------------------------------------------------------------
// sisiMove — How It Works Page
// -----------------------------------------------------------------------------

import type { Metadata } from 'next';
import Link from 'next/link';

import { HowItWorksSection } from '@/components/landing/how-it-works';
import { TrustSection } from '@/components/landing/trust';

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Learn how SisiMove helps you find people travelling your way, understand their journey and trust signals, and share the journey.',
};

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const primaryLinkClassName = [
  'inline-flex',
  'min-h-10',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-[var(--radius-md)]',
  'border',
  'border-transparent',
  'bg-[var(--brand)]',
  'px-4',
  'text-sm',
  'font-medium',
  'whitespace-nowrap',
  'select-none',
  'transition-colors',
  'duration-150',
  'ease-out',
  'hover:bg-[var(--brand-hover)]',
  'active:bg-[var(--brand-hover)]',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--brand)]',
  'focus-visible:outline-offset-2',
].join(' ');

const secondaryLinkClassName = [
  'inline-flex',
  'min-h-10',
  'items-center',
  'justify-center',
  'gap-2',
  'rounded-[var(--radius-md)]',
  'border',
  'border-[var(--border-strong)]',
  'bg-transparent',
  'px-4',
  'text-sm',
  'font-medium',
  'whitespace-nowrap',
  'select-none',
  'text-[var(--foreground)]',
  'transition-colors',
  'duration-150',
  'ease-out',
  'hover:bg-[var(--background-subtle)]',
  'hover:border-[var(--foreground-subtle)]',
  'active:bg-[var(--background-muted)]',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--brand)]',
  'focus-visible:outline-offset-2',
].join(' ');

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      {/* ------------------------------------------------------------------- */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------- */}

      <section className="border-b border-neutral-100 bg-neutral-50 py-14 sm:py-20">
        <div className="page-container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              HOW SISIMOVE WORKS
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Find your way. Meet the right people. Travel together.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              SisiMove helps you discover people travelling your way,
              understand their journey and trust signals, and share the road
              with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className={primaryLinkClassName}
              >
                Find a journey
              </Link>

              <Link
                href="/#travellers"
                className={secondaryLinkClassName}
              >
                Explore travellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* How It Works                                                       */}
      {/* ------------------------------------------------------------------- */}

      <HowItWorksSection
        description="The journey comes first. SisiMove makes it easier to discover the people, plans and trust signals around it."
      />

      {/* ------------------------------------------------------------------- */}
      {/* Trust                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div id="trust">
        <TrustSection />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Final CTA                                                          */}
      {/* ------------------------------------------------------------------- */}

      <section className="border-t border-neutral-100 py-14 sm:py-20">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              YOUR NEXT JOURNEY
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Ready to see who is going your way?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Start by exploring journeys and people travelling across Kenya.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/"
                className={primaryLinkClassName}
              >
                Explore SisiMove
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}