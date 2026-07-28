//src/foundation/kernel/domain/public-entity-id.ts
import { randomBytes } from 'crypto';

export class PublicEntityId {
  private static readonly RANDOM_LENGTH = 8;

  private readonly _value: string;

  constructor(value?: string, prefix = 'SM') {
    this._value = value ?? PublicEntityId.generate(prefix);
  }

  get value(): string {
    return this._value;
  }

  equals(id?: PublicEntityId): boolean {
    if (!id) return false;

    return this._value === id._value;
  }

  toString(): string {
    return this._value;
  }

  private static generate(prefix: string): string {
    const randomPart = randomBytes(5)
      .toString('base64')
      .replace(/[^A-Z0-9]/gi, '')
      .substring(0, PublicEntityId.RANDOM_LENGTH)
      .toUpperCase();

    return `${prefix}-${randomPart}`;
  }
}
