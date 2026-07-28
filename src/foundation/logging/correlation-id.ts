// src/foundation/logging/correlation-id.ts

import { randomUUID } from 'crypto';

export class CorrelationId {
  static generate(): string {
    return randomUUID();
  }

  static validate(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(value);
  }
}
