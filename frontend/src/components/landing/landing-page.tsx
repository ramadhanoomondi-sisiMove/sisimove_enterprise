// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// Top-level composition component for the public sisiMove landing page.
//
// The landing page is the public entry point into the sisiMove journey market.
// It presents the marketplace before the supporting calls to action and
// explanatory content.
//
// The page follows the physical-market interaction model:
//
//     LANDING
//         │
//         ├── Journey Market introduction
//         │
//         ├── Marketplace
//         │     ├── Journeys
//         │     └── Journey Demand
//         │
//         ├── Create Travel Demand
//         │
//         ├── Publish Journey
//         │
//         └── How It Works
//
// Journey and Journey Demand remain independent feature domains.
//
// The landing page does not merge their domain logic. It composes the public
// marketplace representation supplied by the application/read boundary and
// presents the resulting marketplace alongside the surrounding landing-page
// sections.
//
// -----------------------------------------------------------------------------
//
// Architectural responsibility
// -----------------------------------------------------------------------------
//
// LandingPage is intentionally a composition boundary.
//
// It is responsible for:
//
// - establishing the order of public landing sections;
// - composing the existing landing presentation components;
// - passing the prepared marketplace presentation contract to
//   MarketplaceSection.
//
// It is NOT responsible for:
//
// - fetching marketplace data;
// - owning marketplace query state;
// - managing marketplace URL state;
// - filtering or sorting marketplace data;
// - constructing API requests;
// - implementing Journey business rules;
// - implementing Journey Demand business rules;
// - determining booking eligibility;
// - determining demand participation eligibility;
// - constructing navigation URLs;
// - communicating directly with the API.
//
// Those responsibilities belong to the appropriate route, application,
// marketplace read-boundary, or feature layer.
//
// -----------------------------------------------------------------------------
//
// Semantic page boundary
// -----------------------------------------------------------------------------
//
// The public route layout owns the document-level <main> element.
//
// LandingPage therefore renders only the page content and deliberately does
// not introduce another <main> element. This prevents invalid nested <main>
// landmarks when LandingPage is rendered inside the public layout.
//
// The resulting structure is:
//
//     Public Layout
//         ├── SiteHeader
//         ├── <main>
//         │     └── LandingPage
//         │           ├── LandingHero
//         │           ├── MarketplaceSection
//         │           ├── CreateDemandSection
//         │           ├── PublishJourneySection
//         │           └── HowItWorksSection
//         └── SiteFooter
//
// -----------------------------------------------------------------------------
//
// Marketplace boundary
// -----------------------------------------------------------------------------
//
// LandingPage deliberately does not know how the marketplace is retrieved or
// how its query state is managed.
//
// It receives the complete MarketplaceSectionProps contract and passes that
// contract directly to MarketplaceSection.
//
// This keeps the landing composition independent from:
//
// - marketplace transport;
// - marketplace query orchestration;
// - URL synchronization;
// - request lifecycle management;
// - Journey discovery implementation;
// - Journey Demand discovery implementation.
//
// The marketplace therefore remains a replaceable presentation boundary within
// the larger landing page.
//
// -----------------------------------------------------------------------------
//
// Visual composition
// -----------------------------------------------------------------------------
//
// The global SiteHeader and SiteFooter are supplied by the public layout.
//
// LandingPage provides the page content between them:
//
//     LandingHero
//         ↓
//     MarketplaceSection
//         ↓
//     CreateDemandSection
//         ↓
//     PublishJourneySection
//         ↓
//     HowItWorksSection
//
// The marketplace intentionally appears immediately after the hero.
//
// Visitors should see the actual market before being asked to read supporting
// explanation or choose a participation path.
//
// MarketplaceSection owns the marketplace presentation hierarchy:
//
//     THE JOURNEY MARKET
//     See where people are going...
//
//     [ From ] [ To ] [ Date ] [ Filters ]
//
//     MARKET
//     [ All ] [ Journeys ] [ Demand ]
//     Showing what's available
//
//     Journey / Demand results
//
// The landing page does not duplicate any of that marketplace structure.
//
// -----------------------------------------------------------------------------

import { LandingHero } from '@/components/landing/hero';

import {
  MarketplaceSection,
  type MarketplaceSectionProps,
} from '@/components/landing/marketplace';

import {
  CreateDemandSection,
  PublishJourneySection,
} from '@/components/landing/calls-to-action';

import { HowItWorksSection } from '@/components/landing/how-it-works';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
//
// MarketplaceSection is intentionally controlled.
//
// Reusing MarketplaceSectionProps prevents LandingPage from maintaining a
// second marketplace contract that could drift from the actual marketplace
// presentation boundary.
//
// The route/application/client boundary prepares this contract and supplies it
// to LandingPage.
//
// -----------------------------------------------------------------------------

export interface LandingPageProps {
  marketplace: MarketplaceSectionProps;
}

// -----------------------------------------------------------------------------
// Landing Page
// -----------------------------------------------------------------------------

export function LandingPage({
  marketplace,
}: LandingPageProps) {
  return (
    <div className="w-full min-w-0">
      {/* ------------------------------------------------------------------- */}
      {/* Journey Market introduction                                         */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * LandingHero establishes the public marketplace proposition.
       *
       * It does not fetch marketplace data or own marketplace state.
       */}

      <LandingHero />

      {/* ------------------------------------------------------------------- */}
      {/* Primary marketplace discovery surface                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * MarketplaceSection is the primary interaction surface of the
       * landing page.
       *
       * The complete controlled marketplace presentation contract is passed
       * through unchanged. LandingPage does not interpret marketplace state
       * or implement marketplace behavior.
       *
       * MarketplaceSection owns the presentation of:
       *
       * - refinement controls;
       * - marketplace stream navigation;
       * - loading state;
       * - error state;
       * - empty state;
       * - Journey results;
       * - Journey Demand results.
       *
       * Marketplace pagination is intentionally not part of this contract.
       * The current marketplace composition is based on independent Journey
       * and Journey Demand collections and does not expose a unified
       * pagination model.
       */}

      <MarketplaceSection {...marketplace} />

      {/* ------------------------------------------------------------------- */}
      {/* Demand-side marketplace participation                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Provides the visitor with a path forward when the Journey they need
       * is not currently available.
       *
       * The CTA does not alter marketplace state itself. Its destination and
       * interaction behavior belong to the surrounding route/application
       * layer.
       */}

      <CreateDemandSection />

      {/* ------------------------------------------------------------------- */}
      {/* Supply-side marketplace participation                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Provides the visitor with a path to publish available seats after
       * seeing the existing marketplace.
       */}

      <PublishJourneySection />

      {/* ------------------------------------------------------------------- */}
      {/* How It Works                                                         */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Supporting explanation intentionally follows the marketplace and
       * participation CTAs.
       *
       * The visitor first sees what is available, then sees how they can
       * participate, and only then receives the explanatory workflow.
       */}

      <HowItWorksSection />
    </div>
  );
}

