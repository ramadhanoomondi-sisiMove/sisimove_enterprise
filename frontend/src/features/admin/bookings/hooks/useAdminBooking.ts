
'use client';

/**
 * sisiMove — Admin Booking Detail Query Hook
 *
 * Retrieves one existing journey booking for the admin detail view.
 *
 * Responsibilities:
 * - Fetch a booking by its public ID.
 * - Use the canonical admin booking detail query key.
 * - Avoid requests when the public ID is missing or invalid.
 * - Reuse the shared React Query cache.
 *
 * Non-responsibilities:
 * - Creating bookings.
 * - Updating booking data directly.
 * - Performing booking lifecycle actions.
 *
 * Lifecycle actions belong in useAdminMutations.ts.
 */

import { useQuery } from '@tanstack/react-query';

import { adminBookingsApi } from '../api/admin-bookings.api';
import { adminBookingQueryKeys } from './useAdminMutations';

const ADMIN_BOOKING_STALE_TIME = 30_000;

export function useAdminBooking(journeyBookingPublicId?: string) {
  const normalizedPublicId = journeyBookingPublicId?.trim() ?? '';
  const isValidPublicId = normalizedPublicId.length > 0;

  return useQuery({
    queryKey: adminBookingQueryKeys.detail(normalizedPublicId),
    queryFn: () => adminBookingsApi.getByPublicId(normalizedPublicId),
    enabled: isValidPublicId,
    staleTime: ADMIN_BOOKING_STALE_TIME,
  });
}
