// src/domains/identity/application/handlers/query-handlers/list-identity-audits.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { IDENTITY_AUDIT_REPOSITORY } from '../../identity-audit.tokens';

import { ListIdentityAuditsQuery } from '../../queries/list-identity-audits.query';

import type { IdentityAuditAggregate } from '../../../domain/aggregates/identity-audit.aggregate';

import type { IdentityAuditFilter } from '../../../domain/repositories/identity-audit-filter';
import type { IdentityAuditRepository } from '../../../domain/repositories/identity-audit.repository';

import { AuditActorType } from '../../../domain/value-objects/audit-actor-type.vo';
import { AuditCorrelationId } from '../../../domain/value-objects/audit-correlation-id.vo';
import { IdentityAuditEventType } from '../../../domain/value-objects/identity-audit-event-type.vo';
import { AuditResourceType } from '../../../domain/value-objects/audit-resource-type.vo';
import { AuditResult } from '../../../domain/value-objects/audit-result.vo';
import { AuditSeverity } from '../../../domain/value-objects/audit-severity.vo';

@Injectable()
export class ListIdentityAuditsHandler implements QueryHandler<
  ListIdentityAuditsQuery,
  readonly IdentityAuditAggregate[]
> {
  constructor(
    @Inject(IDENTITY_AUDIT_REPOSITORY)
    private readonly repository: IdentityAuditRepository,
  ) {}

  execute(
    query: ListIdentityAuditsQuery,
  ): Promise<readonly IdentityAuditAggregate[]> {
    const filter: IdentityAuditFilter = {
      ...(query.identityId !== undefined && {
        identityId: query.identityId,
      }),

      ...(query.actorIdentityId !== undefined && {
        actorIdentityId: query.actorIdentityId,
      }),

      ...(query.actorType !== undefined && {
        actorType: new AuditActorType(query.actorType),
      }),

      ...(query.eventType !== undefined && {
        eventType: new IdentityAuditEventType(query.eventType),
      }),

      ...(query.severity !== undefined && {
        severity: new AuditSeverity(query.severity),
      }),

      ...(query.result !== undefined && {
        result: new AuditResult(query.result),
      }),

      ...(query.resourceType !== undefined && {
        resourceType: new AuditResourceType(query.resourceType),
      }),

      ...(query.resourcePublicId !== undefined && {
        resourcePublicId: query.resourcePublicId,
      }),

      ...(query.correlationId !== undefined && {
        correlationId: new AuditCorrelationId(query.correlationId),
      }),

      ...(query.occurredFrom !== undefined && {
        occurredFrom: query.occurredFrom,
      }),

      ...(query.occurredTo !== undefined && {
        occurredTo: query.occurredTo,
      }),

      ...(query.limit !== undefined && {
        limit: query.limit,
      }),

      ...(query.offset !== undefined && {
        offset: query.offset,
      }),
    };

    return this.repository.find(filter);
  }
}
