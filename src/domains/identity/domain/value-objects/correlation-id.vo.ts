// src/domains/identity/domain/value-objects/correlation-id.vo.ts

import { randomUUID } from 'node:crypto';

export class CorrelationId {
  private constructor(public readonly value: string) {
    if (!value.trim()) {
      throw new Error('CorrelationId cannot be empty.');
    }

    Object.freeze(this);
  }

  static generate(): CorrelationId {
    return new CorrelationId(randomUUID());
  }

  static from(value: string): CorrelationId {
    return new CorrelationId(value);
  }

  equals(other: CorrelationId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
