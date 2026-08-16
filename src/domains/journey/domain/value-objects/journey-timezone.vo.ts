// src/domains/journey/domain/value-objects/journey-timezone.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyTimezoneProps {
  value: string;
}

export class JourneyTimezone extends ValueObject<JourneyTimezoneProps> {
  public static readonly DEFAULT = 'Africa/Nairobi';
  public static readonly MAX_LENGTH = 100;

  constructor(timezone: string = JourneyTimezone.DEFAULT) {
    const normalizedTimezone = timezone.trim();

    if (normalizedTimezone.length === 0) {
      throw new Error('Journey timezone cannot be empty.');
    }

    if (normalizedTimezone.length > JourneyTimezone.MAX_LENGTH) {
      throw new Error(
        `Journey timezone cannot exceed ${JourneyTimezone.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedTimezone,
    });
  }

  get value(): string {
    return this.props.value;
  }

  get isAfricaNairobi(): boolean {
    return this.props.value === JourneyTimezone.DEFAULT;
  }
}
