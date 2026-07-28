//src/foundation/kernel/domain/unique-entity-id.ts
import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  get value(): string {
    return this._value;
  }

  equals(id?: UniqueEntityId): boolean {
    if (!id) return false;

    return this._value === id._value;
  }

  toString(): string {
    return this._value;
  }
}
