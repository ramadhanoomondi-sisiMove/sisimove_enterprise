// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery + Journey Demand Content
// -----------------------------------------------------------------------------
//
// Client-side composition boundary for the public traveller discovery flow.
//
// Responsibilities:
// - Compose public Journey discovery.
// - Receive public Journey search criteria.
// - Observe when a Journey search returns no published Journeys.
// - Carry that exact search context into Journey Demand.
// - Present the "Create travel demand" action for an empty Journey search.
// - Scroll the traveller to the Journey Demand opportunity after an empty
//   Journey search.
// - Preserve the landing-page ordering between Discovery and Journey Demand.
// - Preserve the existing landing-page visual surfaces for both sections.
// - Allow the parent Server Component to provide ReactNode content slots.
//
// This component does NOT:
// - fetch data directly;
// - search Journeys directly;
// - create Journey Demands;
// - perform bookings;
// - manage authentication;
// - contain commercial logic;
// - contain financial logic.
//
// Architectural boundary:
// - LandingPage remains a Server Component.
// - This component is a Client Component.
// - Search criteria cross the Server/Client boundary as serializable data.
// - Empty-search state remains entirely inside the client composition boundary.
// - Interactive Journey Demand actions remain inside this Client Component.
//
// Flow:
//
// searchValues
//     │
//     ▼
// TravellerDiscoveryContent
//     │
//     ├── published Journeys found
//     │
//     └── no published Journeys
//              │
//              ▼
//        emptySearchContext
//              │
//              ├── scroll to Journey Demand
//              │
//              ├── JourneyDemandSection
//              │
//              └── CreateTravelDemandAction
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// TravellerDiscoveryContent remains responsible for public discovery data:
//
// - Published Journeys
// - Open Journey Demands
// - Journey search
// - Empty Journey search detection
//
// This component is responsible only for composing those presentation units,
// carrying the empty-search context from Journey discovery into the Journey
// Demand presentation, presenting the corresponding action, and handling the
// page-level scroll into that opportunity.
//
// It does not create a Journey Demand automatically.
//
// The "Create travel demand" action currently remains presentation-only.
// Its eventual onCreate handler belongs to the appropriate application flow
// and must preserve the original search context through authentication into
// authenticated demand creation.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Journey Feature
// -----------------------------------------------------------------------------

import type { UseJourneysSearchValues } from '@/features/journeys';

// -----------------------------------------------------------------------------
// Shared Utilities
// -----------------------------------------------------------------------------

import { cn } from '../../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Journey Demand Presentation
// -----------------------------------------------------------------------------

import {
  CreateTravelDemandAction,
} from '../journey-demand/create-travel-demand-action';

import {
  JourneyDemandSection,
  type JourneyDemandSearchContext,
} from '../journey-demand/journey-demand-section';

// -----------------------------------------------------------------------------
// Traveller Discovery
// -----------------------------------------------------------------------------

