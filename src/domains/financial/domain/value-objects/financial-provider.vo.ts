// src/domains/financial/domain/value-objects/financial-provider.vo.ts

// -----------------------------------------------------------------------------
// Financial Provider
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialProviderProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MIN_PROVIDER_LENGTH = 1;
const MAX_PROVIDER_LENGTH = 100;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Identifies an external financial service provider used by the Financial
 * domain.
 *
 * Examples:
 *
 *   MPESA
 *   AIRTEL_MONEY
 *   EQUITY_BANK
 *
 * The provider is intentionally represented as an opaque value rather than
 * an enum because the Financial domain may integrate with additional
 * providers over time without requiring a domain-model change.
 */
export class FinancialProvider extends ValueObject<FinancialProviderProps> {
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
   * Creates a Financial Provider.
   *
   * Provider identifiers are normalized to uppercase.
   */
  public static create(value: string): FinancialProvider {
    const normalized = value.trim().toUpperCase();

    FinancialProvider.validate(normalized);

    return new FinancialProvider(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length < MIN_PROVIDER_LENGTH) {
      throw new Error('Financial Provider must not be empty');
    }

    if (value.length > MAX_PROVIDER_LENGTH) {
      throw new Error(
        `Financial Provider must not exceed ${MAX_PROVIDER_LENGTH} characters`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isMpesa(): boolean {
    return this.props.value === 'MPESA';
  }

  public isAirtelMoney(): boolean {
    return this.props.value === 'AIRTEL_MONEY';
  }

  public isEquityBank(): boolean {
    return this.props.value === 'EQUITY_BANK';
  }

  public equalsProvider(provider: string): boolean {
    return this.props.value === provider.trim().toUpperCase();
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
  MIN_PROVIDER_LENGTH as FINANCIAL_PROVIDER_MIN_LENGTH,
  MAX_PROVIDER_LENGTH as FINANCIAL_PROVIDER_MAX_LENGTH,
};

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { FinancialProviderProps };
