// -----------------------------------------------------------------------------
// Journey Booking — Detail Mapper
// -----------------------------------------------------------------------------
//
// Maps the detailed Journey Booking representation received from the HTTP API
// into the frontend/application model.
//
// The backend remains authoritative for booking state, lifecycle, payment,
// pricing, cancellation, Journey, Traveller, and Trust information.
//
// This mapper is the single translation point between the HTTP transport
// representation and the frontend JourneyBookingDetail model.
//
// -----------------------------------------------------------------------------

import type {
  JourneyBookingDetail,
  JourneyBookingDetailCancellation,
  JourneyBookingDetailJourney,
  JourneyBookingDetailPayment,
  JourneyBookingDetailPricing,
  JourneyBookingDetailProvider,
  JourneyBookingDetailProviderTraveller,
  JourneyBookingDetailProviderTrust,
  JourneyBookingDetailProviderTrustBadge,
  JourneyBookingDetailProviderTrustBadgeAsset,
  JourneyBookingDetailResponse,
  JourneyBookingDetailSnapshot,
} from '../models';

import {
  JOURNEY_BOOKING_STATUSES,
  type JourneyBookingStatus,
} from '../models/journey-booking-status';

import {
  JOURNEY_BOOKING_PAYMENT_STATUSES,
  type JourneyBookingPaymentStatus,
} from '../models/journey-booking-payment-status';

import {
  JOURNEY_BOOKING_CANCELLATION_REASONS,
  type JourneyBookingCancellationReason,
} from '../models/journey-booking-cancellation-reason';

// -----------------------------------------------------------------------------
// API Response Contract
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the Journey Booking detail HTTP API.
 *
 * Temporal values are intentionally represented as `unknown` at the transport
 * boundary because the backend application response contains Date values which
 * are serialized by HTTP as ISO strings.
 */
export interface JourneyBookingDetailApiResponse {
  booking: JourneyBookingDetailApiBookingResponse;
}

interface JourneyBookingDetailApiBookingResponse {
  publicId: string;
  journeyPublicId: string;
  passengerPublicId: string;
  status: string;
  seats: number;

  confirmedAt: unknown;
  cancelledAt: unknown;
  completedAt: unknown;
  expiredAt: unknown;

  journey: JourneyBookingDetailApiJourneyResponse | null;
  snapshot: JourneyBookingDetailApiSnapshotResponse | null;
  pricing: JourneyBookingDetailApiPricingResponse | null;
  payment: JourneyBookingDetailApiPaymentResponse | null;
  cancellation: JourneyBookingDetailApiCancellationResponse | null;

  version: number;
  createdAt: unknown;
  updatedAt: unknown;
}

interface JourneyBookingDetailApiSnapshotResponse {
  publicId: string;

  originName: string;
  destinationName: string;

  originCoordinates: unknown;
  destinationCoordinates: unknown;

  departureAt: unknown;
  arrivalAt: unknown;

  timezone: string;

  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  vehicleColor: string | null;
  vehicleRegistration: string | null;

  createdAt: unknown;
  updatedAt: unknown;
}

interface JourneyBookingDetailApiPricingResponse {
  publicId: string;

  pricePerSeat: number;
  seats: number;
  subtotal: number;
  discountAmount: number;
  adjustmentAmount: number;
  totalAmount: number;

  currency: string;

  createdAt: unknown;
  updatedAt: unknown;
}

interface JourneyBookingDetailApiPaymentResponse {
  publicId: string;

  status: string;

  amount: number;
  currency: string;

  transactionPublicId: string | null;

  authorizedAt: unknown;
  capturedAt: unknown;
  failedAt: unknown;
  refundedAt: unknown;

  failureReason: string | null;

  createdAt: unknown;
  updatedAt: unknown;
}

interface JourneyBookingDetailApiCancellationResponse {
  publicId: string;

  reason: string;

  cancelledByPublicId: string | null;
  reasonDescription: string | null;

  cancelledAt: unknown;

  createdAt: unknown;
  updatedAt: unknown;
}

interface JourneyBookingDetailApiJourneyResponse {
  publicId: string;
  providerPublicId: string;

  status: string;

  publishedAt: unknown;
  startedAt: unknown;
  completionRequestedAt: unknown;
  completedAt: unknown;
  cancelledAt: unknown;
  expiredAt: unknown;

