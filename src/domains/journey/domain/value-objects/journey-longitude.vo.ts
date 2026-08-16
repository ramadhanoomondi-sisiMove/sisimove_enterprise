// src/domains/journey/domain/value-objects/journey-longitude.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyLongitudeProps {
  value: number;
}

export class JourneyLongitude extends ValueObject<JourneyLongitudeProps> {
  public static readonly MIN = -180;
  public static readonly MAX = 180;

  constructor(longitude: number) {
    if (!Number.isFinite(longitude)) {
      throw new Error('Journey longitude must be a finite number.');
    }

    if (longitude < JourneyLongitude.MIN || longitude > JourneyLongitude.MAX) {
      throw new Error(
        `Journey longitude must be between ${JourneyLongitude.MIN} and ${JourneyLongitude.MAX}.`,
      );
    }

    super({
      value: longitude,
    });
  }

  get value(): number {
    return this.props.value;
  }
}
