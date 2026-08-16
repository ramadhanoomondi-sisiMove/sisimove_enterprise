// src/domains/trust/domain/value-objects/completed-provider-journeys.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface CompletedProviderJourneysProps {
  value: number;
}

export class CompletedProviderJourneys extends ValueObject<CompletedProviderJourneysProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(
        `Completed provider journeys must be a non-negative integer.`,
      );
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