  version: number;

  provider: JourneyBookingDetailApiProviderResponse | null;
}

interface JourneyBookingDetailApiProviderResponse {
  traveller: JourneyBookingDetailApiProviderTravellerResponse;
  trust: JourneyBookingDetailApiProviderTrustResponse;
}

interface JourneyBookingDetailApiProviderTravellerResponse {
  publicId: string;
  handle: string;
  bio: string | null;

  avatar: {
    publicId: string;
  } | null;

  countryCode: string;
}

interface JourneyBookingDetailApiProviderTrustResponse {
  verificationLevel: string;

  ratingAverage: number;
  ratingCount: number;
  completedJourneys: number;

  badges: JourneyBookingDetailApiProviderTrustBadgeResponse[];
}

interface JourneyBookingDetailApiProviderTrustBadgeResponse {
  publicId: string;
  type: string;
  name: string;
  description: string | null;

  asset: JourneyBookingDetailApiProviderTrustBadgeAssetResponse | null;
}

interface JourneyBookingDetailApiProviderTrustBadgeAssetResponse {
  publicId: string;
  url: string;
  alt: string;
}

// -----------------------------------------------------------------------------
// Enum / Union Mapping
// -----------------------------------------------------------------------------

function mapBookingStatus(
  value: string,
): JourneyBookingStatus {
  if (
    (JOURNEY_BOOKING_STATUSES as readonly string[]).includes(value)
  ) {
    return value as JourneyBookingStatus;
  }

  throw new TypeError(
    `Invalid Journey Booking status: ${value}`,
  );
}

function mapPaymentStatus(
  value: string,
): JourneyBookingPaymentStatus {
  if (
    (JOURNEY_BOOKING_PAYMENT_STATUSES as readonly string[]).includes(
      value,
    )
  ) {
    return value as JourneyBookingPaymentStatus;
  }

  throw new TypeError(
    `Invalid Journey Booking payment status: ${value}`,
  );
}

function mapCancellationReason(
  value: string,
): JourneyBookingCancellationReason {
  if (
    (
      JOURNEY_BOOKING_CANCELLATION_REASONS as readonly string[]
    ).includes(value)
  ) {
    return value as JourneyBookingCancellationReason;
  }

  throw new TypeError(
    `Invalid Journey Booking cancellation reason: ${value}`,
  );
}

// -----------------------------------------------------------------------------
// Temporal Mapping
// -----------------------------------------------------------------------------

/**
 * Maps a backend temporal value into the ISO string representation consumed
 * by the frontend.
 */
function mapTimestamp(
  value: unknown,
  fieldName: string,
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      throw new TypeError(
        `Journey Booking detail ${fieldName} must not be empty.`,
      );
    }

    return value;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError(
        `Journey Booking detail ${fieldName} must be a valid date.`,
      );
    }

    return value.toISOString();
  }

  throw new TypeError(
    `Journey Booking detail ${fieldName} must be an ISO timestamp string.`,
  );
}

// -----------------------------------------------------------------------------
// Coordinate Mapping
// -----------------------------------------------------------------------------

/**
 * Maps a backend coordinate representation into the frontend model.
 */
function mapCoordinates(
  value: unknown,
  fieldName: string,
): {
  readonly latitude: number;
  readonly longitude: number;
} {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new TypeError(
      `Journey Booking detail ${fieldName} must be an object.`,
    );
  }

  const candidate = value as {
    latitude?: unknown;
    longitude?: unknown;
  };

  if (
    typeof candidate.latitude !== 'number' ||
    !Number.isFinite(candidate.latitude)
  ) {
    throw new TypeError(
      `Journey Booking detail ${fieldName}.latitude must be a finite number.`,
    );
  }

  if (
    typeof candidate.longitude !== 'number' ||
    !Number.isFinite(candidate.longitude)
  ) {
    throw new TypeError(
      `Journey Booking detail ${fieldName}.longitude must be a finite number.`,
    );
  }

  return {
    latitude: candidate.latitude,
    longitude: candidate.longitude,
  };
}

// -----------------------------------------------------------------------------
// Snapshot Mapping
// -----------------------------------------------------------------------------

