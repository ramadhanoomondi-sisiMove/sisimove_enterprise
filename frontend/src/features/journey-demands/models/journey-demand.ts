// -----------------------------------------------------------------------------
// sisiMove — Journey Demand
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey Demand.
//
// A Journey Demand represents:
//
// "I am looking for a journey along this route, within this time window,
//  with this seat requirement and these pricing preferences."
//
// This is a frontend feature model. It is not a Prisma model, persistence
// record, domain entity, or aggregate.
//
// Public discovery should use an intentionally reduced read model rather than
// blindly exposing every field in this model.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacity } from './journey-demand-capacity';
import type { JourneyDemandPricing } from './journey-demand-pricing';
import type { JourneyDemandRoute } from './journey-demand-route';
import type { JourneyDemandSchedule } from './journey-demand-schedule';

// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

export type JourneyDemandStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'MATCHED'
  | 'CONVERTED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

// -----------------------------------------------------------------------------
// Journey Demand
// -----------------------------------------------------------------------------

export interface JourneyDemand {
  /**
   * Public identifier of the Journey Demand.
   */
  publicId: string;

  /**
   * Public identifier of the traveller requesting the journey.
   *
   * This is a cross-domain public reference only.
   *
   * It does not make Identity the owner of Journey Demand data.
   */
  requesterPublicId: string;

  /**
   * Current lifecycle status.
   *
   * DRAFT is an authenticated/private workflow state and must not be exposed
   * through public discovery.
   */
  status: JourneyDemandStatus;

  /**
   * Requested travel route.
   */
  route: JourneyDemandRoute;

  /**
   * Requested travel schedule.
   */
  schedule: JourneyDemandSchedule;

  /**
   * Requested seat capacity.
   */
  capacity: JourneyDemandCapacity;

  /**
   * Requester's pricing preferences.
   */
  pricing: JourneyDemandPricing;

  /**
   * Indicates whether the demand is currently active.
   *
   * This is authoritative backend state and should not be derived on the
   * frontend from status alone.
   */
  isActive: boolean;

  /**
   * Indicates whether the demand can currently participate in matching.
   *
   * This may differ from lifecycle status because matchability can depend on
   * backend business rules.
   */
  isMatchable: boolean;
}