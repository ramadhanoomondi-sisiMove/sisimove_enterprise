// src/domains/identity/application/queries/list-identity-audits.query.ts

import type {
  AuditActorType,
  AuditResourceType,
  AuditResult,
  AuditSeverity,
  IdentityAuditEventType,
} from '@prisma/client';

export class ListIdentityAuditsQuery {
  constructor(
    public readonly identityId?: string,
    public readonly actorIdentityId?: string,
    public readonly actorType?: AuditActorType,
    public readonly eventType?: IdentityAuditEventType,
    public readonly severity?: AuditSeverity,
    public readonly result?: AuditResult,
    public readonly resourceType?: AuditResourceType,
    public readonly resourcePublicId?: string,
    public readonly correlationId?: string,
    public readonly occurredFrom?: Date,
    public readonly occurredTo?: Date,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}
