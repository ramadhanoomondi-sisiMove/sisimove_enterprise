// src/domains/commercial/domain/value-objects/commercial-booking-commission-booking-public-id.vo.ts

// -----------------------------------------------------------------------------
// Commercial Booking Commission Booking Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionBookingPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_BOOKING_PUBLIC_ID_LENGTH = 1;
const MAX_BOOKING_PUBLIC_ID_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the Journey Booking associated with a Commercial
 * Booking Commission.
 *
 * This value object represents a cross-domain reference.
 *
 * Commercial intentionally does not create a Prisma relation to the
 * Journey Booking domain. The public identifier is therefore treated as
 * an opaque domain-owned reference.
 */
export class CommercialBookingCommissionBookingPublicId extends ValueObject<CommercialBookingCommissionBookingPublicIdProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: string) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a booking public identifier.
   *
   * The value is trimmed and validated before entering the domain.
   */
  public static create(
    value: string,
  ): CommercialBookingCommissionBookingPublicId {
    const normalized = value.trim();

    CommercialBookingCommissionBookingPublicId.validate(normalized);

    return new CommercialBookingCommissionBookingPublicId(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_BOOKING_PUBLIC_ID_LENGTH) {
      throw new Error(
        'Commercial Booking Commission booking public ID must not be empty',
      );
    }

    if (value.length > MAX_BOOKING_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Commercial Booking Commission booking public ID must not exceed ${MAX_BOOKING_PUBLIC_ID_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public hasContent(): boolean {
    return this.props.value.length > 0;
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): string {
    return this.props.value;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return this.props.value;
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_BOOKING_PUBLIC_ID_LENGTH as COMMERCIAL_BOOKING_COMMISSION_BOOKING_PUBLIC_ID_MIN_LENGTH,
  MAX_BOOKING_PUBLIC_ID_LENGTH as COMMERCIAL_BOOKING_COMMISSION_BOOKING_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialBookingCommissionBookingPublicIdProps };
