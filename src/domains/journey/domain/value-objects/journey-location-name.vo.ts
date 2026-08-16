// src/domains/journey/domain/value-objects/journey-location-name.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyLocationNameProps {
  value: string;
}

export class JourneyLocationName extends ValueObject<JourneyLocationNameProps> {
  public static readonly MAX_LENGTH = 200;

  constructor(name: string) {
    const normalizedName = name.trim();

    if (normalizedName.length === 0) {
      throw new Error('Journey location name cannot be empty.');
    }

    if (normalizedName.length > JourneyLocationName.MAX_LENGTH) {
      throw new Error(
        `Journey location name cannot exceed ${JourneyLocationName.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedName,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get length(): number {
    return this.props.value.length;
  }

  get isEmpty(): boolean {
    return this.props.value.length === 0;
  }
}
