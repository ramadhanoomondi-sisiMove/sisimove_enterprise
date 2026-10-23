
import {
  AdminBookingPaymentStatus,
  AdminBookingSortDirection,
  AdminBookingSortField,
  AdminBookingStatus,
} from './admin-booking.enums';

/**
 * sisiMove — Admin Booking Filters
 *
 * Represents the filter, pagination, and sorting state used by the
 * global admin bookings directory.
 *
 * This model defines frontend state only. The API adapter must translate
 * these fields to the parameters actually supported by the backend.
 */
export interface AdminBookingFilters {
  /** Search by booking public ID or other supported searchable identifiers. */
  search?: string;

  /** Filter by booking lifecycle status. */
  status?: AdminBookingStatus | null;

  /** Filter by payment status. */
  paymentStatus?: AdminBookingPaymentStatus | null;

  /** Optional journey scope. */
  journeyPublicId?: string;

  /** Optional passenger scope. */
  passengerPublicId?: string;

  /** Departure date range, represented as ISO date strings. */
  departureFrom?: string;
  departureTo?: string;

  /** Booking creation date range, represented as ISO date strings. */
  createdFrom?: string;
  createdTo?: string;

  /** One-based page number. */
  page: number;

  /** Number of bookings requested per page. */
  pageSize: number;

  /** Field used to sort the directory. */
  sortBy: AdminBookingSortField;

  /** Sort order. */
  sortDirection: AdminBookingSortDirection;
}

/** Default frontend state for the admin bookings directory. */
export const DEFAULT_ADMIN_BOOKING_FILTERS: AdminBookingFilters = {
  search: '',
  status: null,
  paymentStatus: null,
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};
