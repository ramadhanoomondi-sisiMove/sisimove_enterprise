// src/domains/identity/application/commands/record-identity-audit.command.ts

import { Command } from '../../../../foundation/kernel/application/command';

import type { AuditActorType } from '../../domain/value-objects/audit-actor-type.vo';
import type { AuditContext } from '../../domain/value-objects/audit-context.vo';
import type { AuditCorrelationId } from '../../domain/value-objects/audit-correlation-id.vo';
import type { IdentityAuditEventType } from '../../domain/value-objects/identity-audit-event-type.vo';
import type { AuditMetadata } from '../../domain/value-objects/audit-metadata.vo';
import type { AuditResourceType } from '../../domain/value-objects/audit-resource-type.vo';
import type { AuditResult } from '../../domain/value-objects/audit-result.vo';
import type { AuditSeverity } from '../../domain/value-objects/audit-severity.vo';

export class RecordIdentityAuditCommand extends Command {
  constructor(
    public readonly identityId: string | undefined,

    public readonly actorIdentityId: string | undefined,
    public readonly actorType: AuditActorType,

    public readonly eventType: IdentityAuditEventType,
    public readonly severity: AuditSeverity,
    public readonly result: AuditResult,

    public readonly resourceType: AuditResourceType,
    public readonly resourcePublicId: string | undefined,

    public readonly correlationId: AuditCorrelationId,

    public readonly context: AuditContext,
    public readonly metadata: AuditMetadata,

    public readonly occurredAt: Date,

    public readonly causationId?: string,
  ) {
    super();
  }
}
