// src/domains/trust/domain/value-objects/cancelled-journeys.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface CancelledJourneysProps {
  value: number;
}

export class CancelledJourneys extends ValueObject<CancelledJourneysProps> {
  constructor(count: number = 0) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`Cancelled journeys must be a non-negative integer.`);
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
