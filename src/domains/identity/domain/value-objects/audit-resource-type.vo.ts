// src/domains/identity/domain/value-objects/audit-resource-type.vo.ts

import { AuditResourceType as AuditResourceTypeEnum } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditResourceTypeException } from '../exceptions/invalid-audit-resource-type.exception';

interface AuditResourceTypeProps {
  value: AuditResourceTypeEnum;
}

export class AuditResourceType extends ValueObject<AuditResourceTypeProps> {
  constructor(resourceType: AuditResourceTypeEnum) {
    AuditResourceType.validate(resourceType);

    super({
      value: resourceType,
    });
  }

  get value(): AuditResourceTypeEnum {
    return this.props.value;
  }

  private static validate(resourceType: AuditResourceTypeEnum): void {
    if (!Object.values(AuditResourceTypeEnum).includes(resourceType)) {
      throw new InvalidAuditResourceTypeException(
        'Invalid audit resource type.',
      );
    }
  }
}
