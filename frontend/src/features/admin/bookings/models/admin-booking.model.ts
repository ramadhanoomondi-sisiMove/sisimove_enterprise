//src/features/admin/bookings/models/admin-bookings.model.ts
/**
 * sisiMove — Admin Booking Model
 *
 * Data contracts for the admin bookings feature.
 *
 * The booking aggregate owns its snapshot, pricing, payment,
 * and cancellation components.
 *
 * These are frontend-owned contracts. They do not import backend
 * implementation files.
 */

import type {
  AdminBookingCancellationReason,
  AdminBookingPaymentStatus,
  AdminBookingStatus,
} from './admin-booking.enums';

// -----------------------------------------------------------------------------
// Coordinates
// -----------------------------------------------------------------------------

export interface AdminBookingCoordinates {
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Historical vehicle snapshot
// -----------------------------------------------------------------------------

export interface AdminBookingSnapshotVehicle {
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  registration: string | null;
}

// -----------------------------------------------------------------------------
// Historical booking snapshot
// -----------------------------------------------------------------------------

export interface AdminBookingSnapshot {
  originName: string;
  destinationName: string;
  originCoordinates: AdminBookingCoordinates;
  destinationCoordinates: AdminBookingCoordinates;
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
  vehicle: AdminBookingSnapshotVehicle | null;
}

// -----------------------------------------------------------------------------
// Booking pricing
// -----------------------------------------------------------------------------

export interface AdminBookingPricing {
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;
  currency: string;
}

// -----------------------------------------------------------------------------
// Booking payment
// -----------------------------------------------------------------------------

export interface AdminBookingPayment {
  status: AdminBookingPaymentStatus;
  amount: number;
  currency: string;
  transactionPublicId: string | null;
  authorizedAt: string | null;
  capturedAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  failureReason: string | null;
}

// -----------------------------------------------------------------------------
// Booking cancellation
// -----------------------------------------------------------------------------

export interface AdminBookingCancellation {
  reason: AdminBookingCancellationReason;
  cancelledByPublicId: string | null;
  reasonDescription: string | null;
  cancelledAt: string;
}

// -----------------------------------------------------------------------------
// Normalized frontend booking model
// -----------------------------------------------------------------------------

export interface AdminBooking {
  /** Public booking identifier used by frontend routes. */
  publicId: string;

  /** Cross-domain public identifier for the journey. */
  journeyPublicId: string;

  /** Cross-domain public identifier for the passenger. */
  passengerPublicId: string;

  status: AdminBookingStatus;
  seats: number;

  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  expiredAt: string | null;

  /** Optimistic concurrency/version field. */
  version: number;

  snapshot: AdminBookingSnapshot | null;
  pricing: AdminBookingPricing | null;
  payment: AdminBookingPayment | null;
  cancellation: AdminBookingCancellation | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Frontend API response contracts
// -----------------------------------------------------------------------------

/**
 * Date values arrive from JSON APIs as strings.
 *
 * The backend mapper declares these fields as Date objects, but JSON
 * serialization converts them to strings. The frontend mapper converts
 * valid date strings into the normalized frontend model.
 */

export interface AdminBookingSnapshotApiResponse {
  publicId: string;
  originName: string;
  destinationName: string;
  originCoordinates: AdminBookingCoordinates;
  destinationCoordinates: AdminBookingCoordinates;
  departureAt: string;
  arrivalAt?: string;
  timezone: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleRegistration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingPricingApiResponse {
  publicId: string;
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingPaymentApiResponse {
  publicId: string;
  status: string;
  amount: number;
  currency: string;
  transactionPublicId?: string;
  authorizedAt?: string;
  capturedAt?: string;
  failedAt?: string;
  refundedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingCancellationApiResponse {
  publicId: string;
  reason: string;
  cancelledByPublicId?: string;
  reasonDescription?: string;
  cancelledAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mirrors the fields exposed by the backend JourneyBookingResponse
 * mapper, using JSON-compatible date strings.
 *
 * Optional fields reflect backend fields declared as undefined when
 * no value exists. The normalized AdminBooking model uses null instead.
 */
export interface AdminBookingApiResponse {
  publicId: string;
  journeyPublicId: string;
  passengerPublicId: string;
  status: string;
  seats: number;

  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  expiredAt?: string;

  version: number;

  snapshot?: AdminBookingSnapshotApiResponse;
  pricing?: AdminBookingPricingApiResponse;
  payment?: AdminBookingPaymentApiResponse;
  cancellation?: AdminBookingCancellationApiResponse;

  createdAt: string;
  updatedAt: string;
}

/**
 * Backward-compatible alias for a single booking API response.
 */
export type AdminBookingResponseModel = AdminBookingApiResponse;

/**
 * Paginated global-admin booking response.
 *
 * This shape is provisional until the actual global-admin endpoint
 * confirms its pagination contract.
 */
export interface AdminBookingsResponseModel {
  items: AdminBookingApiResponse[];
  total: number;
  page: number;
  pageSize: number;
}
