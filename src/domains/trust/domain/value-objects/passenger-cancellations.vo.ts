// src/domains/trust/domain/value-objects/passenger-cancellations.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface PassengerCancellationsProps {
  value: number;
}

export class PassengerCancellations extends ValueObject<PassengerCancellationsProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(
        `Passenger cancellations must be a non-negative integer.`,
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

  get hasCancellations(): boolean {
    return this.props.value > 0;
  }
}
