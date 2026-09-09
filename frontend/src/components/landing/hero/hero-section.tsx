// -----------------------------------------------------------------------------
// sisiMove — Hero Section
// -----------------------------------------------------------------------------
//
// Public landing-page hero.
//
// Responsibilities:
// - Compose the hero copy and traveller search.
// - Establish the primary landing-page entry point.
// - Keep presentation and search composition separate from data fetching.
//
// Design:
// - Strong visual hierarchy.
// - Compact vertical rhythm.
// - Consistent content alignment.
// - Search is the primary interactive element.
// - Minimal decorative treatment.
// - Responsive without relying on arbitrary offsets.
//
// -----------------------------------------------------------------------------

'use client';

import {
  HeroCopy,
  TravellerSearch,
  type TravellerSearchValues,
} from './index';

import { Container } from '../../ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface HeroSectionProps {
  onSearch?: (values: TravellerSearchValues) => void;
  searchLoading?: boolean;
  searchDisabled?: boolean;
}

// -----------------------------------------------------------------------------
// Hero Section
// -----------------------------------------------------------------------------

export function HeroSection({
  onSearch,
  searchLoading = false,
  searchDisabled = false,
}: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className={[
        'relative',
        'overflow-hidden',
        'border-b',
        'border-[var(--border)]',
        'bg-[var(--background)]',
      ].join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Decorative Background                                               */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className={[
          'pointer-events-none',
          'absolute',
          'inset-x-0',
          'top-0',
          'h-[420px]',
          'bg-gradient-to-b',
          'from-[var(--brand-soft)]',
          'to-transparent',
          'opacity-70',
        ].join(' ')}
      />

      <div
        aria-hidden="true"
        className={[
          'pointer-events-none',
          'absolute',
          'left-1/2',
          'top-[-180px]',
          '-translate-x-1/2',
          'h-[360px]',
          'w-[720px]',
          'rounded-full',
          'bg-[var(--brand-soft)]',
          'opacity-40',
          'blur-3xl',
        ].join(' ')}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Content                                                             */}
      {/* ------------------------------------------------------------------- */}

      <Container
        size="xl"
        className="relative"
      >
        <div
          className={[
            'mx-auto',
            'flex',
            'w-full',
            'max-w-6xl',
            'flex-col',
            'items-center',
            'gap-8',
            'px-4',
            'py-14',
            'sm:px-6',
            'sm:py-18',
            'lg:px-8',
            'lg:py-20',
          ].join(' ')}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Hero Copy                                                        */}
          {/* ---------------------------------------------------------------- */}

          <div className="w-full max-w-3xl text-center">
            <HeroCopy />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Traveller Search                                                 */}
          {/* ---------------------------------------------------------------- */}

          <div className="w-full max-w-5xl">
            <div
              className={[
                'rounded-2xl',
                'border',
                'border-[var(--border)]',
                'bg-white',
                'p-2',
                'shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
                'sm:p-3',
              ].join(' ')}
            >
              <TravellerSearch
                onSubmit={onSearch}
                loading={searchLoading}
                disabled={searchDisabled}
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Secondary Entry Point                                            */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={[
              'flex',
              'flex-wrap',
              'items-center',
              'justify-center',
              'gap-x-2',
              'gap-y-1',
              'text-center',
              'text-sm',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            <span>Looking for a journey?</span>

            <a
              href="#journey-demand"
              className={[
                'rounded-[var(--radius-sm)]',
                'font-semibold',
                'text-[var(--brand)]',
                'underline-offset-4',
                'transition-colors',
                'duration-150',
                'hover:text-[var(--brand-hover)]',
                'hover:underline',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]/30',
              ].join(' ')}
            >
              Find someone going your way
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}