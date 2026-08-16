// src/domains/journey/domain/value-objects/journey-pricing-amount.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyPricingAmountProps {
  value: number;
}

export class JourneyPricingAmount extends ValueObject<JourneyPricingAmountProps> {
  constructor(amount: number) {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error('Journey pricing amount must be a non-negative integer.');
    }

    super({
      value: amount,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isFree(): boolean {
    return this.props.value === 0;
  }

  get hasPrice(): boolean {
    return this.props.value > 0;
  }
}
