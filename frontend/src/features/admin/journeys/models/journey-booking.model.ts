
/**
 * sisiMove — Journey Booking Model
 *
 * Frontend types for the Journey Booking API response.
 *
 * Optional backend components are represented as nullable frontend fields.
 */

// -----------------------------------------------------------------------------
// Booking status
// -----------------------------------------------------------------------------

export type JourneyBookingStatus = string;

// -----------------------------------------------------------------------------
// Booking snapshot
// -----------------------------------------------------------------------------

export interface JourneyBookingCoordinates {
  latitude: number;
  longitude: number;
}

export interface JourneyBookingSnapshotVehicle {
  make: string | null;
  model: string | null;
  year: number | null;
  color: string | null;
  registration: string | null;
}

export interface JourneyBookingSnapshot {
  originName: string;
  destinationName: string;
  originCoordinates: JourneyBookingCoordinates;
  destinationCoordinates: JourneyBookingCoordinates;
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
  vehicle: JourneyBookingSnapshotVehicle | null;
}

// -----------------------------------------------------------------------------
// Booking pricing
// -----------------------------------------------------------------------------

export interface JourneyBookingPricing {
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

export type JourneyBookingPaymentStatus = string;

export interface JourneyBookingPayment {
  status: JourneyBookingPaymentStatus;
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

export interface JourneyBookingCancellation {
  reason: string;
  cancelledByPublicId: string | null;
  reasonDescription: string | null;
  cancelledAt: string;
}

// -----------------------------------------------------------------------------
// Journey booking
// -----------------------------------------------------------------------------

export interface JourneyBooking {
  publicId: string;
  journeyPublicId: string;
  passengerPublicId: string;
  status: JourneyBookingStatus;
  seats: number;

  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  expiredAt: string | null;

  version: number;

  snapshot: JourneyBookingSnapshot | null;
  pricing: JourneyBookingPricing | null;
  payment: JourneyBookingPayment | null;
  cancellation: JourneyBookingCancellation | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API response aliases
// -----------------------------------------------------------------------------

export type JourneyBookingResponseModel = JourneyBooking;

export interface JourneyBookingsResponseModel {
  items: JourneyBooking[];
  total: number;
  page: number;
  pageSize: number;
}
