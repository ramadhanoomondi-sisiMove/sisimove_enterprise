// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// Top-level composition component for the public sisiMove landing page.
//
// The landing page is the public entry point into the sisiMove journey market.
// It follows the physical-market interaction model:
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
// LandingPage composes their public marketplace representation but does not
// merge, own, or implement either domain's business logic.
//
// -----------------------------------------------------------------------------
//
// Architectural responsibility
// -----------------------------------------------------------------------------
//
// LandingPage is a pure page-composition boundary.
//
// It is responsible for:
//
// - establishing the order of public landing sections;
// - composing landing presentation components;
// - passing the prepared marketplace contract to MarketplaceSection.
//
// It is NOT responsible for:
//
// - fetching marketplace data;
// - owning marketplace query state;
// - synchronizing marketplace URL state;
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
// LandingPage therefore renders page content only and deliberately does not
// introduce another <main> element.
//
// Result:
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
// LandingPage receives the complete MarketplaceSectionProps contract from the
// route/application/client orchestration boundary.
//
// The contract is passed directly to MarketplaceSection.
//
// LandingPage therefore remains independent from:
//
// - marketplace transport;
// - marketplace query orchestration;
// - URL synchronization;
// - request lifecycle management;
// - Journey discovery implementation;
// - Journey Demand discovery implementation.
//
// MarketplaceSection remains the replaceable marketplace presentation boundary
// within the larger landing page.
//
// -----------------------------------------------------------------------------
//
// Visual composition
// -----------------------------------------------------------------------------
//
// The public layout supplies SiteHeader and SiteFooter.
//
// LandingPage supplies the content between them:
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


// =============================================================================
// Props
// =============================================================================
//
// Reuse MarketplaceSectionProps directly.
//
// This prevents LandingPage from creating a second marketplace contract that
// could drift from the actual marketplace presentation boundary.
//
// The route/application/client boundary prepares this contract and supplies it
// to LandingPage.
//

export interface LandingPageProps {
  marketplace: MarketplaceSectionProps;
}


// =============================================================================
// Landing Page
// =============================================================================

export function LandingPage({
  marketplace,
}: LandingPageProps) {
  return (
    <div className="w-full min-w-0">

      {/* =====================================================================
          1. Marketplace introduction
      ===================================================================== */}
      {/*
       * Establishes the marketplace proposition before the visitor reaches
       * the actual inventory.
       *
       * LandingHero is presentation-only and does not own marketplace state.
       */}

      <LandingHero />


      {/* =====================================================================
          2. Primary marketplace
      ===================================================================== */}
      {/*
       * This is the primary interaction surface of the landing page.
       *
       * LandingPage passes the prepared marketplace contract through unchanged.
       *
       * MarketplaceSection owns:
       *
       * - marketplace refinement controls;
       * - marketplace stream selection;
       * - loading state;
       * - error state;
       * - empty state;
       * - Journey results;
       * - Journey Demand results.
       *
       * LandingPage does not interpret any of those concerns.
       */}

      <MarketplaceSection {...marketplace} />


      {/* =====================================================================
          3. Demand-side participation
      ===================================================================== */}
      {/*
       * Gives visitors a path forward when the Journey they need is not
       * currently available.
       *
       * CreateDemandSection owns the presentation of this participation path.
       * Its destination and application behavior remain outside LandingPage.
       */}

      <CreateDemandSection />


      {/* =====================================================================
          4. Supply-side participation
      ===================================================================== */}
      {/*
       * Gives visitors a path to publish a Journey they are already making
       * and expose its available seats to the marketplace.
       */}

      <PublishJourneySection />


      {/* =====================================================================
          5. Supporting explanation
      ===================================================================== */}
      {/*
       * Explanation intentionally follows discovery and participation.
       *
       * The visitor first sees what is available, then sees how to participate,
       * and finally receives the broader workflow explanation.
       */}

      <HowItWorksSection />

    </div>
  );
}