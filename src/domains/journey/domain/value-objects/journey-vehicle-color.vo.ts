// src/domains/journey/domain/value-objects/journey-vehicle-color.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyVehicleColorProps {
  value: string;
}

export class JourneyVehicleColor extends ValueObject<JourneyVehicleColorProps> {
  public static readonly MAX_LENGTH = 50;

  constructor(color: string) {
    const normalizedColor = color.trim();

    if (normalizedColor.length === 0) {
      throw new Error('Journey vehicle color cannot be empty.');
    }

    if (normalizedColor.length > JourneyVehicleColor.MAX_LENGTH) {
      throw new Error(
        `Journey vehicle color cannot exceed ${JourneyVehicleColor.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedColor,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }
}
