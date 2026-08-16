// src/domains/journey/domain/value-objects/journey-vehicle-model.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyVehicleModelProps {
  value: string;
}

export class JourneyVehicleModel extends ValueObject<JourneyVehicleModelProps> {
  public static readonly MAX_LENGTH = 100;

  constructor(model: string) {
    const normalizedModel = model.trim();

    if (normalizedModel.length === 0) {
      throw new Error('Journey vehicle model cannot be empty.');
    }

    if (normalizedModel.length > JourneyVehicleModel.MAX_LENGTH) {
      throw new Error(
        `Journey vehicle model cannot exceed ${JourneyVehicleModel.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedModel,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }
}
