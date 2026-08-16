// src/domains/trust/domain/value-objects/completed-passenger-journeys.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface CompletedPassengerJourneysProps {
  value: number;
}

export class CompletedPassengerJourneys extends ValueObject<CompletedPassengerJourneysProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(
        `Completed passenger journeys must be a non-negative integer.`,
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
