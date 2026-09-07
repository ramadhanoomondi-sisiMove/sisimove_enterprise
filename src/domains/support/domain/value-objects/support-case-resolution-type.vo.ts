// -----------------------------------------------------------------------------
// Support Case Resolution Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseResolutionTypeProps {
  value:
    | 'INFORMATION_PROVIDED'
    | 'ACTION_TAKEN'
    | 'REFUND_ISSUED'
    | 'BOOKING_CANCELLED'
    | 'JOURNEY_CANCELLED'
    | 'ACCOUNT_RESTRICTED'
    | 'TRUST_ACTION'
    | 'VERIFICATION_ACTION'
    | 'NO_ACTION_REQUIRED'
    | 'REFERRED'
    | 'OTHER';
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of resolution applied to a Support Case.
 *
 * Supported resolution types:
 *
 * - INFORMATION_PROVIDED
 * - ACTION_TAKEN
 * - REFUND_ISSUED
 * - BOOKING_CANCELLED
 * - JOURNEY_CANCELLED
 * - ACCOUNT_RESTRICTED
 * - TRUST_ACTION
 * - VERIFICATION_ACTION
 * - NO_ACTION_REQUIRED
 * - REFERRED
 * - OTHER
 */
export class SupportCaseResolutionType extends ValueObject<SupportCaseResolutionTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: SupportCaseResolutionTypeProps['value']) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Support Case Resolution type.
   */
  public static create(value: string): SupportCaseResolutionType {
    return new SupportCaseResolutionType(
      SupportCaseResolutionType.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(
    value: string,
  ): SupportCaseResolutionTypeProps['value'] {
    if (typeof value !== 'string') {
      throw new Error('Support case resolution type must be a string.');
    }

    const normalized = value.trim().toUpperCase();

    const allowed: SupportCaseResolutionTypeProps['value'][] = [
      'INFORMATION_PROVIDED',
      'ACTION_TAKEN',
      'REFUND_ISSUED',
      'BOOKING_CANCELLED',
      'JOURNEY_CANCELLED',
      'ACCOUNT_RESTRICTED',
      'TRUST_ACTION',
      'VERIFICATION_ACTION',
      'NO_ACTION_REQUIRED',
      'REFERRED',
      'OTHER',
    ];

    if (
      !allowed.includes(normalized as SupportCaseResolutionTypeProps['value'])
    ) {
      throw new Error(`Invalid support case resolution type: ${value}.`);
    }

    return normalized as SupportCaseResolutionTypeProps['value'];
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): SupportCaseResolutionTypeProps['value'] {
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

export type { SupportCaseResolutionTypeProps };
