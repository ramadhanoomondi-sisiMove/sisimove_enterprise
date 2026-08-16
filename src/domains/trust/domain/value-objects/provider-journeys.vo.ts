// src/domains/trust/domain/value-objects/provider-journeys.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface ProviderJourneysProps {
  value: number;
}

export class ProviderJourneys extends ValueObject<ProviderJourneysProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Provider journeys must be a non-negative integer.`);
    }

    super({
      value: count,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isEmpty(): boolean {
    return this.props.value === 0;
  }

  get hasJourneys(): boolean {
    return this.props.value > 0;
  }
}
