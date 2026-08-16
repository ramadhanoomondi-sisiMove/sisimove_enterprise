// src/domains/journey/domain/value-objects/journey-total-seats.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyTotalSeatsProps {
  value: number;
}

export class JourneyTotalSeats extends ValueObject<JourneyTotalSeatsProps> {
  constructor(seats: number) {
    if (!Number.isInteger(seats) || seats <= 0) {
      throw new Error('Journey total seats must be a positive integer.');
    }

    super({
      value: seats,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isSingleSeat(): boolean {
    return this.props.value === 1;
  }

  get isMultipleSeats(): boolean {
    return this.props.value > 1;
  }
}
