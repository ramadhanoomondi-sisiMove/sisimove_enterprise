
'use client';

/**
 * sisiMove — Admin Booking Query Hooks
 *
 * Retrieves existing journey bookings and booking counts for the admin area.
 *
 * Responsibilities:
 * - Fetch all journey bookings.
 * - Fetch the total booking count.
 * - Use canonical admin booking query keys.
 * - Share cached results with booking details, filters, and mutations.
 *
 * Booking creation is intentionally excluded.
 * Backend authorization remains authoritative.
 */

import { useQuery } from '@tanstack/react-query';

import { adminBookingsApi } from '../api/admin-bookings.api';

import { adminBookingQueryKeys } from './useAdminMutations';

// -----------------------------------------------------------------------------
// Query configuration
// -----------------------------------------------------------------------------

const ADMIN_BOOKINGS_STALE_TIME = 30_000;

// -----------------------------------------------------------------------------
// Get all admin bookings
// -----------------------------------------------------------------------------

/**
 * Retrieves the existing journey bookings available to the authorized admin.
 *
 * The API currently returns a bare array rather than a paginated response.
 */
export function useAdminBookings() {
  return useQuery({
    queryKey: adminBookingQueryKeys.list(),

    queryFn: () => adminBookingsApi.getAll(),

    staleTime: ADMIN_BOOKINGS_STALE_TIME,
  });
}

// -----------------------------------------------------------------------------
// Get total booking count
// -----------------------------------------------------------------------------

/**
 * Retrieves the total number of journey booking records.
 *
 * This uses the backend count endpoint rather than calculating the count
 * from the currently loaded booking collection.
 */
export function useAdminBookingCount() {
  return useQuery({
    queryKey: adminBookingQueryKeys.count(),

    queryFn: () => adminBookingsApi.count(),

    staleTime: ADMIN_BOOKINGS_STALE_TIME,
  });
}
