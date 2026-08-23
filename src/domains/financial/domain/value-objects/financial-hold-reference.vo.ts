// -----------------------------------------------------------------------------
// Financial Hold Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialHoldReferenceProps {
  type: string;
  publicId: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_REFERENCE_TYPE_LENGTH = 1;
const MAX_REFERENCE_TYPE_LENGTH = 100;

const MIN_REFERENCE_PUBLIC_ID_LENGTH = 1;
const MAX_REFERENCE_PUBLIC_ID_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Reference to the business object that caused a Financial Account Hold.
 *
 * The Financial domain does not establish a persistence relationship with
 * the referenced business object. The pair of reference type and public ID
 * provides an opaque cross-domain reference.
 *
 * Examples:
 *
 *   JOURNEY_BOOKING / JBK-XXXXXXXX
 *   JOURNEY_COMPLETION / JCP-XXXXXXXX
 *   COMMERCIAL_BOOKING / CBO-XXXXXXXX
 */
export class FinancialHoldReference extends ValueObject<FinancialHoldReferenceProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(type: string, publicId: string) {
    super({
      type,
      publicId,
    });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Hold reference.
   *
   * Both the reference type and public identifier are trimmed and validated
   * before entering the domain.
   */
  public static create(type: string, publicId: string): FinancialHoldReference {
    const normalizedType = type.trim();
    const normalizedPublicId = publicId.trim();

    FinancialHoldReference.validateType(normalizedType);
    FinancialHoldReference.validatePublicId(normalizedPublicId);

    return new FinancialHoldReference(normalizedType, normalizedPublicId);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateType(value: string): void {
    if (value.length < MIN_REFERENCE_TYPE_LENGTH) {
      throw new Error('Financial hold reference type must not be empty');
    }

    if (value.length > MAX_REFERENCE_TYPE_LENGTH) {
      throw new Error(
        `Financial hold reference type must not exceed ${MAX_REFERENCE_TYPE_LENGTH} characters`,
      );
    }
  }

  private static validatePublicId(value: string): void {
    if (value.length < MIN_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error('Financial hold reference public ID must not be empty');
    }

    if (value.length > MAX_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Financial hold reference public ID must not exceed ${MAX_REFERENCE_PUBLIC_ID_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isOfType(type: string): boolean {
    return this.props.type === type.trim();
  }

  public hasPublicId(publicId: string): boolean {
    return this.props.publicId === publicId.trim();
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get type(): string {
    return this.props.type;
  }

  public get publicId(): string {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Serialization
  // ---------------------------------------------------------------------------

  public override toString(): string {
    return `${this.props.type}:${this.props.publicId}`;
  }
}

// -----------------------------------------------------------------------------
// Exported Constants
// -----------------------------------------------------------------------------

export {
  MIN_REFERENCE_TYPE_LENGTH as FINANCIAL_HOLD_REFERENCE_TYPE_MIN_LENGTH,
  MAX_REFERENCE_TYPE_LENGTH as FINANCIAL_HOLD_REFERENCE_TYPE_MAX_LENGTH,
  MIN_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_HOLD_REFERENCE_PUBLIC_ID_MIN_LENGTH,
  MAX_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_HOLD_REFERENCE_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialHoldReferenceProps };
