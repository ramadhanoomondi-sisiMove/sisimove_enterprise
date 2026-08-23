// src/domains/financial/domain/value-objects/financial-masked-reference.vo.ts

// -----------------------------------------------------------------------------
// Financial Masked Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialMaskedReferenceProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_MASKED_REFERENCE_LENGTH = 1;
const MAX_MASKED_REFERENCE_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Masked representation of a sensitive external financial reference.
 *
 * Used when the Financial domain needs to retain or expose a safe,
 * non-sensitive representation of a payment or disbursement destination.
 *
 * Examples:
 *
 * - 07******42
 * - ****1234
 * - ****5678
 *
 * The masked reference must never be treated as the authoritative
 * provider reference. It exists only for safe display and identification.
 */
export class FinancialMaskedReference extends ValueObject<FinancialMaskedReferenceProps> {
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
   * Creates a Financial masked reference.
   *
   * The supplied value is trimmed and validated before entering
   * the Financial domain.
   */
  public static create(value: string): FinancialMaskedReference {
    const normalized = value.trim();

    FinancialMaskedReference.validate(normalized);

    return new FinancialMaskedReference(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_MASKED_REFERENCE_LENGTH) {
      throw new Error('Financial masked reference must not be empty');
    }

    if (value.length > MAX_MASKED_REFERENCE_LENGTH) {
      throw new Error(
        `Financial masked reference must not exceed ${MAX_MASKED_REFERENCE_LENGTH} characters`,
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
  MIN_MASKED_REFERENCE_LENGTH as FINANCIAL_MASKED_REFERENCE_MIN_LENGTH,
  MAX_MASKED_REFERENCE_LENGTH as FINANCIAL_MASKED_REFERENCE_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialMaskedReferenceProps };
