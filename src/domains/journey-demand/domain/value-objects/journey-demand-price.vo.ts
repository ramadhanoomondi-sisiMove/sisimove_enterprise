// -----------------------------------------------------------------------------
// Journey Demand Price
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandPriceProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Monetary amount represented in the smallest whole currency unit used by
 * the domain.
 *
 * For KES, this currently corresponds to whole Kenyan shillings because the
 * persistence model uses Int.
 */
export class JourneyDemandPrice extends ValueObject<JourneyDemandPriceProps> {
  constructor(price: number) {
    if (!Number.isInteger(price) || price < 0) {
      throw new Error('Journey demand price must be a non-negative integer.');
    }

    super({
      value: price,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isZero(): boolean {
    return this.props.value === 0;
  }

  get isPositive(): boolean {
    return this.props.value > 0;
  }
}
