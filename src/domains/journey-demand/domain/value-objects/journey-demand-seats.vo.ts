// -----------------------------------------------------------------------------
// Journey Demand Seats
// -----------------------------------------------------------------------------

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface JourneyDemandSeatsProps {
  value: number;
}

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

/**
 * Number of seats associated with a Journey Demand or participant.
 */
export class JourneyDemandSeats extends ValueObject<JourneyDemandSeatsProps> {
  constructor(seats: number = 1) {
    if (!Number.isInteger(seats) || seats < 1) {
      throw new Error('Journey demand seats must be a positive integer.');
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

  add(seats: number): JourneyDemandSeats {
    if (!Number.isInteger(seats) || seats < 1) {
      throw new Error(
        'Journey demand seats to add must be a positive integer.',
      );
    }

    return new JourneyDemandSeats(this.props.value + seats);
  }

  subtract(seats: number): JourneyDemandSeats {
    if (!Number.isInteger(seats) || seats < 1) {
      throw new Error(
        'Journey demand seats to subtract must be a positive integer.',
      );
    }

    const result = this.props.value - seats;

    if (result < 1) {
      throw new Error('Journey demand seats cannot be reduced below one.');
    }

    return new JourneyDemandSeats(result);
  }
}
