// src/domains/journey/domain/value-objects/journey-arrival-at.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyArrivalAtProps {
  value: Date;
}

export class JourneyArrivalAt extends ValueObject<JourneyArrivalAtProps> {
  constructor(arrivalAt: Date) {
    if (!(arrivalAt instanceof Date) || Number.isNaN(arrivalAt.getTime())) {
      throw new Error('Journey arrival time must be a valid date.');
    }

    super({
      value: new Date(arrivalAt.getTime()),
    });
  }

  get value(): Date {
    return new Date(this.props.value.getTime());
  }

  get timestamp(): number {
    return this.props.value.getTime();
  }

  isBefore(date: Date): boolean {
    return this.props.value.getTime() < date.getTime();
  }

  isAfter(date: Date): boolean {
    return this.props.value.getTime() > date.getTime();
  }

  isBeforeOrEqual(date: Date): boolean {
    return this.props.value.getTime() <= date.getTime();
  }

  isAfterOrEqual(date: Date): boolean {
    return this.props.value.getTime() >= date.getTime();
  }
}
