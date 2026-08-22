// -----------------------------------------------------------------------------
// Commercial Booking Commission Currency
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface CommercialBookingCommissionCurrencyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const CURRENCY_CODE_LENGTH = 3;

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * ISO 4217 currency code used by a Commercial Booking Commission.
 *
 * The currency is captured as part of the commission assessment snapshot
 * so that the commission remains explicitly denominated in the currency
 * of the associated booking amount.
 */
export class CommercialBookingCommissionCurrency extends ValueObject<CommercialBookingCommissionCurrencyProps> {
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
   * Creates a Commercial Booking Commission currency.
   *
   * The supplied currency code is normalized to uppercase and must contain
   * exactly three alphabetic characters.
   */
  public static create(value: string): CommercialBookingCommissionCurrency {
    const normalized = value.trim().toUpperCase();

    CommercialBookingCommissionCurrency.validate(normalized);

    return new CommercialBookingCommissionCurrency(normalized);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validate(value: string): void {
    if (value.length !== CURRENCY_CODE_LENGTH) {
      throw new Error(
        'Commercial Booking Commission currency must be a 3-letter ISO 4217 currency code',
      );
    }

    if (!/^[A-Z]{3}$/.test(value)) {
      throw new Error(
        'Commercial Booking Commission currency must contain only alphabetic characters',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  public isKes(): boolean {
    return this.props.value === 'KES';
  }

  public isUgx(): boolean {
    return this.props.value === 'UGX';
  }

  public isTzs(): boolean {
    return this.props.value === 'TZS';
  }

  public isRwf(): boolean {
    return this.props.value === 'RWF';
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

export { CURRENCY_CODE_LENGTH as COMMERCIAL_BOOKING_COMMISSION_CURRENCY_CODE_LENGTH };

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { CommercialBookingCommissionCurrencyProps };
