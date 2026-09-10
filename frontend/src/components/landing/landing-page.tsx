// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// Top-level composition component for the public SisiMove landing experience.
//
// Responsibilities:
// - Compose public landing sections.
// - Provide public navigation between sections/pages.
// - Accept externally controlled feature content.
// - Pass public Journey search criteria into the discovery composition.
// - Keep business and data-fetching concerns outside the presentation layer.
//
// This component does NOT:
// - fetch data;
// - manage authentication;
// - create journeys;
// - create journey demands;
// - perform bookings;
// - contain commercial logic;
// - contain financial logic;
// - search or filter Journeys.
//
// Public journey discovery is composed through TravellerDiscoveryContent.
//
// Architectural boundary:
// - LandingPage remains a Server Component.
// - TravellerDiscoveryContent is the client-side composition boundary.
// - Search criteria cross this boundary as serializable data only.
// - No event handlers, hooks, or discovery state cross this boundary as props.
//
// Public journey discovery means:
// - display publicly available published journeys;
// - allow visitors to inspect public journey information;
// - keep journey discovery available before authentication;
// - leave protected actions such as booking to the appropriate flow.
//
// Visual principles:
// - One consistent page width.
// - One consistent horizontal gutter.
// - Compact but intentional vertical rhythm.
// - Sections sit closer together so the page feels active and connected.
// - Clear visual hierarchy without excessive empty space.
// - Individual sections own their presentation surfaces.
// - Avoid nested cards and duplicated containers.
// - Use shared SisiMove design tokens.
//
// -----------------------------------------------------------------------------
//
// Search flow:
//
// URL
//   │
//   │ from + to + date
//   ▼
// page.tsx
//   │
//   ▼
// LandingPage
//   │
//   │ searchValues
//   ▼
// TravellerDiscoveryContent
//   │
//   ▼
// useJourneys.search()
//   │
//   ▼
// GET /journeys/search
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '../../foundation/utils/cn';

import { HeroSection } from './hero/hero-section';

import {
  TravellerDiscoveryContent,
  type TravellerDiscoveryContentProps,
} from './travellers';

import { JourneyDemandSection } from './journey-demand/journey-demand-section';

import { TrustSection } from './trust/trust-section';

import { HowItWorksSection } from './how-it-works';

import { FindJourneySection } from './calls-to-action/find-journey-section';

import { ShareJourneySection } from './calls-to-action/share-journey-section';

