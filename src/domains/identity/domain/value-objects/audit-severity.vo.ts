// src/domains/identity/domain/value-objects/audit-severity.vo.ts

import { AuditSeverity as AuditSeverityEnum } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditSeverityException } from '../exceptions/invalid-audit-severity.exception';

interface AuditSeverityProps {
  value: AuditSeverityEnum;
}

export class AuditSeverity extends ValueObject<AuditSeverityProps> {
  constructor(severity: AuditSeverityEnum) {
    AuditSeverity.validate(severity);

    super({
      value: severity,
    });
  }

  get value(): AuditSeverityEnum {
    return this.props.value;
  }

  private static validate(severity: AuditSeverityEnum): void {
    if (!Object.values(AuditSeverityEnum).includes(severity)) {
      throw new InvalidAuditSeverityException('Invalid audit severity.');
    }
  }
}
