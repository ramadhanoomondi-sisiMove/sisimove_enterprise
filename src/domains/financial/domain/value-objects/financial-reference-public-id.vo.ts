// src/domains/financial/domain/value-objects/financial-reference-public-id.vo.ts

// -----------------------------------------------------------------------------
// Financial Reference Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialReferencePublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_REFERENCE_PUBLIC_ID_LENGTH = 1;
const MAX_REFERENCE_PUBLIC_ID_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of an external domain entity referenced by the
 * Financial domain.
 *
 * This value object represents an opaque cross-domain reference.
 *
 * Financial does not establish persistence relations to entities owned
 * by other bounded contexts. The combination of FinancialReferenceType
 * and FinancialReferencePublicId therefore identifies the referenced
 * business object without coupling Financial persistence to its owner.
 *
 * Examples:
 *
 * - Journey Booking public ID
 * - Journey Completion public ID
 * - Commercial Commission public ID
 * - Accounting Journal public ID
 */
export class FinancialReferencePublicId extends ValueObject<FinancialReferencePublicIdProps> {
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
   * Creates a Financial reference public identifier.
   *
   * The supplied value is trimmed and validated before entering
   * the Financial domain.
   */
  public static create(value: string): FinancialReferencePublicId {
    const normalized = value.trim();

    FinancialReferencePublicId.validate(normalized);

    return new FinancialReferencePublicId(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error('Financial reference public ID must not be empty');
    }

    if (value.length > MAX_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Financial reference public ID must not exceed ${MAX_REFERENCE_PUBLIC_ID_LENGTH} characters`,
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
  MIN_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_REFERENCE_PUBLIC_ID_MIN_LENGTH,
  MAX_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_REFERENCE_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialReferencePublicIdProps };
