// src/domains/identity/infrastructure/persistence/prisma-identity-audit.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import type { IdentityAuditAggregate } from '../../domain/aggregates/identity-audit.aggregate';
import type { IdentityAuditFilter } from '../../domain/repositories/identity-audit-filter';
import type { IdentityAuditRepository } from '../../domain/repositories/identity-audit.repository';
import type { IdentityAuditId } from '../../domain/value-objects/identity-audit-id.vo';

import { IdentityAuditPersistenceMapper } from '../mappers/identity-audit.persistence.mapper';

@Injectable()
export class IdentityAuditPrismaRepository implements IdentityAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(audit: IdentityAuditAggregate): Promise<void> {
    const data = IdentityAuditPersistenceMapper.toPersistence(audit);

    await this.prisma.identityAudit.upsert({
      where: {
        id: audit.id.value,
      },
      create: data,
      update: data,
    });
  }

  async update(audit: IdentityAuditAggregate): Promise<void> {
    const data = IdentityAuditPersistenceMapper.toPersistence(audit);

    await this.prisma.identityAudit.update({
      where: {
        id: audit.id.value,
      },
      data,
    });
  }

  async findByPublicId(
    publicId: IdentityAuditId,
  ): Promise<IdentityAuditAggregate | null> {
    const audit = await this.prisma.identityAudit.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return audit === null
      ? null
      : IdentityAuditPersistenceMapper.toDomain(audit);
  }

  async find(
    filter?: IdentityAuditFilter,
  ): Promise<readonly IdentityAuditAggregate[]> {
    const audits = await this.prisma.identityAudit.findMany({
      where: {
        ...(filter?.identityId !== undefined && {
          identityId: filter.identityId,
        }),

        ...(filter?.actorIdentityId !== undefined && {
          actorIdentityId: filter.actorIdentityId,
        }),

        ...(filter?.actorType !== undefined && {
          actorType: filter.actorType.value,
        }),

        ...(filter?.correlationId !== undefined && {
          correlationId: filter.correlationId.value,
        }),

        ...(filter?.eventType !== undefined && {
          eventType: filter.eventType.value,
        }),

        ...(filter?.severity !== undefined && {
          severity: filter.severity.value,
        }),

        ...(filter?.result !== undefined && {
          result: filter.result.value,
        }),

        ...(filter?.resourceType !== undefined && {
          resourceType: filter.resourceType.value,
        }),

        ...(filter?.resourcePublicId !== undefined && {
          resourcePublicId: filter.resourcePublicId,
        }),

        ...((filter?.occurredFrom !== undefined ||
          filter?.occurredTo !== undefined) && {
          occurredAt: {
            ...(filter?.occurredFrom !== undefined && {
              gte: filter.occurredFrom,
            }),

            ...(filter?.occurredTo !== undefined && {
              lte: filter.occurredTo,
            }),
          },
        }),
      },

      orderBy: {
        occurredAt: 'desc',
      },

      ...(filter?.limit !== undefined && {
        take: filter.limit,
      }),

      ...(filter?.offset !== undefined && {
        skip: filter.offset,
      }),
    });

    return audits.map((audit) =>
      IdentityAuditPersistenceMapper.toDomain(audit),
    );
  }

  async exists(publicId: IdentityAuditId): Promise<boolean> {
    const count = await this.prisma.identityAudit.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }
}
