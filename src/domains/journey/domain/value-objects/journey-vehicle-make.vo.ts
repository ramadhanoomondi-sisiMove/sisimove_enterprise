// src/domains/journey/domain/value-objects/journey-vehicle-make.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyVehicleMakeProps {
  value: string;
}

export class JourneyVehicleMake extends ValueObject<JourneyVehicleMakeProps> {
  public static readonly MAX_LENGTH = 100;

  constructor(make: string) {
    const normalizedMake = make.trim();

    if (normalizedMake.length === 0) {
      throw new Error('Journey vehicle make cannot be empty.');
    }

    if (normalizedMake.length > JourneyVehicleMake.MAX_LENGTH) {
      throw new Error(
        `Journey vehicle make cannot exceed ${JourneyVehicleMake.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedMake,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }
}
