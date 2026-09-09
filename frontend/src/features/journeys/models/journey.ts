// -----------------------------------------------------------------------------
// SisiMove — Journey
// -----------------------------------------------------------------------------
//
// Public/frontend representation of a Journey.
//
// This is a frontend read model. It is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
// - backend application services
//
// The model contains only information required for public Journey discovery
// and presentation.
//
// It must not expose:
// - private booking information
// - financial information
// - Commercial-domain calculations
// - wallet information
// - platform fees or commissions
// - provider earnings
// - private traveller contact information
// - precise private meeting/pickup information
// - sensitive verification information
// - internal persistence identifiers
//
// The backend owns the authoritative Journey lifecycle, availability, pricing,
// and booking rules. The frontend consumes the resulting public projection
// through the Journey API.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Components
// -----------------------------------------------------------------------------

import type { JourneyAsset } from './journey-asset';
import type { JourneyCapacity } from './journey-capacity';
import type { JourneyPreferences } from './journey-preferences';
import type { JourneyPricing } from './journey-pricing';
import type { JourneyRoute } from './journey-route';
import type { JourneySchedule } from './journey-schedule';
import type { JourneyVehicle } from './journey-vehicle';

// -----------------------------------------------------------------------------
// Journey Status
// -----------------------------------------------------------------------------
//
// Public lifecycle state.
//
// This is intentionally a frontend representation rather than a direct copy
// of the backend state machine. The backend may maintain additional internal
// states or transitions that are never exposed through the public Journey
// projection.
//
// The frontend must not use this union to reconstruct backend business rules.
// -----------------------------------------------------------------------------

export type JourneyStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'FULL'
  | 'BOARDING'
  | 'IN_PROGRESS'
  | 'COMPLETION_PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

export interface Journey {
  /**
   * Stable public identifier of the Journey.
   *
   * This identifier is safe to use in public routes and frontend API calls.
   */
  publicId: string;

  /**
   * Stable public identifier of the traveller/provider associated with the
   * Journey.
   *
   * This is an opaque cross-domain public reference.
   *
   * The frontend must not assume ownership of Identity data or resolve private
   * Identity information directly from this identifier.
   */
  providerPublicId: string;

  /**
   * Public lifecycle status of the Journey.
   *
   * The backend is authoritative for this value.
   *
   * The frontend must not derive business rules from this field alone.
   */
  status: JourneyStatus;

  /**
   * Public Journey route.
   *
   * Only publicly discoverable corridor information belongs in this object.
   *
   * Private or exact meeting-point information must never be included in the
   * public route projection.
   */
  route: JourneyRoute;

  /**
   * Public Journey schedule.
   *
   * The backend is authoritative for the published schedule.
   */
  schedule: JourneySchedule;

  /**
   * Public vehicle information.
   *
   * Null when a vehicle is not assigned or public vehicle information is not
   * available.
   *
   * Registration, ownership, compliance, and other sensitive vehicle
   * information must not be exposed here.
   */
  vehicle: JourneyVehicle | null;

  /**
   * Public Journey capacity and current seat availability.
   *
   * The backend is authoritative for these values.
   */
  capacity: JourneyCapacity;

  /**
   * Public price per seat.
   *
   * The amount is represented in the smallest unit of the specified currency.
   *
   * This contains Journey-facing pricing only. It does not expose:
   * - booking fees
   * - commissions
   * - Commercial rules
   * - settlement amounts
   * - platform revenue
   * - provider earnings
   * - wallet balances
   * - payment information
   */
  pricing: JourneyPricing;

  /**
   * Public traveller preferences for this Journey.
   *
   * Null when the Journey has no public preferences.
   *
   * These values are discovery/presentation information and must not be
   * interpreted as Booking authorization or financial rules.
   */
  preferences: JourneyPreferences | null;

  /**
   * Public assets associated with the Journey.
   *
   * Every asset returned here must already have passed the backend's public
   * visibility rules and be safe for public presentation.
   */
  assets: JourneyAsset[];

  /**
   * Indicates whether this Journey is currently active in public discovery.
   *
   * This is a backend-projected value.
   *
   * The frontend must not derive this value from `status`.
   */
  isActive: boolean;

  /**
   * Indicates whether this Journey currently accepts bookings.
   *
   * This is a backend-projected value.
   *
   * The frontend must not infer this value from `status`, `capacity`, or any
   * other field.
   *
   * The actual booking operation belongs to the Booking domain.
   */
  isBookable: boolean;
}