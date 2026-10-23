
/**
 * sisiMove — Journey Booking Response Mapper
 *
 * Maps backend JourneyBookingResponse data into frontend-friendly models.
 *
 * Responsibilities:
 * - Normalize Date values to ISO strings.
 * - Preserve optional snapshot, pricing, payment, and cancellation data.
 * - Preserve backend public identifiers and field names.
 * - Represent missing optional components as null.
 * - Avoid inventing missing data.
 */

import type {
  JourneyBooking,
  JourneyBookingCancellation,
  JourneyBookingPayment,
  JourneyBookingPricing,
  JourneyBookingSnapshot,
  JourneyBookingSnapshotVehicle,
} from '../models/journey-booking.model';

// -----------------------------------------------------------------------------
// Backend response types
// -----------------------------------------------------------------------------

type BackendDate = Date | string;

interface BookingCoordinatesResponse {
  latitude: number;
  longitude: number;
}

interface BookingSnapshotResponse {
  publicId: string;
  originName: string;
  destinationName: string;
  originCoordinates: BookingCoordinatesResponse;
  destinationCoordinates: BookingCoordinatesResponse;
  departureAt: BackendDate;
  arrivalAt: BackendDate | undefined;
  timezone: string;
  vehicleMake: string | undefined;
  vehicleModel: string | undefined;
  vehicleYear: number | undefined;
  vehicleColor: string | undefined;
  vehicleRegistration: string | undefined;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface BookingPricingResponse {
  publicId: string;
  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface BookingPaymentResponse {
  publicId: string;
  status: string;
  amount: number;
  currency: string;
  transactionPublicId: string | undefined;
  authorizedAt: BackendDate | undefined;
  capturedAt: BackendDate | undefined;
  failedAt: BackendDate | undefined;
  refundedAt: BackendDate | undefined;
  failureReason: string | undefined;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

interface BookingCancellationResponse {
  publicId: string;
  reason: string;
  cancelledByPublicId: string | undefined;
  reasonDescription: string | undefined;
  cancelledAt: BackendDate;
  createdAt: BackendDate;
  updatedAt: BackendDate;
}

/**
 * Mirrors the supplied backend JourneyBookingResponse.
 */
export interface JourneyBookingBackendResponse {
  publicId: string;
  journeyPublicId: string;
  passengerPublicId: string;

  status: string;
  seats: number;

  confirmedAt: BackendDate | undefined;
  cancelledAt: BackendDate | undefined;
  completedAt: BackendDate | undefined;
  expiredAt: BackendDate | undefined;

  version: number;

  snapshot: BookingSnapshotResponse | undefined;
  pricing: BookingPricingResponse | undefined;
  payment: BookingPaymentResponse | undefined;
  cancellation: BookingCancellationResponse | undefined;

  createdAt: BackendDate;
  updatedAt: BackendDate;
}

// -----------------------------------------------------------------------------
// Date conversion
// -----------------------------------------------------------------------------

function mapDate(value: BackendDate): string {
  return value instanceof Date ? value.toISOString() : value;
}

function mapOptionalDate(
  value: BackendDate | undefined,
): string | null {
  return value === undefined ? null : mapDate(value);
}

// -----------------------------------------------------------------------------
// Snapshot mapper
// -----------------------------------------------------------------------------

function mapSnapshotVehicle(
  snapshot: BookingSnapshotResponse,
): JourneyBookingSnapshotVehicle {
  return {
    make: snapshot.vehicleMake ?? null,
    model: snapshot.vehicleModel ?? null,
    year: snapshot.vehicleYear ?? null,
    color: snapshot.vehicleColor ?? null,
    registration: snapshot.vehicleRegistration ?? null,
  };
}

function mapSnapshot(
  snapshot: BookingSnapshotResponse,
): JourneyBookingSnapshot {
  return {
    originName: snapshot.originName,
    destinationName: snapshot.destinationName,
    originCoordinates: { ...snapshot.originCoordinates },
    destinationCoordinates: { ...snapshot.destinationCoordinates },
    departureAt: mapDate(snapshot.departureAt),
    arrivalAt: mapOptionalDate(snapshot.arrivalAt),
    timezone: snapshot.timezone,
    vehicle: mapSnapshotVehicle(snapshot),
  };
}

// -----------------------------------------------------------------------------
// Pricing mapper
// -----------------------------------------------------------------------------

function mapPricing(
  pricing: BookingPricingResponse,
): JourneyBookingPricing {
  return {
    pricePerSeat: pricing.pricePerSeat,
    seats: pricing.seats,
    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    adjustmentAmount: pricing.adjustmentAmount,
    totalAmount: pricing.totalAmount,
    currency: pricing.currency,
  };
}

// -----------------------------------------------------------------------------
// Payment mapper
// -----------------------------------------------------------------------------

function mapPayment(
  payment: BookingPaymentResponse,
): JourneyBookingPayment {
  return {
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    transactionPublicId: payment.transactionPublicId ?? null,
    authorizedAt: mapOptionalDate(payment.authorizedAt),
    capturedAt: mapOptionalDate(payment.capturedAt),
    failedAt: mapOptionalDate(payment.failedAt),
    refundedAt: mapOptionalDate(payment.refundedAt),
    failureReason: payment.failureReason ?? null,
  };
}

// -----------------------------------------------------------------------------
// Cancellation mapper
// -----------------------------------------------------------------------------

function mapCancellation(
  cancellation: BookingCancellationResponse,
): JourneyBookingCancellation {
  return {
    reason: cancellation.reason,
    cancelledByPublicId: cancellation.cancelledByPublicId ?? null,
    reasonDescription: cancellation.reasonDescription ?? null,
    cancelledAt: mapDate(cancellation.cancelledAt),
  };
}

// -----------------------------------------------------------------------------
// Booking mapper
// -----------------------------------------------------------------------------

export class JourneyBookingResponseMapper {
  static toModel(
    response: JourneyBookingBackendResponse,
  ): JourneyBooking {
    return {
      publicId: response.publicId,
      journeyPublicId: response.journeyPublicId,
      passengerPublicId: response.passengerPublicId,

      status: response.status,
      seats: response.seats,

      confirmedAt: mapOptionalDate(response.confirmedAt),
      cancelledAt: mapOptionalDate(response.cancelledAt),
      completedAt: mapOptionalDate(response.completedAt),
      expiredAt: mapOptionalDate(response.expiredAt),

      version: response.version,

      snapshot: response.snapshot
        ? mapSnapshot(response.snapshot)
        : null,

      pricing: response.pricing
        ? mapPricing(response.pricing)
        : null,

      payment: response.payment
        ? mapPayment(response.payment)
        : null,

      cancellation: response.cancellation
        ? mapCancellation(response.cancellation)
        : null,

      createdAt: mapDate(response.createdAt),
      updatedAt: mapDate(response.updatedAt),
    };
  }

  static toModels(
    responses: readonly JourneyBookingBackendResponse[],
  ): JourneyBooking[] {
    return responses.map((response) => this.toModel(response));
  }
}

// -----------------------------------------------------------------------------
// Convenience exports
// -----------------------------------------------------------------------------

export const mapJourneyBookingResponse = (
  response: JourneyBookingBackendResponse,
): JourneyBooking => JourneyBookingResponseMapper.toModel(response);

export const mapJourneyBookingResponses = (
  responses: readonly JourneyBookingBackendResponse[],
): JourneyBooking[] => JourneyBookingResponseMapper.toModels(responses);

export default JourneyBookingResponseMapper;
