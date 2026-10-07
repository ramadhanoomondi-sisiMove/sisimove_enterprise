// frontend/src/features/journey-booking/api/journey-bookings/create-journey-booking-snapshot.api.ts

import { authenticatedApiClient } from '@/features/authentication/http';
import type { JourneyBooking } from '../../models/journey-booking';

export interface CreateJourneyBookingSnapshotCoordinates {
  latitude: number;
  longitude: number;
}

export interface CreateJourneyBookingSnapshotRequest {
  originName: string;
  destinationName: string;
  originCoordinates: CreateJourneyBookingSnapshotCoordinates;
  destinationCoordinates: CreateJourneyBookingSnapshotCoordinates;
  departureAt: string;
  timezone: string;
  arrivalAt?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleRegistration?: string;
  correlationId?: string;
  causationId?: string;
}

export type CreateJourneyBookingSnapshotResponse = JourneyBooking;

export async function createJourneyBookingSnapshot(
  journeyBookingPublicId: string,
  request: CreateJourneyBookingSnapshotRequest,
): Promise<CreateJourneyBookingSnapshotResponse> {
  const bookingPublicId = journeyBookingPublicId.trim();

  if (!bookingPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  const originName = request.originName.trim();
  const destinationName = request.destinationName.trim();
  const timezone = request.timezone.trim();
  const departureAt = request.departureAt.trim();

  if (!originName) {
    throw new TypeError('Journey Booking origin name is required.');
  }

  if (!destinationName) {
    throw new TypeError(
      'Journey Booking destination name is required.',
    );
  }

  if (!timezone) {
    throw new TypeError('Journey Booking timezone is required.');
  }

  if (!departureAt) {
    throw new TypeError(
      'Journey Booking departure time is required.',
    );
  }

  return authenticatedApiClient.post<CreateJourneyBookingSnapshotResponse>(
    `/journey-bookings/${encodeURIComponent(bookingPublicId)}/snapshot`,
    {
      originName,
      destinationName,
      originCoordinates: request.originCoordinates,
      destinationCoordinates: request.destinationCoordinates,
      departureAt,
      timezone,
      arrivalAt: request.arrivalAt,
      vehicleMake: request.vehicleMake,
      vehicleModel: request.vehicleModel,
      vehicleYear: request.vehicleYear,
      vehicleColor: request.vehicleColor,
      vehicleRegistration: request.vehicleRegistration,
      correlationId: request.correlationId,
      causationId: request.causationId,
    },
  );
}