// src/domains/journey/domain/value-objects/journey-vehicle-registration.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyVehicleRegistrationProps {
  value: string;
}

export class JourneyVehicleRegistration extends ValueObject<JourneyVehicleRegistrationProps> {
  public static readonly MAX_LENGTH = 30;

  constructor(registration: string) {
    const normalizedRegistration = registration.trim().toUpperCase();

    if (normalizedRegistration.length === 0) {
      throw new Error('Journey vehicle registration cannot be empty.');
    }

    if (normalizedRegistration.length > JourneyVehicleRegistration.MAX_LENGTH) {
      throw new Error(
        `Journey vehicle registration cannot exceed ${JourneyVehicleRegistration.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedRegistration,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }
}
