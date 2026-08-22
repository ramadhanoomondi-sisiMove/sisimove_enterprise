// src/domains/commercial/domain/value-objects/commercial-commission-type.vo.ts

// -----------------------------------------------------------------------------
// Commercial Commission Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

export const COMMERCIAL_COMMISSION_TYPES = ['BOOKING', 'EARNING'] as const;

export type CommercialCommissionTypeValue =
  (typeof COMMERCIAL_COMMISSION_TYPES)[number];

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialCommissionTypeProps {
  value: CommercialCommissionTypeValue;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the commercial commission model used by the platform.
 *
 * BOOKING
 *   Commission charged to the passenger as part of the booking payment.
 *
 * EARNING
 *   Commission retained by the platform from the provider's earning
 *   during settlement.
 */
export class CommercialCommissionType extends ValueObject<CommercialCommissionTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: CommercialCommissionTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Commercial Commission Type from an external/runtime value.
   *
   * The value is normalized and validated before entering the domain.
   */
  public static create(value: string): CommercialCommissionType {
    const normalized = value.trim().toUpperCase();

    if (!CommercialCommissionType.isValid(normalized)) {
      throw new Error(`Invalid Commercial Commission Type: ${value}`);
    }

    return new CommercialCommissionType(normalized);
  }

  // ---------------------------------------------------------------------------
  // Named Factories
  // ---------------------------------------------------------------------------

  public static booking(): CommercialCommissionType {
    return new CommercialCommissionType('BOOKING');
  }

  public static earning(): CommercialCommissionType {
    return new CommercialCommissionType('EARNING');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  public static isValid(value: string): value is CommercialCommissionTypeValue {
    return COMMERCIAL_COMMISSION_TYPES.includes(
      value as CommercialCommissionTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isBooking(): boolean {
    return this.props.value === 'BOOKING';
  }

  public isEarning(): boolean {
    return this.props.value === 'EARNING';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): CommercialCommissionTypeValue {
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
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialCommissionTypeProps };
