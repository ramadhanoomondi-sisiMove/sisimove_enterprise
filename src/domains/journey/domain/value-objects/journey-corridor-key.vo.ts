// src/domains/journey/domain/value-objects/journey-corridor-key.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface JourneyCorridorKeyProps {
  value: string;
}

export class JourneyCorridorKey extends ValueObject<JourneyCorridorKeyProps> {
  public static readonly MAX_LENGTH = 200;

  constructor(key: string) {
    const normalizedKey = key.trim();

    if (normalizedKey.length === 0) {
      throw new Error('Journey corridor key cannot be empty.');
    }

    if (normalizedKey.length > JourneyCorridorKey.MAX_LENGTH) {
      throw new Error(
        `Journey corridor key cannot exceed ${JourneyCorridorKey.MAX_LENGTH} characters.`,
      );
    }

    super({
      value: normalizedKey,
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
