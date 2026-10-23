
'use client';

/**
 * sisiMove — Admin Booking Filter Query Hooks
 *
 * Retrieves existing bookings using supported backend filters.
 *
 * Responsibilities:
 * - Fetch bookings by journey.
 * - Fetch bookings by passenger.
 * - Fetch bookings by booking status.
 * - Fetch a booking associated with a transaction.
 * - Reuse canonical React Query keys.
 *
 * Booking creation is intentionally excluded.
 */

import { useQuery } from '@tanstack/react-query';

import { adminBookingsApi } from '../api/admin-bookings.api';
import { adminBookingQueryKeys } from './useAdminMutations';

const ADMIN_BOOKING_FILTER_STALE_TIME = 30_000;

export function useAdminBookingsByJourney(journeyPublicId?: string) {
  const id = journeyPublicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBookingQueryKeys.byJourney(id),
    queryFn: () => adminBookingsApi.getByJourney(id),
    enabled: id.length > 0,
    staleTime: ADMIN_BOOKING_FILTER_STALE_TIME,
  });
}

export function useAdminBookingsByPassenger(passengerPublicId?: string) {
  const id = passengerPublicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBookingQueryKeys.byPassenger(id),
    queryFn: () => adminBookingsApi.getByPassenger(id),
    enabled: id.length > 0,
    staleTime: ADMIN_BOOKING_FILTER_STALE_TIME,
  });
}

export function useAdminBookingsByStatus(status?: string) {
  const normalizedStatus = status?.trim() ?? '';

  return useQuery({
    queryKey: adminBookingQueryKeys.byStatus(normalizedStatus),
    queryFn: () => adminBookingsApi.getByStatus(normalizedStatus),
    enabled: normalizedStatus.length > 0,
    staleTime: ADMIN_BOOKING_FILTER_STALE_TIME,
  });
}

export function useAdminBookingsByJourneyAndPassenger(
  journeyPublicId?: string,
  passengerPublicId?: string,
) {
  const journeyId = journeyPublicId?.trim() ?? '';
  const passengerId = passengerPublicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBookingQueryKeys.byJourneyAndPassenger(
      journeyId,
      passengerId,
    ),
    queryFn: () =>
      adminBookingsApi.getByJourneyAndPassenger(journeyId, passengerId),
    enabled: journeyId.length > 0 && passengerId.length > 0,
    staleTime: ADMIN_BOOKING_FILTER_STALE_TIME,
  });
}

export function useAdminBookingByTransaction(transactionPublicId?: string) {
  const id = transactionPublicId?.trim() ?? '';

  return useQuery({
    queryKey: adminBookingQueryKeys.byTransaction(id),
    queryFn: () => adminBookingsApi.getByTransaction(id),
    enabled: id.length > 0,
    staleTime: ADMIN_BOOKING_FILTER_STALE_TIME,
  });
}
