// src/domains/journey/domain/value-objects/journey-latitude.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyLatitudeProps {
  value: number;
}

export class JourneyLatitude extends ValueObject<JourneyLatitudeProps> {
  public static readonly MIN = -90;
  public static readonly MAX = 90;

  constructor(latitude: number) {
    if (!Number.isFinite(latitude)) {
      throw new Error('Journey latitude must be a finite number.');
    }

    if (latitude < JourneyLatitude.MIN || latitude > JourneyLatitude.MAX) {
      throw new Error(
        `Journey latitude must be between ${JourneyLatitude.MIN} and ${JourneyLatitude.MAX}.`,
      );
    }

    super({
      value: latitude,
    });
  }

  get value(): number {
    return this.props.value;
  }
}
