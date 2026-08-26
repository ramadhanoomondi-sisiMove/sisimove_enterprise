// -----------------------------------------------------------------------------
// Financial Account Withdrawal Destination
// -----------------------------------------------------------------------------
//
// Immutable destination snapshot captured by a Financial Account Withdrawal.
//
// This is NOT:
//
// - a destination aggregate;
// - a FinancialDisbursementDestination entity;
// - a repository reference;
// - a FinancialDisbursementDestinationPublicId;
// - a mutable external destination.
//
// The application layer selects the destination before creating the withdrawal.
// The withdrawal then owns this snapshot for the lifetime of the request.
//
// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialAccountWithdrawalDestinationProps {
  /**
   * Destination type.
   *
   * Examples:
   *
   * - MOBILE_MONEY
   * - BANK_ACCOUNT
   * - OTHER
   */
  type: string;

  /**
   * External destination value.
   *
   * Examples:
   *
   * - mobile-money number
   * - bank-account identifier
   * - other payout identifier
   *
   * The value should be normalized/masked at the appropriate application or
   * presentation boundary where necessary.
   */
  value: string;
}

// =============================================================================
// Value Object
// =============================================================================

export class FinancialAccountWithdrawalDestination extends ValueObject<FinancialAccountWithdrawalDestinationProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialAccountWithdrawalDestinationProps) {
    super({
      type: props.type.trim(),
      value: props.value.trim(),
    });
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    type: string,
    value: string,
  ): FinancialAccountWithdrawalDestination {
    const normalizedType = type.trim().toUpperCase();
    const normalizedValue = value.trim();

    if (normalizedType.length === 0) {
      throw new Error(
        'Financial Account Withdrawal destination type must not be empty',
      );
    }

    if (normalizedValue.length === 0) {
      throw new Error(
        'Financial Account Withdrawal destination value must not be empty',
      );
    }

    return new FinancialAccountWithdrawalDestination({
      type: normalizedType,
      value: normalizedValue,
    });
  }

  // ===========================================================================
  // Accessors
  // ===========================================================================

  public get type(): string {
    return this.props.type;
  }

  public get value(): string {
    return this.props.value;
  }

  // ===========================================================================
  // Predicates
  // ===========================================================================

  public isMobileMoney(): boolean {
    return this.props.type === 'MOBILE_MONEY';
  }

  public isBankAccount(): boolean {
    return this.props.type === 'BANK_ACCOUNT';
  }

  public isOther(): boolean {
    return this.props.type === 'OTHER';
  }

  // ===========================================================================
  // Serialization
  // ===========================================================================

  public override toString(): string {
    return `${this.props.type}:${this.props.value}`;
  }
}