import {
  TravellerDiscoveryContent,
  type TravellerDiscoveryContentProps,
} from './traveller-discovery-content';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TravellerDiscoveryDemandContentProps {
  /**
   * Public Journey search criteria supplied by the landing-page route.
   *
   * These values are serializable and may safely cross the Server Component
   * boundary.
   */
  readonly searchValues?: TravellerDiscoveryContentProps['searchValues'];

  /**
   * Replace the default public Journey discovery content.
   *
   * When supplied, the default TravellerDiscoveryContent is not rendered.
   * Consequently, the empty-search bridge is also not connected to the
   * supplied override.
   */
  readonly travellerDiscoveryContent?: ReactNode;

  /**
   * Optional content rendered between Journey discovery and Journey Demand.
   *
   * This remains inside the client composition boundary so the landing-page
   * ordering is preserved without passing event handlers through the
   * Server Component boundary.
   */
  readonly afterDiscoveryContent?: ReactNode;

  /**
   * Replace the default Journey Demand content.
   *
   * When supplied, the default JourneyDemandSection is not rendered.
   *
   * The caller therefore owns the complete Journey Demand presentation for
   * that composition.
   */
  readonly journeyDemandContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Shared Layout
// -----------------------------------------------------------------------------
//
// These values preserve the landing-page alignment and section surfaces that
// previously surrounded TravellerDiscoveryContent and JourneyDemandSection.
//
// The client wrapper owns these surfaces because it also owns the composition
// relationship between the two sections.
//

const sectionInnerClassName = cn(
  'mx-auto w-full max-w-7xl',
  'px-4 sm:px-6 lg:px-8',
);

const sectionClassName = cn(
  'py-10 sm:py-12 lg:py-16',
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoveryDemandContent({
  searchValues,
  travellerDiscoveryContent,
  afterDiscoveryContent,
  journeyDemandContent,
}: TravellerDiscoveryDemandContentProps) {
  // ---------------------------------------------------------------------------
  // Empty-search context
  // ---------------------------------------------------------------------------
  //
  // This state exists only to connect Journey discovery with Journey Demand.
  //
  // TravellerDiscoveryContent detects the empty search.
  // This composition boundary receives the resulting search context.
  // JourneyDemandSection presents the resulting opportunity.
  //
  // No Journey Demand is created here.
  // No authentication is performed here.
  // No navigation is performed here.
  // ---------------------------------------------------------------------------

  const [emptySearchContext, setEmptySearchContext] =
    useState<JourneyDemandSearchContext | null>(null);

  // ---------------------------------------------------------------------------
  // Empty-search bridge
  // ---------------------------------------------------------------------------
  //
  // TravellerDiscoveryContent exposes the feature-level search values.
  //
  // JourneyDemandSection owns its own presentation-level search context.
  //
  // Translate between those two contracts here rather than coupling either
  // component directly to the other.
  // ---------------------------------------------------------------------------

  const handleEmptySearchContextChange = useCallback(
    (context: UseJourneysSearchValues | null): void => {
      if (context === null) {
        setEmptySearchContext(null);
        return;
      }

      setEmptySearchContext({
        from: context.from,
        to: context.to,
        date: context.date,
      });
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Scroll to Journey Demand after an empty Journey search
  // ---------------------------------------------------------------------------
  //
  // Do not scroll merely because search values exist.
  //
  // Search values mean that a search was requested.
  // emptySearchContext means that the search actually completed with no
  // published Journey and that the Journey Demand opportunity is now relevant.
  //
  // requestAnimationFrame allows React to commit the updated Journey Demand
  // presentation before the browser performs the scroll.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (emptySearchContext === null) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById('journey-demand')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [emptySearchContext]);

  // ---------------------------------------------------------------------------
  // Empty-search action
  // ---------------------------------------------------------------------------
  //
  // The Journey Demand section already owns the empty-search presentation.
  // This composition boundary supplies the interactive action only when
  // discovery has confirmed that the searched route/date has no published
  // Journey.
  //
  // The action itself contains no business logic. Its eventual onCreate flow
  // can be supplied here when registration/authentication and demand creation
  // are ready to be wired.
  // ---------------------------------------------------------------------------

  const createDemandAction = emptySearchContext ? (
    <CreateTravelDemandAction />
  ) : undefined;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
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
              onEmptySearchContextChange={
                handleEmptySearchContextChange
              }
            />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Content between Discovery and Journey Demand                       */}
      {/* ------------------------------------------------------------------- */}

      {afterDiscoveryContent}

      {/* ------------------------------------------------------------------- */}
      {/* Journey Demand                                                      */}
      {/* ------------------------------------------------------------------- */}

      <section
        id="journey-demand"
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
              emptySearchContext={emptySearchContext}
              createDemandAction={createDemandAction}
            />
          )}
        </div>
      </section>
    </>
  );
}