// src/domains/identity/domain/value-objects/audit-metadata.vo.ts

import type { Prisma } from '@prisma/client';

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidAuditMetadataException } from '../exceptions/invalid-audit-metadata.exception';

interface AuditMetadataProps {
  value: Prisma.InputJsonValue;
}

export class AuditMetadata extends ValueObject<AuditMetadataProps> {
  constructor(metadata: Prisma.InputJsonValue = {}) {
    AuditMetadata.validate(metadata);

    super({
      value: metadata,
    });
  }

  get value(): Prisma.InputJsonValue {
    return this.props.value;
  }

  private static validate(metadata: Prisma.InputJsonValue): void {
    if (metadata === null) {
      throw new InvalidAuditMetadataException('Audit metadata cannot be null.');
    }

    if (Array.isArray(metadata)) {
      throw new InvalidAuditMetadataException(
        'Audit metadata must be a JSON object.',
      );
    }

    if (typeof metadata !== 'object') {
      throw new InvalidAuditMetadataException(
        'Audit metadata must be a JSON object.',
      );
    }
  }
}
