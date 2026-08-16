// src/domains/journey/domain/value-objects/journey-vehicle-year.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyVehicleYearProps {
  value: number;
}

export class JourneyVehicleYear extends ValueObject<JourneyVehicleYearProps> {
  public static readonly MIN_YEAR = 1886;

  constructor(year: number) {
    if (!Number.isInteger(year)) {
      throw new Error('Journey vehicle year must be an integer.');
    }

    if (year < JourneyVehicleYear.MIN_YEAR) {
      throw new Error(
        `Journey vehicle year cannot be earlier than ${JourneyVehicleYear.MIN_YEAR}.`,
      );
    }

    const currentYear = new Date().getUTCFullYear();

    if (year > currentYear + 1) {
      throw new Error(
        `Journey vehicle year cannot be later than ${currentYear + 1}.`,
      );
    }

    super({
      value: year,
    });
  }

  get value(): number {
    return this.props.value;
  }

  get age(): number {
    return new Date().getUTCFullYear() - this.props.value;
  }
}
