// -----------------------------------------------------------------------------
// Public Traveller Activity
// -----------------------------------------------------------------------------
//
// Public activity performed by a traveller within SisiMove discovery.
//
// A traveller may publicly appear as:
//
// - JOURNEY — sharing a publicly discoverable journey
// - DEMAND  — looking for a journey through a publicly discoverable demand
//
// This model is intentionally independent of backend domain entities,
// persistence models, and internal lifecycle state.
//
// It is a frontend-facing public read-model contract.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

import type { PublicTravellerDemand } from './public-traveller-demand';
import type { PublicTravellerJourney } from './public-traveller-journey';


// -----------------------------------------------------------------------------
// Activity Type
// -----------------------------------------------------------------------------

/**
 * Public activity types displayed in traveller discovery.
 *
 * The values represent product-level public activity concepts and are not
 * required to match backend domain enum names.
 */
export type PublicTravellerActivityType =
  | 'JOURNEY'
  | 'DEMAND';


// -----------------------------------------------------------------------------
// Activity Base
// -----------------------------------------------------------------------------

/**
 * Common public activity metadata.
 *
 * Journey-specific and demand-specific information is represented by the
 * corresponding discriminated-union members below.
 */
export interface PublicTravellerActivityBase {
  /**
   * Opaque public activity identifier.
   *
   * This identifier is supplied by the public read-model/API boundary and
   * must never expose an internal database identifier.
   */
  publicId: string;

  /**
   * Public activity type.
   */
  type: PublicTravellerActivityType;

  /**
   * Whether this activity is currently eligible for public discovery.
   *
   * This is a server-authoritative read-model property. It must not be
   * interpreted as or reconstructed from the underlying domain lifecycle
   * status by the frontend.
   */
  isActive: boolean;
}


// -----------------------------------------------------------------------------
// Journey Activity
// -----------------------------------------------------------------------------

/**
 * Public traveller activity representing a publicly discoverable journey.
 *
 * The detailed journey representation is provided by
 * PublicTravellerJourney.
 */
export interface PublicTravellerJourneyActivity
  extends PublicTravellerActivityBase {
  /**
   * Discriminator for journey activity.
   */
  type: 'JOURNEY';

  /**
   * Public journey representation.
   */
  journey: PublicTravellerJourney;
}


// -----------------------------------------------------------------------------
// Demand Activity
// -----------------------------------------------------------------------------

/**
 * Public traveller activity representing a publicly discoverable
 * journey demand.
 *
 * The detailed demand representation is provided by
 * PublicTravellerDemand.
 */
export interface PublicTravellerDemandActivity
  extends PublicTravellerActivityBase {
  /**
   * Discriminator for demand activity.
   */
  type: 'DEMAND';

  /**
   * Public journey-demand representation.
   */
  demand: PublicTravellerDemand;
}


// -----------------------------------------------------------------------------
// Public Traveller Activity Union
// -----------------------------------------------------------------------------

/**
 * Discriminated union of all public traveller activities.
 *
 * The `type` discriminator allows the UI to safely determine whether the
 * activity should be rendered as a journey or journey-demand experience.
 */
export type PublicTravellerActivity =
  | PublicTravellerJourneyActivity
  | PublicTravellerDemandActivity;