// -----------------------------------------------------------------------------
// sisiMove — Public Journey
// -----------------------------------------------------------------------------
//
// Primary public read model for the Journey marketplace.
//
// IMPORTANT
// ---------
//
// This is NOT a frontend mirror of the Prisma Journey model.
//
// The backend Journey aggregate is responsible for:
//
// - Journey persistence;
// - Journey lifecycle;
// - Journey-domain relationships;
// - Journey business rules;
// - Journey state transitions;
// - the Journey's opaque provider reference.
//
// `PublicJourney` is a marketplace read model.
//
// It represents the public information a visitor needs to discover,
// understand, and evaluate a published Journey:
//
// - who is providing it;
// - why that traveller can be trusted;
// - where the Journey goes;
// - when it departs;
// - which vehicle is being used;
// - how many seats remain;
// - what the Journey costs;
// - which traveller preferences apply;
// - which public assets are available.
//
// -----------------------------------------------------------------------------
//
// PUBLIC COMPOSITION
// -----------------------------------------------------------------------------
//
// PublicJourney
// ├── publicId
// ├── provider
// │   ├── traveller
// │   └── trust
// ├── route
// ├── schedule
// ├── vehicle
// ├── capacity
// ├── pricing
// ├── preferences
// └── assets
//
// -----------------------------------------------------------------------------
//
// PROVIDER OWNERSHIP VS PUBLIC COMPOSITION
// -----------------------------------------------------------------------------
//
// Journey owns the Journey creation and its provider reference.
//
// The provider reference is represented inside the Journey domain as an
// opaque `providerPublicId`.
//
// That does NOT mean Traveller Profile or Trust owns the Journey.
//
// For the public marketplace, the backend public-read boundary enriches the
// Journey's provider reference with public Traveller and Trust projections:
//
//     Journey.providerPublicId
//              │
//              ├──→ public Traveller projection
//              │
//              └──→ public Trust projection
//
// The resulting marketplace representation is:
//
//     PublicJourney.provider
//         ├── traveller
//         └── trust
//
// Therefore:
//
// - Journey remains the primary domain object;
// - Traveller does not own Journey;
// - Trust does not own Journey;
// - the frontend does not reconstruct this relationship;
// - the public read boundary supplies the completed provider projection.
//
// -----------------------------------------------------------------------------
//
// MARKETPLACE BOUNDARY
// -----------------------------------------------------------------------------
//
// `PublicJourney` deliberately represents the public Journey experience
// rather than exposing the internal Journey aggregate.
//
// The internal opaque provider reference is intentionally not exposed as a
// separate marketplace field because the public marketplace needs the public
// provider projection, not the internal reference itself.
//
// -----------------------------------------------------------------------------
//
// DELIBERATELY EXCLUDED
// -----------------------------------------------------------------------------
//
// The public Journey model must not expose:
//
// - Journey.id
// - provider Identity.publicId
// - Journey providerPublicId as a standalone field
// - internal child-entity IDs
// - booking information
// - passenger identities
// - financial settlement information
// - internal lifecycle timestamps
// - moderation information
// - internal Asset storage information
// - Trust events
// - internal operational metadata
//
// -----------------------------------------------------------------------------
//
// REQUIRED PUBLIC CONTRACT
// -----------------------------------------------------------------------------
//
// Every `PublicJourney` returned by the public Journey marketplace API must
// contain all required public Journey sections.
//
// In particular:
//
//     provider: PublicJourneyProvider
//
// MUST be present.
//
// Do not make `provider` optional merely to accommodate an incomplete backend
// response.
//
// If the backend cannot provide:
//
//     provider.traveller
//     provider.trust
//
// then the public composition boundary is incomplete and must be corrected
// there.
//
// The same principle applies to:
//
//     route
//     schedule
//     vehicle
//     capacity
//     pricing
//     preferences
//
// These are required parts of the public Journey marketplace contract, not
// optional implementation details.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyAsset } from './public-journey-asset';
import type { PublicJourneyCapacity } from './public-journey-capacity';
import type { PublicJourneyPreferences } from './public-journey-preferences';
import type { PublicJourneyPricing } from './public-journey-pricing';
import type { PublicJourneyProvider } from './public-journey-provider';
import type { PublicJourneyRoute } from './public-journey-route';
import type { PublicJourneySchedule } from './public-journey-schedule';
import type { PublicJourneyVehicle } from './public-journey-vehicle';

// =============================================================================
// Public Journey
// =============================================================================

/**
 * Marketplace read model for a publicly discoverable Journey.
 *
 * This model is intentionally shaped around traveller discovery rather than
 * backend persistence.
 *
 * It is the frontend contract consumed by:
 *
 * - public Journey API clients;
 * - Journey marketplace cards;
 * - Journey detail pages;
 * - the public Marketplace read boundary;
 * - future Journey discovery surfaces.
 *
 * It is NOT:
 *
 * - a Prisma model;
 * - a domain aggregate;
 * - a persistence DTO;
 * - an internal Journey entity;
 * - a provider aggregate;
 * - a replacement for the backend public-read composition boundary.
 */
export interface PublicJourney {
  /**
   * Stable public identifier used by public Journey URLs and public Journey
   * navigation.
   *
   * Example:
   *
   *     /journeys/SM-JOURNEY-004
   */
  readonly publicId: string;

  /**
   * Public provider representation for this Journey.
   *
   * The provider is derived from the Journey's provider reference by the
   * backend public-read boundary.
   *
   * It contains public Traveller and Trust projections without making either
   * Traveller or Trust the owner of the Journey.
   *
   * The internal provider public identifier is intentionally not exposed
   * separately in this read model.
   */
  readonly provider: PublicJourneyProvider;

  /**
   * Public Journey route.
   *
   * Contains the origin, destination, and publicly discoverable intermediate
   * waypoints.
   */
  readonly route: PublicJourneyRoute;

  /**
   * Public Journey schedule.
   *
   * Contains departure and, where available, public arrival information.
   */
  readonly schedule: PublicJourneySchedule;

  /**
   * Public vehicle information associated with the Journey.
   *
   * Only information appropriate for public discovery belongs in this model.
   */
  readonly vehicle: PublicJourneyVehicle;

  /**
   * Current public passenger-seat availability.
   *
   * This represents the capacity information relevant to marketplace
   * discovery, not internal booking state.
   */
  readonly capacity: PublicJourneyCapacity;

  /**
   * Public price information for the Journey.
   *
   * Internal settlement and accounting information remains outside this
   * marketplace contract.
   */
  readonly pricing: PublicJourneyPricing;

  /**
   * Public traveller and Journey preferences relevant to discovery and
   * booking decisions.
   */
  readonly preferences: PublicJourneyPreferences;

  /**
   * Public Journey media/assets.
   *
   * Only public asset representations belong here.
   *
   * Internal asset storage details remain outside the marketplace contract.
   */
  readonly assets: readonly PublicJourneyAsset[];
}

