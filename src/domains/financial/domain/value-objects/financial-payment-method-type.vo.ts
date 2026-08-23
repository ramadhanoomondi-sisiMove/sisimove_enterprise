// src/domains/financial/domain/value-objects/financial-payment-method-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Payment Method Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentMethodTypeProps {
  value: FinancialPaymentMethodTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Types of external payment methods supported by the Financial domain.
 *
 * The payment method type describes how funds are provided to the platform
 * when creating a Financial Payment.
 */
export type FinancialPaymentMethodTypeValue =
  'MOBILE_MONEY' | 'BANK' | 'CARD' | 'WALLET' | 'OTHER';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHOD_TYPES: readonly FinancialPaymentMethodTypeValue[] =
  ['MOBILE_MONEY', 'BANK', 'CARD', 'WALLET', 'OTHER'];

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Represents the type of external payment method associated with a
 * Financial Account.
 */
export class FinancialPaymentMethodType extends ValueObject<FinancialPaymentMethodTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialPaymentMethodTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Payment Method Type.
   *
   * The supplied value is normalized to uppercase before validation.
   */
  public static create(value: string): FinancialPaymentMethodType {
    const normalized = value.trim().toUpperCase();

    FinancialPaymentMethodType.validate(normalized);

    return new FinancialPaymentMethodType(
      normalized as FinancialPaymentMethodTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (
      !FINANCIAL_PAYMENT_METHOD_TYPES.includes(
        value as FinancialPaymentMethodTypeValue,
      )
    ) {
      throw new Error(`Invalid Financial Payment Method Type: ${value}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isMobileMoney(): boolean {
    return this.props.value === 'MOBILE_MONEY';
  }

  public isBank(): boolean {
    return this.props.value === 'BANK';
  }

  public isCard(): boolean {
    return this.props.value === 'CARD';
  }

  public isWallet(): boolean {
    return this.props.value === 'WALLET';
  }

  public isOther(): boolean {
    return this.props.value === 'OTHER';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialPaymentMethodTypeValue {
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

export { FINANCIAL_PAYMENT_METHOD_TYPES };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialPaymentMethodTypeProps };
