// src/domains/journey/domain/value-objects/journey-booked-seats.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyBookedSeatsProps {
  value: number;
}

export class JourneyBookedSeats extends ValueObject<JourneyBookedSeatsProps> {
  constructor(seats: number = 0) {
    if (!Number.isInteger(seats) || seats < 0) {
      throw new Error('Journey booked seats must be a non-negative integer.');
    }

    super({
      value: seats,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get isEmpty(): boolean {
    return this.props.value === 0;
  }

  get hasBookings(): boolean {
    return this.props.value > 0;
  }
}
