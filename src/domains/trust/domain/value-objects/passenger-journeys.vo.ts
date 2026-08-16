// src/domains/trust/domain/value-objects/passenger-journeys.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface PassengerJourneysProps {
  value: number;
}

export class PassengerJourneys extends ValueObject<PassengerJourneysProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Passenger journeys must be a non-negative integer.`);
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
