// -----------------------------------------------------------------------------
// Financial Provider Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialProviderReferenceProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PROVIDER_REFERENCE_LENGTH = 1;
const MAX_PROVIDER_REFERENCE_LENGTH = 200;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * External reference assigned by a financial provider.
 *
 * Represents an opaque identifier supplied by an external payment,
 * disbursement, banking, mobile-money, or other financial provider.
 *
 * The reference is intentionally treated as an opaque domain value.
 * Financial does not infer its internal structure or semantics.
 */
export class FinancialProviderReference extends ValueObject<FinancialProviderReferenceProps> {
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
   * Creates a financial provider reference.
   *
   * The supplied value is trimmed and validated before entering
   * the Financial domain.
   */
  public static create(value: string): FinancialProviderReference {
    const normalized = value.trim();

    FinancialProviderReference.validate(normalized);

    return new FinancialProviderReference(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_PROVIDER_REFERENCE_LENGTH) {
      throw new Error('Financial provider reference must not be empty');
    }

    if (value.length > MAX_PROVIDER_REFERENCE_LENGTH) {
      throw new Error(
        `Financial provider reference must not exceed ${MAX_PROVIDER_REFERENCE_LENGTH} characters`,
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
  MIN_PROVIDER_REFERENCE_LENGTH as FINANCIAL_PROVIDER_REFERENCE_MIN_LENGTH,
  MAX_PROVIDER_REFERENCE_LENGTH as FINANCIAL_PROVIDER_REFERENCE_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialProviderReferenceProps };
