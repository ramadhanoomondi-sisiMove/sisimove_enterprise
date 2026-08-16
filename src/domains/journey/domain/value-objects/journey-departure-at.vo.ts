// src/domains/journey/domain/value-objects/journey-departure-at.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyDepartureAtProps {
  value: Date;
}

export class JourneyDepartureAt extends ValueObject<JourneyDepartureAtProps> {
  constructor(departureAt: Date) {
    if (!(departureAt instanceof Date) || Number.isNaN(departureAt.getTime())) {
      throw new Error('Journey departure time must be a valid date.');
    }

    super({
      value: new Date(departureAt.getTime()),
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
