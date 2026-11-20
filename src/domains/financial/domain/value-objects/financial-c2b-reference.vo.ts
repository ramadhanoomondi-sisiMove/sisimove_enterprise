/**
 * -----------------------------------------------------------------------------
 * Financial C2B Reference Value Object
 * -----------------------------------------------------------------------------
 *
 * Purpose:
 * - Identifies an individual customer-initiated C2B payment.
 * - Provides a human-readable reference for Safaricom PayBill payments.
 * - Correlates Safaricom's BillRefNumber with a pending FinancialPayment.
 *
 * Reference format:
 *
 *   SM7K2P9X4D
 *
 * Characteristics:
 * - SM prefix identifies SisiMove.
 * - Eight uppercase alphanumeric characters follow the prefix.
 * - Excludes visually ambiguous characters: I, O, 0 and 1.
 * - Contains no spaces, dashes or hyphens.
 *
 * This value object does NOT:
 * - Identify a Financial Account.
 * - Identify a customer or payer.
 * - Identify a Safaricom transaction (TransID).
 * - Generate references.
 * - Execute provider requests or process callbacks.
 * - Create or modify financial records.
 *
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialC2BReferenceProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const REFERENCE_PREFIX = 'SM';

const REFERENCE_SUFFIX_LENGTH = 8;

const MIN_REFERENCE_LENGTH = REFERENCE_PREFIX.length + REFERENCE_SUFFIX_LENGTH;
const MAX_REFERENCE_LENGTH = MIN_REFERENCE_LENGTH;

// Excludes visually ambiguous characters:
// I, O, 0 and 1.
const REFERENCE_PATTERN = /^SM[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Unique, human-readable reference for an individual Financial C2B payment.
 *
 * The reference is supplied to the customer as the PayBill account reference
 * and received from Safaricom through the C2B BillRefNumber callback field.
 *
 * Each reference must identify exactly one FinancialPayment.
 *
 * References are treated as opaque values. The factory normalizes lowercase
 * input to uppercase but does not modify the reference's actual characters.
 */
export class FinancialC2BReference extends ValueObject<FinancialC2BReferenceProps> {
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
   * Creates a Financial C2B Reference.
   *
   * Leading and trailing whitespace is removed.
   * Lowercase characters are normalized to uppercase.
   */
  public static create(value: string): FinancialC2BReference {
    if (typeof value !== 'string') {
      throw new Error('Financial C2B reference must be a string');
    }

    const normalizedValue = value.trim().toUpperCase();

    FinancialC2BReference.validate(normalizedValue);

    return new FinancialC2BReference(normalizedValue);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_REFERENCE_LENGTH) {
      throw new Error('Financial C2B reference must not be empty');
    }

    if (value.length > MAX_REFERENCE_LENGTH) {
      throw new Error(
        `Financial C2B reference must not exceed ${MAX_REFERENCE_LENGTH} characters`,
      );
    }

    if (!REFERENCE_PATTERN.test(value)) {
      throw new Error(
        'Invalid Financial C2B reference. Expected SM followed by exactly 8 uppercase letters or digits, excluding I, O, 0 and 1.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public matches(reference: string): boolean {
    if (typeof reference !== 'string') {
      return false;
    }

    return this.props.value === reference.trim().toUpperCase();
  }

  // ---------------------------------------------------------------------------
  // Accessors
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
  REFERENCE_PREFIX as FINANCIAL_C2B_REFERENCE_PREFIX,
  REFERENCE_SUFFIX_LENGTH as FINANCIAL_C2B_REFERENCE_SUFFIX_LENGTH,
  MIN_REFERENCE_LENGTH as FINANCIAL_C2B_REFERENCE_MIN_LENGTH,
  MAX_REFERENCE_LENGTH as FINANCIAL_C2B_REFERENCE_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialC2BReferenceProps };
