// -----------------------------------------------------------------------------
// Journey Demand Currency
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandCurrencyProps {
  value: string;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * ISO-style three-letter currency code.
 *
 * The persistence model defaults to KES.
 */
export class JourneyDemandCurrency extends ValueObject<JourneyDemandCurrencyProps> {
  constructor(currency: string = 'KES') {
    const normalized = currency?.trim().toUpperCase();

    if (!normalized) {
      throw new Error('Journey demand currency cannot be empty.');
    }

    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new Error(
        'Journey demand currency must be a three-letter uppercase currency code.',
      );
    }

    super({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get isKES(): boolean {
    return this.props.value === 'KES';
  }
}
