// src/domains/identity/domain/repositories/identity-audit-filter.ts

import type { AuditActorType } from '../value-objects/audit-actor-type.vo';
import type { AuditCorrelationId } from '../value-objects/audit-correlation-id.vo';
import type { IdentityAuditEventType } from '../value-objects/identity-audit-event-type.vo';
import type { AuditResourceType } from '../value-objects/audit-resource-type.vo';
import type { AuditResult } from '../value-objects/audit-result.vo';
import type { AuditSeverity } from '../value-objects/audit-severity.vo';

export interface IdentityAuditFilter {
  readonly identityId?: string;

  readonly actorIdentityId?: string;
  readonly actorType?: AuditActorType;

  readonly correlationId?: AuditCorrelationId;

  readonly eventType?: IdentityAuditEventType;
  readonly severity?: AuditSeverity;
  readonly result?: AuditResult;

  readonly resourceType?: AuditResourceType;
  readonly resourcePublicId?: string;

  readonly occurredFrom?: Date;
  readonly occurredTo?: Date;

  readonly limit?: number;
  readonly offset?: number;
}