function mapSnapshot(
  response: JourneyBookingDetailApiSnapshotResponse,
): JourneyBookingDetailSnapshot {
  return {
    publicId: response.publicId,

    originName: response.originName,
    destinationName: response.destinationName,

    originCoordinates: mapCoordinates(
      response.originCoordinates,
      'originCoordinates',
    ),

    destinationCoordinates: mapCoordinates(
      response.destinationCoordinates,
      'destinationCoordinates',
    ),

    departureAt:
      mapTimestamp(
        response.departureAt,
        'departureAt',
      ) ?? '',

    arrivalAt: mapTimestamp(
      response.arrivalAt,
      'arrivalAt',
    ),

    timezone: response.timezone,

    vehicleMake: response.vehicleMake,
    vehicleModel: response.vehicleModel,
    vehicleYear: response.vehicleYear,
    vehicleColor: response.vehicleColor,
    vehicleRegistration: response.vehicleRegistration,

    createdAt:
      mapTimestamp(
        response.createdAt,
        'createdAt',
      ) ?? '',

    updatedAt:
      mapTimestamp(
        response.updatedAt,
        'updatedAt',
      ) ?? '',
  };
}

// -----------------------------------------------------------------------------
// Pricing Mapping
// -----------------------------------------------------------------------------

function mapPricing(
  response: JourneyBookingDetailApiPricingResponse,
): JourneyBookingDetailPricing {
  return {
    publicId: response.publicId,

    pricePerSeat: response.pricePerSeat,
    seats: response.seats,
    subtotal: response.subtotal,
    discountAmount: response.discountAmount,
    adjustmentAmount: response.adjustmentAmount,
    totalAmount: response.totalAmount,

    currency: response.currency,

    createdAt:
      mapTimestamp(
        response.createdAt,
        'pricing.createdAt',
      ) ?? '',

    updatedAt:
      mapTimestamp(
        response.updatedAt,
        'pricing.updatedAt',
      ) ?? '',
  };
}

// -----------------------------------------------------------------------------
// Payment Mapping
// -----------------------------------------------------------------------------

function mapPayment(
  response: JourneyBookingDetailApiPaymentResponse,
): JourneyBookingDetailPayment {
  return {
    publicId: response.publicId,

    status: mapPaymentStatus(response.status),

    amount: response.amount,
    currency: response.currency,

    transactionPublicId: response.transactionPublicId,

    authorizedAt: mapTimestamp(
      response.authorizedAt,
      'payment.authorizedAt',
    ),

    capturedAt: mapTimestamp(
      response.capturedAt,
      'payment.capturedAt',
    ),

    failedAt: mapTimestamp(
      response.failedAt,
      'payment.failedAt',
    ),

    refundedAt: mapTimestamp(
      response.refundedAt,
      'payment.refundedAt',
    ),

    failureReason: response.failureReason,

    createdAt:
      mapTimestamp(
        response.createdAt,
        'payment.createdAt',
      ) ?? '',

    updatedAt:
      mapTimestamp(
        response.updatedAt,
        'payment.updatedAt',
      ) ?? '',
  };
}

// -----------------------------------------------------------------------------
// Cancellation Mapping
// -----------------------------------------------------------------------------

function mapCancellation(
  response: JourneyBookingDetailApiCancellationResponse,
): JourneyBookingDetailCancellation {
  return {
    publicId: response.publicId,

    reason: mapCancellationReason(response.reason),

    cancelledByPublicId: response.cancelledByPublicId,
    reasonDescription: response.reasonDescription,

    cancelledAt:
      mapTimestamp(
        response.cancelledAt,
        'cancellation.cancelledAt',
      ) ?? '',

    createdAt:
      mapTimestamp(
        response.createdAt,
        'cancellation.createdAt',
      ) ?? '',

    updatedAt:
      mapTimestamp(
        response.updatedAt,
        'cancellation.updatedAt',
      ) ?? '',
  };
}

// -----------------------------------------------------------------------------
// Provider Mapping
// -----------------------------------------------------------------------------

function mapProviderTraveller(
  response: JourneyBookingDetailApiProviderTravellerResponse,
): JourneyBookingDetailProviderTraveller {
  return {
    publicId: response.publicId,
    handle: response.handle,
    bio: response.bio,

    avatar: response.avatar
      ? {
          publicId: response.avatar.publicId,
        }
      : null,

    countryCode: response.countryCode,
  };
}

function mapProviderTrustBadgeAsset(
  response: JourneyBookingDetailApiProviderTrustBadgeAssetResponse,
): JourneyBookingDetailProviderTrustBadgeAsset {
  return {
    publicId: response.publicId,
    url: response.url,
    alt: response.alt,
  };
}

function mapProviderTrustBadge(
  response: JourneyBookingDetailApiProviderTrustBadgeResponse,
): JourneyBookingDetailProviderTrustBadge {
  return {
    publicId: response.publicId,
    type: response.type,
    name: response.name,
    description: response.description,

    asset: response.asset
      ? mapProviderTrustBadgeAsset(response.asset)
      : null,
  };
}

function mapProviderTrust(
  response: JourneyBookingDetailApiProviderTrustResponse,
): JourneyBookingDetailProviderTrust {
  return {
    verificationLevel: response.verificationLevel,

    ratingAverage: response.ratingAverage,
    ratingCount: response.ratingCount,
    completedJourneys: response.completedJourneys,

    badges: response.badges.map(mapProviderTrustBadge),
  };
}

function mapProvider(
  response: JourneyBookingDetailApiProviderResponse,
): JourneyBookingDetailProvider {
  return {
    traveller: mapProviderTraveller(response.traveller),
    trust: mapProviderTrust(response.trust),
  };
}

// -----------------------------------------------------------------------------
// Journey Mapping
// -----------------------------------------------------------------------------

function mapJourney(
  response: JourneyBookingDetailApiJourneyResponse,
): JourneyBookingDetailJourney {
  return {
    publicId: response.publicId,
    providerPublicId: response.providerPublicId,

    status: response.status,

    publishedAt: mapTimestamp(
      response.publishedAt,
      'journey.publishedAt',
    ),

    startedAt: mapTimestamp(
      response.startedAt,
      'journey.startedAt',
    ),

    completionRequestedAt: mapTimestamp(
      response.completionRequestedAt,
      'journey.completionRequestedAt',
    ),

    completedAt: mapTimestamp(
      response.completedAt,
      'journey.completedAt',
    ),

    cancelledAt: mapTimestamp(
      response.cancelledAt,
      'journey.cancelledAt',
    ),

    expiredAt: mapTimestamp(
      response.expiredAt,
      'journey.expiredAt',
    ),

    version: response.version,

    provider: response.provider
      ? mapProvider(response.provider)
      : null,
  };
}

// -----------------------------------------------------------------------------
// Booking Mapping
// -----------------------------------------------------------------------------

function mapBooking(
  response: JourneyBookingDetailApiBookingResponse,
): JourneyBookingDetail {
  return {
    publicId: response.publicId,

    journeyPublicId: response.journeyPublicId,
    passengerPublicId: response.passengerPublicId,

    status: mapBookingStatus(response.status),

    seats: response.seats,

    confirmedAt: mapTimestamp(
      response.confirmedAt,
      'confirmedAt',
    ),

    cancelledAt: mapTimestamp(
      response.cancelledAt,
      'cancelledAt',
    ),

    completedAt: mapTimestamp(
      response.completedAt,
      'completedAt',
    ),

    expiredAt: mapTimestamp(
      response.expiredAt,
      'expiredAt',
    ),

    journey: response.journey
      ? mapJourney(response.journey)
      : null,

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

    version: response.version,

    createdAt:
      mapTimestamp(
        response.createdAt,
        'createdAt',
      ) ?? '',

    updatedAt:
      mapTimestamp(
        response.updatedAt,
        'updatedAt',
      ) ?? '',
  };
}

// -----------------------------------------------------------------------------
// Public Mapper
// -----------------------------------------------------------------------------

/**
 * Maps the complete Journey Booking detail API response into the frontend
 * application model.
 */
export function mapJourneyBookingDetail(
  response: JourneyBookingDetailApiResponse,
): JourneyBookingDetailResponse {
  if (!response || typeof response !== 'object') {
    throw new TypeError(
      'Journey Booking detail response is required.',
    );
  }

  if (!response.booking) {
    throw new TypeError(
      'Journey Booking detail response must contain a booking.',
    );
  }

  return {
    booking: mapBooking(response.booking),
  };
}
