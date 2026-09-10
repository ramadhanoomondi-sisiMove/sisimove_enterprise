// -----------------------------------------------------------------------------
// sisiMove — Hero Section
// -----------------------------------------------------------------------------
//
// Public landing-page hero.
//
// Responsibilities:
// - Compose the hero copy and Journey search.
// - Establish the primary landing-page entry point.
// - Navigate submitted Journey search criteria through the URL.
// - Keep presentation and Journey data fetching separate.
//
// Design:
// - Strong visual hierarchy.
// - Compact vertical rhythm.
// - Consistent content alignment.
// - Search is the primary interactive element.
// - Minimal decorative treatment.
// - Responsive without relying on arbitrary offsets.
//
// Architectural boundary:
// - This component does not fetch Journeys.
// - This component does not search or filter Journey data.
// - Search criteria are written to the landing-page URL.
// - The URL acts as the coordination boundary between the hero and
//   the server-rendered landing composition.
// - TravellerDiscoveryContent owns the subsequent Journey search execution.
//
// -----------------------------------------------------------------------------
//
// Search flow:
//
// TravellerSearch
//      │
//      │ from + to + date
//      ▼
// HeroSection
//      │
//      │ URL navigation
//      ▼
// /?from=...&to=...&date=...#journeys
//      │
//      ▼
// page.tsx
//      │
//      ▼
// LandingPage
//      │
//      ▼
// TravellerDiscoveryContent
//      │
//      ▼
// useJourneys.search()
//      │
//      ▼
// GET /journeys/search
//
// -----------------------------------------------------------------------------

'use client';

import {
  usePathname,
  useRouter,
} from 'next/navigation';
import {
  useTransition,
} from 'react';

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
  /**
   * Allows the containing presentation composition to disable Journey search.
   *
   * The hero remains responsible only for navigating valid search criteria.
   * Journey retrieval is handled by the discovery composition after the URL
   * changes.
   */
  searchDisabled?: boolean;
}

// -----------------------------------------------------------------------------
// Hero Section
// -----------------------------------------------------------------------------

export function HeroSection({
  searchDisabled = false,
}: HeroSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isNavigating, startNavigation] = useTransition();

  // ---------------------------------------------------------------------------
  // Search Navigation
  // ---------------------------------------------------------------------------

  function handleSearch(values: TravellerSearchValues): void {
    const searchParams = new URLSearchParams();

    searchParams.set('from', values.from);
    searchParams.set('to', values.to);
    searchParams.set('date', values.date);

    startNavigation(() => {
      router.push(
        `${pathname}?${searchParams.toString()}#journeys`,
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
          {/* Journey Search                                                   */}
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
                onSubmit={handleSearch}
                loading={isNavigating}
                disabled={searchDisabled || isNavigating}
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
            <span>Can’t find a journey?</span>

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
              Tell us where you want to go
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

