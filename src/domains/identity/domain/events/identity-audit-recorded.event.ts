// src/domains/identity/domain/events/identity-audit-recorded.event.ts

import type {
  AuditActorType,
  AuditResourceType,
  AuditResult,
  AuditSeverity,
  IdentityAuditEventType,
} from '@prisma/client';

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class IdentityAuditRecordedEvent extends DomainEvent {
  constructor(
    public readonly auditId: string,
    public readonly publicId: string,
    public readonly identityId: string | null,
    public readonly actorIdentityId: string | null,
    public readonly actorType: AuditActorType,
    public readonly eventType: IdentityAuditEventType,
    public readonly severity: AuditSeverity,
    public readonly result: AuditResult,
    public readonly resourceType: AuditResourceType,
    public readonly resourcePublicId: string | null,
    public readonly occurredAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      auditId,
      'IdentityAudit',
      'IdentityAuditRecorded',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      auditId: this.auditId,
      publicId: this.publicId,
      identityId: this.identityId,
      actorIdentityId: this.actorIdentityId,
      actorType: this.actorType,
      eventType: this.eventType,
      severity: this.severity,
      result: this.result,
      resourceType: this.resourceType,
      resourcePublicId: this.resourcePublicId,
      occurredAt: this.occurredAt,
    };
  }
}
