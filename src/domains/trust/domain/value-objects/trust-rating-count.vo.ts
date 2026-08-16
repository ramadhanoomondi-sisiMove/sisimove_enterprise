// src/domains/trust/domain/value-objects/trust-rating-count.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface TrustRatingCountProps {
  value: number;
}

export class TrustRatingCount extends ValueObject<TrustRatingCountProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count)) {
      throw new Error(`Trust rating count must be an integer.`);
    }

    if (count < 0) {
      throw new Error(`Trust rating count cannot be negative.`);
    }

    super({
      value: count,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get hasRatings(): boolean {
    return this.props.value > 0;
  }

  get isEmpty(): boolean {
    return this.props.value === 0;
  }
}