import { CommunityCtaSection } from './calls-to-action/community-cta-section';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface LandingPageProps {
  /**
   * Published Journey search criteria supplied by the public landing-page URL.
   *
   * The page route owns reading and normalizing URL search parameters.
   * LandingPage only passes the resulting serializable criteria into the
   * existing client-side discovery composition.
   */
  searchValues?: TravellerDiscoveryContentProps['searchValues'];

  /**
   * Optional content rendered before the landing page sections.
   *
   * Useful for controlled application-level composition without coupling the
   * landing component to infrastructure or business logic.
   */
  topContent?: ReactNode;

  /**
   * Optional content rendered between the hero and public journey discovery.
   */
  afterHeroContent?: ReactNode;

  /**
   * Optional content rendered between public journey discovery and
   * Journey Demand.
   */
  afterDiscoveryContent?: ReactNode;

  /**
   * Replace the default Journey Demand section.
   *
   * Useful when the feature layer supplies loading, error, or populated
   * public Journey Demand discovery state.
   */
  journeyDemandContent?: ReactNode;

  /**
   * Optional content rendered between Journey Demand and Trust.
   */
  afterJourneyDemandContent?: ReactNode;

  /**
   * Optional content rendered between Trust and How It Works.
   */
  afterTrustContent?: ReactNode;

  /**
   * Optional content rendered between How It Works and the calls to action.
   */
  afterHowItWorksContent?: ReactNode;

  /**
   * Optional content rendered after the CTA sections.
   */
  bottomContent?: ReactNode;

  /**
   * Replace the default public journey discovery content.
   *
   * The default is TravellerDiscoveryContent, which owns the client-side
   * discovery composition and connects the existing public journey discovery
   * behavior to the presentation layer.
   *
   * Public journey discovery is intentionally available before authentication.
   * The journey is the discovery object; traveller information is presented
   * only as part of the public journey information.
   *
   * This remains a ReactNode rather than a callback so the Server Component
   * never receives or passes event handlers.
   *
   * When this override is supplied, the default TravellerDiscoveryContent is
   * not rendered and therefore searchValues are not applied to the override.
   */
  travellerDiscoveryContent?: ReactNode;

  /**
   * Replace the default Trust section.
   */
  trustContent?: ReactNode;

  /**
   * Replace the default How It Works section.
   */
  howItWorksContent?: ReactNode;

  /**
   * Replace the default Find a Journey CTA.
   */
  findJourneyContent?: ReactNode;

  /**
   * Replace the default Share a Journey CTA.
   */
  shareJourneyContent?: ReactNode;

  /**
   * Replace the default Community CTA.
   */
  communityContent?: ReactNode;

  /**
   * Additional classes applied to the page root.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Shared layout
// -----------------------------------------------------------------------------

/**
 * Single alignment grid used by public landing sections.
 *
 * The page owns the horizontal alignment. Individual sections should not
 * introduce another page-level container unless they intentionally need a
 * narrower presentation surface.
 */
const sectionInnerClassName = cn(
  'mx-auto w-full max-w-7xl',
  'px-4 sm:px-6 lg:px-8',
);

/**
 * Compact standard section spacing.
 *
 * The landing page contains several content-rich sections, so generous
 * section padding creates excessive empty space. Keep the sections visually
 * connected while preserving enough breathing room around each feature.
 */
const sectionClassName = cn(
  'py-10 sm:py-12 lg:py-16',
);

/**
 * More compact spacing for the final conversion area.
 */
const compactSectionClassName = cn(
  'py-8 sm:py-10 lg:py-12',
);

// -----------------------------------------------------------------------------
// Shared actions
// -----------------------------------------------------------------------------

const primaryActionClassName = cn(
  'inline-flex items-center justify-center',
  'min-h-11',
  'rounded-[var(--radius-md)]',
  'border border-transparent',
  'bg-[var(--brand)]',
  'px-5',
  'text-sm font-semibold',
  'whitespace-nowrap',
  'select-none',
  'text-[var(--brand-foreground)]',
  'shadow-sm',
  'transition-colors',
  'duration-150',
  'ease-out',
  'hover:bg-[var(--brand-hover)]',
  'hover:shadow-md',
  'active:bg-[var(--brand-hover)]',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--brand)]',
  'focus-visible:outline-offset-2',
);

const secondaryActionClassName = cn(
  'inline-flex items-center justify-center',
  'min-h-11',
  'rounded-[var(--radius-md)]',
  'border border-[var(--border-strong)]',
  'bg-[var(--surface)]',
  'px-5',
  'text-sm font-semibold',
  'whitespace-nowrap',
  'select-none',
  'text-[var(--foreground)]',
  'shadow-sm',
  'transition-colors',
  'duration-150',
  'ease-out',
  'hover:bg-[var(--background-subtle)]',
  'hover:shadow',
  'active:bg-[var(--background-muted)]',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--brand)]',
  'focus-visible:outline-offset-2',
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LandingPage({
  searchValues,
  topContent,
  afterHeroContent,
  journeyDemandContent,
  afterDiscoveryContent,
  afterJourneyDemandContent,
  afterTrustContent,
  afterHowItWorksContent,
  bottomContent,
  travellerDiscoveryContent,
  trustContent,
  howItWorksContent,
  findJourneyContent,
  shareJourneyContent,
  communityContent,
  className,
}: LandingPageProps) {
  return (
    <main
      className={cn(
        'min-h-screen',
        'overflow-x-clip',
        'bg-[var(--background)]',
        'text-[var(--foreground)]',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Application-level content                                           */}
      {/* ------------------------------------------------------------------- */}

      {topContent}

      {/* ------------------------------------------------------------------- */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------- */}

      <section className="relative">
        <HeroSection />
      </section>

      {afterHeroContent}

      {/* ------------------------------------------------------------------- */}
      {/* Public Journey Discovery                                            */}
      {/* ------------------------------------------------------------------- */}

      <section
        id="journeys"
        className={cn(
          sectionClassName,
          'border-b border-[var(--border)]',
          'bg-[var(--surface)]',
        )}
      >
        <div className={sectionInnerClassName}>
          {travellerDiscoveryContent ?? (
            <TravellerDiscoveryContent
              searchValues={searchValues}
            />
          )}
        </div>
      </section>

      {afterDiscoveryContent}

      {/* ------------------------------------------------------------------- */}
      {/* Journey Demand                                                      */}
      {/* ------------------------------------------------------------------- */}

      <section
        className={cn(
          sectionClassName,
          'border-b border-[var(--border)]',
          'bg-[var(--background-subtle)]',
        )}
      >
        <div className={sectionInnerClassName}>
          {journeyDemandContent ?? (
            <JourneyDemandSection
              demands={[]}
            />
          )}
        </div>
      </section>

      {afterJourneyDemandContent}

      {/* ------------------------------------------------------------------- */}
      {/* Trust                                                               */}
      {/* ------------------------------------------------------------------- */}

      <section
        id="trust"
        className={cn(
          sectionClassName,
          'border-b border-[var(--border)]',
          'bg-[var(--surface)]',
        )}
      >
        <div className={sectionInnerClassName}>
          {trustContent ?? (
            <TrustSection
              actionContent={
                <Link
                  href="/how-it-works#trust"
                  className={secondaryActionClassName}
                >
                  See how trust works
                </Link>
              }
            />
          )}
        </div>
      </section>

      {afterTrustContent}

      {/* ------------------------------------------------------------------- */}
      {/* How It Works                                                        */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * HowItWorksSection owns the semantic section id and its internal
       * presentation. The landing page must not create another element with
       * the same id.
       */}

      <section
        className={cn(
          sectionClassName,
          'border-b border-[var(--border)]',
          'bg-[var(--background-subtle)]',
        )}
      >
        <div className={sectionInnerClassName}>
          {howItWorksContent ?? (
            <HowItWorksSection />
          )}
        </div>
      </section>

      {afterHowItWorksContent}

      {/* ------------------------------------------------------------------- */}
      {/* Final Conversion Area                                               */}
      {/* ------------------------------------------------------------------- */}

      {/*
       * Each CTA section owns its own presentation surface.
       *
       * Do not wrap these components in another card/border here. That would
       * create nested visual surfaces and make the landing page feel heavy.
       */}

      <section
        className={cn(
          compactSectionClassName,
          'bg-[var(--surface)]',
        )}
      >
        <div className={sectionInnerClassName}>
          {/* ---------------------------------------------------------------- */}
          {/* Find a Journey                                                   */}
          {/* ---------------------------------------------------------------- */}

          <div>
            {findJourneyContent ?? (
              <FindJourneySection
                actionContent={
                  <Link
                    href="/#journeys"
                    className={primaryActionClassName}
                  >
                    Find a journey
                  </Link>
                }
                secondaryContent={
                  <Link
                    href="/#journeys"
                    className={secondaryActionClassName}
                  >
                    Explore journeys
                  </Link>
                }
              />
            )}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Share a Journey                                                  */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-5 sm:mt-6">
            {shareJourneyContent ?? (
              <ShareJourneySection
                actionContent={
                  <Link
                    href="/"
                    className={primaryActionClassName}
                  >
                    Share your journey
                  </Link>
                }
                secondaryContent={
                  <Link
                    href="/how-it-works"
                    className={secondaryActionClassName}
                  >
                    How it works
                  </Link>
                }
              />
            )}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Community                                                        */}
          {/* ---------------------------------------------------------------- */}

          <div className="mt-5 sm:mt-6">
            {communityContent ?? (
              <CommunityCtaSection
                actionContent={
                  <Link
                    href="/"
                    className={primaryActionClassName}
                  >
                    Join SisiMove
                  </Link>
                }
                secondaryContent={
                  <Link
                    href="/how-it-works"
                    className={secondaryActionClassName}
                  >
                    Learn how it works
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Application-level bottom content                                    */}
      {/* ------------------------------------------------------------------- */}

      {bottomContent}
    </main>
  );
}
