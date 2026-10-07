// src/features/journey-booking/api/management/get-my-journey-bookings-detail.api.ts

import { authenticatedApiClient } from '@/features/authentication/http';
import type {
  JourneyBookingDetail,
  JourneyBookingDetailResponse,
} from '../../models/journey-booking-detail';

export type GetMyJourneyBookingDetailsResponse =
  readonly JourneyBookingDetail[];

export async function getMyJourneyBookingDetails(): Promise<
  GetMyJourneyBookingDetailsResponse
> {
  const response =
    await authenticatedApiClient.get<
      readonly JourneyBookingDetailResponse[]
    >('/journey-bookings/mine/detail');

  return response.map((item) => item.booking);
}