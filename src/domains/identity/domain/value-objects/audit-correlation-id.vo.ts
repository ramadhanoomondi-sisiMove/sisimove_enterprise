// src/domains/identity/domain/value-objects/audit-correlation-id.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';
import { CorrelationId } from '../../../../foundation/logging/correlation-id';

import { InvalidAuditCorrelationIdException } from '../exceptions/invalid-audit-correlation-id.exception';

interface AuditCorrelationIdProps {
  value: string;
}

export class AuditCorrelationId extends ValueObject<AuditCorrelationIdProps> {
  constructor(correlationId: string) {
    AuditCorrelationId.validate(correlationId);

    super({
      value: correlationId,
    });
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(correlationId: string): void {
    if (!correlationId.trim()) {
      throw new InvalidAuditCorrelationIdException(
        'Correlation ID is required.',
      );
    }

    if (!CorrelationId.validate(correlationId)) {
      throw new InvalidAuditCorrelationIdException(
        'Correlation ID must be a valid UUID.',
      );
    }
  }
}
