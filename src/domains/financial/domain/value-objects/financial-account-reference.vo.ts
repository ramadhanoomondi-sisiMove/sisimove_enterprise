// src/domains/financial/domain/value-objects/financial-account-reference.vo.ts

// -----------------------------------------------------------------------------
// Financial Account Reference
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountReferenceProps {
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
 * Reference to the external business owner or context associated with a
 * Financial Account.
 *
 * This value object is intentionally different from FinancialAccountPublicId.
 *
 * FinancialAccountPublicId identifies the Financial domain account itself.
 * FinancialAccountReference identifies the external entity or business
 * context that the account belongs to.
 *
 * Examples:
 *
 *   type    = "IDENTITY"
 *   publicId = "SM-ABC12345"
 *
 *   type    = "ORGANIZATION"
 *   publicId = "ORG-ABC12345"
 *
 *   type    = "MERCHANT"
 *   publicId = "MER-ABC12345"
 *
 * The Financial domain treats the reference as an opaque cross-domain
 * reference and does not create a persistence relation to the owning
 * bounded context.
 */
export class FinancialAccountReference extends ValueObject<FinancialAccountReferenceProps> {
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
   * Creates a Financial Account Reference.
   *
   * Both values are trimmed before validation.
   * Reference types are normalized to uppercase.
   */
  public static create(
    type: string,
    publicId: string,
  ): FinancialAccountReference {
    const normalizedType = type.trim().toUpperCase();
    const normalizedPublicId = publicId.trim();

    FinancialAccountReference.validateType(normalizedType);
    FinancialAccountReference.validatePublicId(normalizedPublicId);

    return new FinancialAccountReference(normalizedType, normalizedPublicId);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateType(value: string): void {
    if (value.length < MIN_REFERENCE_TYPE_LENGTH) {
      throw new Error('Financial Account reference type must not be empty');
    }

    if (value.length > MAX_REFERENCE_TYPE_LENGTH) {
      throw new Error(
        `Financial Account reference type must not exceed ${MAX_REFERENCE_TYPE_LENGTH} characters`,
      );
    }
  }

  private static validatePublicId(value: string): void {
    if (value.length < MIN_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        'Financial Account reference public ID must not be empty',
      );
    }

    if (value.length > MAX_REFERENCE_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Financial Account reference public ID must not exceed ${MAX_REFERENCE_PUBLIC_ID_LENGTH} characters`,
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

  public isIdentity(): boolean {
    return this.props.type === 'IDENTITY';
  }

  public isOrganization(): boolean {
    return this.props.type === 'ORGANIZATION';
  }

  public isMerchant(): boolean {
    return this.props.type === 'MERCHANT';
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
  MIN_REFERENCE_TYPE_LENGTH as FINANCIAL_ACCOUNT_REFERENCE_TYPE_MIN_LENGTH,
  MAX_REFERENCE_TYPE_LENGTH as FINANCIAL_ACCOUNT_REFERENCE_TYPE_MAX_LENGTH,
  MIN_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_REFERENCE_PUBLIC_ID_MIN_LENGTH,
  MAX_REFERENCE_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_REFERENCE_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountReferenceProps };
