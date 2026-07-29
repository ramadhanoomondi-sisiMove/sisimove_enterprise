// src/domains/identity/domain/value-objects/audit-result.vo.ts

import { AuditResult as AuditResultEnum } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditResultException } from '../exceptions/invalid-audit-result.exception';

interface AuditResultProps {
  value: AuditResultEnum;
}

export class AuditResult extends ValueObject<AuditResultProps> {
  constructor(result: AuditResultEnum) {
    AuditResult.validate(result);

    super({
      value: result,
    });
  }

  get value(): AuditResultEnum {
    return this.props.value;
  }

  private static validate(result: AuditResultEnum): void {
    if (!Object.values(AuditResultEnum).includes(result)) {
      throw new InvalidAuditResultException('Invalid audit result.');
    }
  }
}
