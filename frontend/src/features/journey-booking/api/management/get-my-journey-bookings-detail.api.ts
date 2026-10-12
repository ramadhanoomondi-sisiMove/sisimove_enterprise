
// src/features/journey-booking/api/management/get-my-journey-bookings-detail.api.ts

import { authenticatedApiClient } from '@/features/authentication/http';

import type {
  JourneyBookingDetail,
  JourneyBookingDetailResponse,
  JourneyBookingActivitySummary,
} from '../../models/journey-booking-detail';

// -----------------------------------------------------------------------------
// Collection Item
// -----------------------------------------------------------------------------

/**
 * A booking and its backend-provided Journey activity summary.
 */
export interface MyJourneyBookingItem {
  readonly booking: JourneyBookingDetail;
  readonly activitySummary: JourneyBookingActivitySummary | null;
}

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export type GetMyJourneyBookingDetailsResponse =
  readonly MyJourneyBookingItem[];

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Fetches detailed bookings for the authenticated passenger.
 *
 * Preserves the activity summary returned by the backend instead of
 * discarding it when extracting the booking.
 */
export async function getMyJourneyBookingDetails(): Promise<
  GetMyJourneyBookingDetailsResponse
> {
  return authenticatedApiClient.get<
    readonly JourneyBookingDetailResponse[]
  >('/journey-bookings/mine/detail');
}
