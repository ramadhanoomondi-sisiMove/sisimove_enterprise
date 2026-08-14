// src/domains/social/domain/value-objects/corridor-key.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

interface CorridorKeyProps {
  value: string | null;
}

export class CorridorKey extends ValueObject<CorridorKeyProps> {
  private static readonly MAX_LENGTH = 100;

  constructor(corridorKey?: string | null) {
    const normalizedCorridorKey =
      corridorKey === null || corridorKey === undefined
        ? null
        : corridorKey.trim().toLowerCase();

    if (
      normalizedCorridorKey !== null &&
      (normalizedCorridorKey.length === 0 ||
        normalizedCorridorKey.length > CorridorKey.MAX_LENGTH)
    ) {
      throw new Error(`Invalid corridor key "${corridorKey}".`);
    }

    super({
      value:
        normalizedCorridorKey === null || normalizedCorridorKey.length === 0
          ? null
          : normalizedCorridorKey,
    });
  }

  get value(): string | null {
    return this.props.value;
  }

  get hasValue(): boolean {
    return this.props.value !== null;
  }
}
