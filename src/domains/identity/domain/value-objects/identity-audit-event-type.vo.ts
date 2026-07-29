// src/domains/identity/domain/value-objects/identity-audit-event-type.vo.ts

import { IdentityAuditEventType as IdentityAuditEventTypeEnum } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidIdentityAuditEventTypeException } from '../exceptions/invalid-identity-audit-event-type.exception';

interface IdentityAuditEventTypeProps {
  value: IdentityAuditEventTypeEnum;
}

export class IdentityAuditEventType extends ValueObject<IdentityAuditEventTypeProps> {
  constructor(eventType: IdentityAuditEventTypeEnum) {
    IdentityAuditEventType.validate(eventType);

    super({
      value: eventType,
    });
  }

  get value(): IdentityAuditEventTypeEnum {
    return this.props.value;
  }

  private static validate(eventType: IdentityAuditEventTypeEnum): void {
    if (!Object.values(IdentityAuditEventTypeEnum).includes(eventType)) {
      throw new InvalidIdentityAuditEventTypeException(
        'Invalid identity audit event type.',
      );
    }
  }
}
