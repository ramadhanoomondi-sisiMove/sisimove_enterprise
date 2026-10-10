// -----------------------------------------------------------------------------
// sisiMove — Authenticated My Journey Response
// -----------------------------------------------------------------------------

import type { JourneyBookingResponse } from '../../../journey-booking/presentation/rest/mappers/journey-booking-response.mapper';

import type { JourneyBoardingResponse } from '../../../journey-boarding/presentation/rest/mappers/journey-boarding-response.mapper';

export interface MyJourneyResponse {
  readonly publicId: string;

  readonly status: string;

  readonly publishedAt: Date | null;

  readonly startedAt: Date | null;

  readonly completionRequestedAt: Date | null;

  readonly completedAt: Date | null;

  readonly cancelledAt: Date | null;

  readonly expiredAt: Date | null;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  readonly route: MyJourneyRouteResponse | null;

  readonly schedule: MyJourneyScheduleResponse | null;

  readonly vehicle: MyJourneyVehicleResponse | null;

  readonly capacity: MyJourneyCapacityResponse | null;

  readonly pricing: MyJourneyPricingResponse | null;

  readonly preferences: MyJourneyPreferencesResponse | null;

  readonly assets: readonly MyJourneyAssetResponse[];

  /**
   * All bookings associated with this Journey.
   */
  readonly bookings: readonly JourneyBookingResponse[];

  /**
   * Number of unread messages associated with this Journey
   * for the authenticated member.
   *
   * Calculated by the application layer using the existing
   * Messaging domain and repository infrastructure.
   */
  readonly unreadMessagesCount: number;

  /**
   * Physical boarding workflow, including participants and event history.
   *
   * Null when no Journey Boarding exists.
   */
  readonly boarding: JourneyBoardingResponse | null;
}

// -----------------------------------------------------------------------------
// Route Response
// -----------------------------------------------------------------------------

export interface MyJourneyRouteResponse {
  readonly origin: MyJourneyLocationResponse;

  readonly destination: MyJourneyLocationResponse;

  readonly waypoints: readonly MyJourneyWaypointResponse[];
}

// -----------------------------------------------------------------------------
// Location Response
// -----------------------------------------------------------------------------

export interface MyJourneyLocationResponse {
  readonly name: string;

  readonly latitude: number;

  readonly longitude: number;
}

// -----------------------------------------------------------------------------
// Waypoint Response
// -----------------------------------------------------------------------------

export interface MyJourneyWaypointResponse {
  readonly publicId: string;

  readonly type: string;

  readonly sequence: number;

  readonly name: string;

  readonly latitude: number;

  readonly longitude: number;

  readonly pickupAllowed: boolean;

  readonly dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Schedule Response
// -----------------------------------------------------------------------------

export interface MyJourneyScheduleResponse {
  readonly publicId: string;

  readonly departureAt: Date;

  readonly arrivalAt: Date | null;

  readonly timezone: string;
}

// -----------------------------------------------------------------------------
// Vehicle Asset Reference
// -----------------------------------------------------------------------------

export interface MyJourneyAssetReferenceResponse {
  readonly publicId: string;

  readonly url: string;
}

// -----------------------------------------------------------------------------
// Vehicle Response
// -----------------------------------------------------------------------------

export interface MyJourneyVehicleResponse {
  readonly publicId: string;

  readonly make: string;

  readonly model: string;

  readonly year: number | null;

  readonly color: string | null;

  readonly registration: string | null;

  readonly assetPublicId: string | null;

  readonly asset: MyJourneyAssetReferenceResponse | null;
}

// -----------------------------------------------------------------------------
// Capacity Response
// -----------------------------------------------------------------------------

export interface MyJourneyCapacityResponse {
  readonly publicId: string;

  readonly totalSeats: number;

  readonly bookedSeats: number;

  readonly availableSeats: number;
}

// -----------------------------------------------------------------------------
// Pricing Response
// -----------------------------------------------------------------------------

export interface MyJourneyPricingResponse {
  readonly publicId: string;

  readonly amount: number;

  readonly currency: string;
}

// -----------------------------------------------------------------------------
// Preferences Response
// -----------------------------------------------------------------------------

export interface MyJourneyPreferencesResponse {
  readonly publicId: string;

  readonly smoking: string;

  readonly pets: string;

  readonly luggage: string;

  readonly conversation: string;

  readonly music: string;
}

// -----------------------------------------------------------------------------
// Journey Asset Response
// -----------------------------------------------------------------------------

export interface MyJourneyAssetResponse {
  readonly publicId: string;

  readonly assetPublicId: string;

  readonly type: string;

  readonly sortOrder: number;
}
