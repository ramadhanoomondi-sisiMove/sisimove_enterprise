// -----------------------------------------------------------------------------
// Support Case Reference Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface SupportCaseReferenceTypeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Identifies the type of resource a Support Case concerns.
 *
 * The referenced resource belongs to another domain or bounded context.
 *
 * Examples:
 *
 * - Journey
 * - JourneyBooking
 * - JourneyCompletion
 * - JourneyCompletionDispute
 * - FinancialPayment
 * - FinancialAccount
 * - TrustProfile
 *
 * Support does not own or interpret the referenced aggregate's domain
 * behavior. This value object only represents the reference type.
 */
export class SupportCaseReferenceType extends ValueObject<SupportCaseReferenceTypeProps> {
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
   * Creates a Support Case reference type.
   */
  public static create(value: string): SupportCaseReferenceType {
    return new SupportCaseReferenceType(
      SupportCaseReferenceType.validate(value),
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): string {
    if (typeof value !== 'string') {
      throw new Error('Support case reference type must be a string.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new Error('Support case reference type cannot be empty.');
    }

    return normalized;
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
// Exported Types
// -----------------------------------------------------------------------------

export type { SupportCaseReferenceTypeProps };
