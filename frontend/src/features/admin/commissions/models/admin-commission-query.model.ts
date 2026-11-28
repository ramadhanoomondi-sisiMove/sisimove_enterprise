// -----------------------------------------------------------------------------
// Admin Commission — Query Model
// -----------------------------------------------------------------------------

/**
 * Supported commission lookup operations.
 *
 * The `kind` property is a frontend discriminator. It is not sent
 * to the backend as a query parameter.
 */
export type AdminCommissionQueryModel =
  // ===========================================================================
  // Booking Commission Lookups
  // ===========================================================================

  | {
      readonly kind: 'BOOKING_BY_BOOKING';
      readonly bookingPublicId: string;
    }
  | {
      readonly kind: 'BOOKING_BY_JOURNEY';
      readonly journeyPublicId: string;
    }

  // ===========================================================================
  // Earning Commission Lookups
  // ===========================================================================

  | {
      readonly kind: 'EARNING_BY_JOURNEY';
      readonly journeyPublicId: string;
    }
  | {
      readonly kind: 'EARNING_BY_SETTLEMENT';
      readonly settlementPublicId: string;
    }
  | {
      readonly kind: 'EARNING_BY_PROVIDER';
      readonly providerPublicId: string;
    };