// src/domains/identity/infrastructure/mappers/identity-audit.persistence.mapper.ts

import type {
  IdentityAudit as PrismaIdentityAudit,
  Prisma,
} from '@prisma/client';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { IdentityAuditAggregate } from '../../domain/aggregates/identity-audit.aggregate';

import { AuditActorType } from '../../domain/value-objects/audit-actor-type.vo';
import { AuditContext } from '../../domain/value-objects/audit-context.vo';
import { AuditCorrelationId } from '../../domain/value-objects/audit-correlation-id.vo';
import { IdentityAuditEventType } from '../../domain/value-objects/identity-audit-event-type.vo';
import { AuditMetadata } from '../../domain/value-objects/audit-metadata.vo';
import { AuditResourceType } from '../../domain/value-objects/audit-resource-type.vo';
import { AuditResult } from '../../domain/value-objects/audit-result.vo';
import { AuditSeverity } from '../../domain/value-objects/audit-severity.vo';
import { IdentityAuditId } from '../../domain/value-objects/identity-audit-id.vo';

export class IdentityAuditPersistenceMapper {
  static toDomain(audit: PrismaIdentityAudit): IdentityAuditAggregate {
    return new IdentityAuditAggregate(
      {
        identityId: audit.identityId ?? undefined,

        actorIdentityId: audit.actorIdentityId ?? undefined,
        actorType: new AuditActorType(audit.actorType),

        eventType: new IdentityAuditEventType(audit.eventType),

        severity: new AuditSeverity(audit.severity),

        result: new AuditResult(audit.result),

        resourceType: new AuditResourceType(audit.resourceType),

        resourcePublicId: audit.resourcePublicId ?? undefined,

        correlationId:
          audit.correlationId !== null
            ? new AuditCorrelationId(audit.correlationId)
            : undefined,

        context: new AuditContext(
          audit.ipAddress ?? undefined,
          audit.userAgent ?? undefined,
        ),

        metadata: new AuditMetadata(audit.metadata ?? {}),

        occurredAt: audit.occurredAt,
        createdAt: audit.createdAt,
      },
      new UniqueEntityId(audit.id),
      new IdentityAuditId(audit.publicId),
    );
  }

  static toPersistence(
    audit: IdentityAuditAggregate,
  ): Prisma.IdentityAuditUncheckedCreateInput {
    return {
      id: audit.id.value,
      publicId: audit.publicId.value,

      identityId: audit.identityId ?? null,

      actorIdentityId: audit.actorIdentityId ?? null,
      actorType: audit.actorType.value,

      eventType: audit.eventType.value,

      severity: audit.severity.value,

      result: audit.result.value,

      resourceType: audit.resourceType.value,

      resourcePublicId: audit.resourcePublicId ?? null,

      correlationId: audit.correlationId?.value ?? null,

      ipAddress: audit.context.ipAddress ?? null,
      userAgent: audit.context.userAgent ?? null,

      metadata: audit.metadata.value,

      occurredAt: audit.occurredAt,
      createdAt: audit.createdAt,
    };
  }
}
