// -----------------------------------------------------------------------------
// Financial Account Owner Public ID
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialAccountOwnerPublicIdProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_OWNER_PUBLIC_ID_LENGTH = 1;
const MAX_OWNER_PUBLIC_ID_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Public identifier of the owner associated with a Financial Account.
 *
 * Represents a cross-domain reference to the owning identity or entity.
 *
 * Financial intentionally does not establish a persistence relation to the
 * Identity domain. The public identifier is therefore treated as an opaque
 * domain-owned reference.
 *
 * This value object corresponds to the `ownerPublicId` field of a
 * Financial Account.
 */
export class FinancialAccountOwnerPublicId extends ValueObject<FinancialAccountOwnerPublicIdProps> {
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
   * Creates a Financial Account owner public identifier.
   *
   * The supplied value is trimmed and validated before entering the domain.
   */
  public static create(value: string): FinancialAccountOwnerPublicId {
    const normalized = value.trim();

    FinancialAccountOwnerPublicId.validate(normalized);

    return new FinancialAccountOwnerPublicId(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_OWNER_PUBLIC_ID_LENGTH) {
      throw new Error('Financial Account owner public ID must not be empty');
    }

    if (value.length > MAX_OWNER_PUBLIC_ID_LENGTH) {
      throw new Error(
        `Financial Account owner public ID must not exceed ${MAX_OWNER_PUBLIC_ID_LENGTH} characters`,
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
  MIN_OWNER_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_OWNER_PUBLIC_ID_MIN_LENGTH,
  MAX_OWNER_PUBLIC_ID_LENGTH as FINANCIAL_ACCOUNT_OWNER_PUBLIC_ID_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialAccountOwnerPublicIdProps };
