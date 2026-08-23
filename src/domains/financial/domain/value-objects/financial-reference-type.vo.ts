// src/domains/financial/domain/value-objects/financial-reference-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Reference Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialReferenceTypeProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_REFERENCE_TYPE_LENGTH = 1;
const MAX_REFERENCE_TYPE_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Identifies the bounded context or domain concept associated with
 * a Financial reference.
 *
 * Examples:
 *
 * - JOURNEY_BOOKING
 * - JOURNEY_COMPLETION
 * - COMMERCIAL_COMMISSION
 * - ACCOUNTING_JOURNAL
 *
 * The Financial domain intentionally treats this value as an opaque
 * cross-domain reference type. It does not establish persistence
 * relations to entities owned by other bounded contexts.
 */
export class FinancialReferenceType extends ValueObject<FinancialReferenceTypeProps> {
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
   * Creates a Financial reference type.
   *
   * The supplied value is trimmed and normalized to uppercase.
   */
  public static create(value: string): FinancialReferenceType {
    const normalized = value.trim().toUpperCase();

    FinancialReferenceType.validate(normalized);

    return new FinancialReferenceType(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_REFERENCE_TYPE_LENGTH) {
      throw new Error('Financial reference type must not be empty');
    }

    if (value.length > MAX_REFERENCE_TYPE_LENGTH) {
      throw new Error(
        `Financial reference type must not exceed ${MAX_REFERENCE_TYPE_LENGTH} characters`,
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
  MIN_REFERENCE_TYPE_LENGTH as FINANCIAL_REFERENCE_TYPE_MIN_LENGTH,
  MAX_REFERENCE_TYPE_LENGTH as FINANCIAL_REFERENCE_TYPE_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialReferenceTypeProps };
