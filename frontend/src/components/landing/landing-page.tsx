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
// Public Journey discovery and Journey Demand are composed through the
// client-side TravellerDiscoveryDemandContent boundary.
//
// Architectural boundary:
// - LandingPage remains a Server Component.
// - TravellerDiscoveryDemandContent is the client-side composition boundary
//   for public Journey Discovery and Journey Demand.
// - Search criteria cross this boundary as serializable data only.
// - No event handlers, hooks, or discovery state cross this boundary.
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
// - Each major section owns its own presentation surface.
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
// TravellerDiscoveryDemandContent
//   │
//   ▼
// TravellerDiscoveryContent
//   │
//   ▼
// useJourneys.search()
//   │
//   ▼
// GET /journeys/search
//   │
//   ├── journeys found
//   │
//   └── no journeys
//          │
//          ▼
//     JourneyDemandSection
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import Link from 'next/link';

import { cn } from '../../foundation/utils/cn';

import { HeroSection } from './hero/hero-section';

import {
  TravellerDiscoveryDemandContent,
  type TravellerDiscoveryContentProps,
} from './travellers';

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
   * client-side discovery composition.
   */
  searchValues?: TravellerDiscoveryContentProps['searchValues'];

  /**
   * Optional content rendered before the landing page sections.
   */
  topContent?: ReactNode;

  /**
   * Optional content rendered between the hero and public Journey discovery.
   */
  afterHeroContent?: ReactNode;

  /**
   * Optional content rendered between public Journey discovery and
   * Journey Demand.
   *
   * This content is composed inside TravellerDiscoveryDemandContent so the
   * discovery-to-demand ordering remains inside the same client boundary.
   */
  afterDiscoveryContent?: ReactNode;

  /**
   * Replace the default Journey Demand section.
   *
   * The override is composed by TravellerDiscoveryDemandContent.
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
   * Replace the default public Journey discovery content.
   *
   * The default is TravellerDiscoveryContent, composed through
   * TravellerDiscoveryDemandContent.
   *
   * This remains a ReactNode rather than a callback so the Server Component
   * never receives or passes event handlers.
   *
   * When this override is supplied, the default TravellerDiscoveryContent is
   * not rendered and searchValues are not applied to the override.
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
 * Single alignment grid used by landing sections owned by this component.
 *
 * TravellerDiscoveryDemandContent owns the Discovery and Journey Demand
 * section wrappers themselves because those sections form one client-side
 * composition boundary.
 */
const sectionInnerClassName = cn(
  'mx-auto w-full max-w-7xl',
  'px-4 sm:px-6 lg:px-8',
);

/**
 * Standard section spacing.
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
  afterDiscoveryContent,
  journeyDemandContent,
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
      {/* Public Journey Discovery + Journey Demand                           */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Discovery and Journey Demand intentionally remain inside the same
       * client-side composition boundary.
       *
       * TravellerDiscoveryContent owns:
       * - public Journey loading;
       * - public Journey search;
       * - public Journey Demand loading;
       * - empty-search detection.
       *
       * TravellerDiscoveryDemandContent owns:
       * - the client-side bridge between discovery and demand;
       * - the exact empty-search context;
       * - presentation of the Journey Demand conversion section.
       *
       * It also owns the visual wrappers for these two sections. LandingPage
       * therefore does not add another section/container around them.
       *
       * This prevents duplicated gutters, borders, backgrounds, and vertical
       * spacing while keeping the Server Component boundary intact.
       */}

      <TravellerDiscoveryDemandContent
        searchValues={searchValues}
        travellerDiscoveryContent={travellerDiscoveryContent}
        afterDiscoveryContent={afterDiscoveryContent}
        journeyDemandContent={journeyDemandContent}
      />

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
       * presentation. LandingPage must not create another element with the
       * same id.
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
       * Do not wrap these components in another card or border here. The
       * landing page only controls their shared alignment and spacing.
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

