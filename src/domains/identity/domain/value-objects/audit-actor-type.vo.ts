// src/domains/identity/domain/value-objects/audit-actor-type.vo.ts

import { AuditActorType as AuditActorTypeEnum } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditActorTypeException } from '../exceptions/invalid-audit-actor-type.exception';

interface AuditActorTypeProps {
  value: AuditActorTypeEnum;
}

export class AuditActorType extends ValueObject<AuditActorTypeProps> {
  constructor(actorType: AuditActorTypeEnum) {
    AuditActorType.validate(actorType);

    super({
      value: actorType,
    });
  }

  get value(): AuditActorTypeEnum {
    return this.props.value;
  }

  private static validate(actorType: AuditActorTypeEnum): void {
    if (!Object.values(AuditActorTypeEnum).includes(actorType)) {
      throw new InvalidAuditActorTypeException('Invalid audit actor type.');
    }
  }
}
