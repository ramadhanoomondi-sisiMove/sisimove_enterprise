// src/domains/financial/domain/value-objects/financial-disbursement-destination-type.vo.ts

// -----------------------------------------------------------------------------
// Financial Disbursement Destination Type
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialDisbursementDestinationTypeProps {
  value: FinancialDisbursementDestinationTypeValue;
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type FinancialDisbursementDestinationTypeValue =
  'MOBILE_MONEY' | 'BANK_ACCOUNT' | 'OTHER';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Defines the type of external destination used by a Financial
 * Disbursement.
 *
 * The destination type describes the channel through which funds
 * are delivered to the account owner.
 */
export class FinancialDisbursementDestinationType extends ValueObject<FinancialDisbursementDestinationTypeProps> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(value: FinancialDisbursementDestinationTypeValue) {
    super({ value });
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a Financial Disbursement Destination Type.
   */
  public static create(value: string): FinancialDisbursementDestinationType {
    const normalized = value.trim().toUpperCase();

    FinancialDisbursementDestinationType.validate(normalized);

    return new FinancialDisbursementDestinationType(
      normalized as FinancialDisbursementDestinationTypeValue,
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    const allowedValues: readonly string[] = [
      'MOBILE_MONEY',
      'BANK_ACCOUNT',
      'OTHER',
    ];

    if (!allowedValues.includes(value)) {
      throw new Error(
        `Invalid Financial Disbursement Destination Type: ${value}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isMobileMoney(): boolean {
    return this.props.value === 'MOBILE_MONEY';
  }

  public isBankAccount(): boolean {
    return this.props.value === 'BANK_ACCOUNT';
  }

  public isOther(): boolean {
    return this.props.value === 'OTHER';
  }

  // ---------------------------------------------------------------------------
  // Accessor
  // ---------------------------------------------------------------------------

  public get value(): FinancialDisbursementDestinationTypeValue {
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

export const FINANCIAL_DISBURSEMENT_DESTINATION_TYPE_MOBILE_MONEY =
  'MOBILE_MONEY' as const;

export const FINANCIAL_DISBURSEMENT_DESTINATION_TYPE_BANK_ACCOUNT =
  'BANK_ACCOUNT' as const;

export const FINANCIAL_DISBURSEMENT_DESTINATION_TYPE_OTHER = 'OTHER' as const;

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialDisbursementDestinationTypeProps };
