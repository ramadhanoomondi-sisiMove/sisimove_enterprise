// src/domains/financial/domain/value-objects/financial-transaction-reference.vo.ts

// -----------------------------------------------------------------------------
// Financial Transaction Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialTransactionReferenceProps {
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
 * Reference to the business operation that caused or is associated with a
 * Financial Transaction.
 *
 * Examples:
 *
 *   type    = "JOURNEY_BOOKING"
 *   publicId = "JBK-ABC12345"
 *
 *   type    = "COMMERCIAL_BOOKING_COMMISSION"
 *   publicId = "CBC-ABC12345"
 *
 * The reference is intentionally represented as an opaque cross-domain
 * reference. The Financial domain does not establish a persistence relation
 * to the referenced bounded context.
 */
export class FinancialTransactionReference extends ValueObject<FinancialTransactionReferenceProps> {
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
   * Creates a Financial Transaction Reference.
   *
   * Both values are trimmed before validation.
   */
  public static create(
    type: string,
    publicId: string,
  ): FinancialTransactionReference {
    const normalizedType = type.trim().toUpperCase();
    const normalizedPublicId = publicId.trim();

    FinancialTransactionReference.validateType(normalizedType);
    FinancialTransactionReference.validatePublicId(normalizedPublicId);

    return new FinancialTransactionReference(
      normalizedType,
      normalizedPublicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateType(value: string): void {
    if (value.length < MIN_REFERENCE_TYPE_LENGTH) {
      throw new Error('Financial Transaction reference type must not be empty');
    }

    if (value.length > MAX_REFERENCE_TYPE_LENGTH) {
      throw new Error(
        `Financial Transaction reference type must not exceed ${MAX_REFERENCE_TYPE_LENGTH} characters`,
      );
    }
  }

  private static validatePublicId(value: string): void {
    if (value.length < MIN_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        'Financial Transaction reference public ID must not be empty',
      );
    }

    if (value.length > MAX_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Financial Transaction reference public ID must not exceed ${MAX_REFERENCE_PUBLIC_ID_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public hasType(type: string): boolean {
    return this.props.type === type.trim().toUpperCase();
  }

  public hasPublicId(publicId: string): boolean {
    return this.props.publicId === publicId.trim();
  }

  public isJourneyBooking(): boolean {
    return this.props.type === 'JOURNEY_BOOKING';
  }

  public isCommercialBookingCommission(): boolean {
    return this.props.type === 'COMMERCIAL_BOOKING_COMMISSION';
  }

  public isSettlement(): boolean {
    return this.props.type === 'SETTLEMENT';
  }

  public isDisbursement(): boolean {
    return this.props.type === 'DISBURSEMENT';
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
  MIN_REFERENCE_TYPE_LENGTH as FINANCIAL_TRANSACTION_REFERENCE_TYPE_MIN_LENGTH,
  MAX_REFERENCE_TYPE_LENGTH as FINANCIAL_TRANSACTION_REFERENCE_TYPE_MAX_LENGTH,
  MIN_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_TRANSACTION_REFERENCE_PUBLIC_ID_MIN_LENGTH,
  MAX_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_TRANSACTION_REFERENCE_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialTransactionReferenceProps };
