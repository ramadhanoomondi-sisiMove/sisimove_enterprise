// src/domains/identity/domain/aggregates/identity-audit.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { IdentityAuditRecordedEvent } from '../events/identity-audit-recorded.event';

import type { AuditActorType } from '../value-objects/audit-actor-type.vo';
import type { AuditContext } from '../value-objects/audit-context.vo';
import type { AuditCorrelationId } from '../value-objects/audit-correlation-id.vo';
import type { AuditMetadata } from '../value-objects/audit-metadata.vo';
import type { AuditResourceType } from '../value-objects/audit-resource-type.vo';
import type { AuditResult } from '../value-objects/audit-result.vo';
import type { AuditSeverity } from '../value-objects/audit-severity.vo';
import { IdentityAuditId } from '../value-objects/identity-audit-id.vo';
import type { IdentityAuditEventType } from '../value-objects/identity-audit-event-type.vo';

interface IdentityAuditProps {
  identityId: string | undefined;

  actorIdentityId: string | undefined;

  actorType: AuditActorType;

  eventType: IdentityAuditEventType;

  severity: AuditSeverity;

  result: AuditResult;

  resourceType: AuditResourceType;

  resourcePublicId: string | undefined;

  correlationId: AuditCorrelationId | undefined;

  context: AuditContext;

  metadata: AuditMetadata;

  occurredAt: Date;

  createdAt: Date;
}

export class IdentityAuditAggregate extends AggregateRoot<IdentityAuditProps> {
  public constructor(
    props: IdentityAuditProps,
    id?: UniqueEntityId,
    publicId?: IdentityAuditId,
  ) {
    super(props, id, publicId);
  }

  static record(
    event: Omit<IdentityAuditProps, 'createdAt'>,
  ): IdentityAuditAggregate {
    const now = new Date();

    const audit = new IdentityAuditAggregate(
      {
        ...event,
        createdAt: now,
      },
      new UniqueEntityId(),
      new IdentityAuditId(),
    );

    audit.addDomainEvent(
      new IdentityAuditRecordedEvent(
        audit.id.value,
        audit.publicId.value,
        audit.identityId ?? null,
        audit.actorIdentityId ?? null,
        audit.actorType.value,
        audit.eventType.value,
        audit.severity.value,
        audit.result.value,
        audit.resourceType.value,
        audit.resourcePublicId ?? null,
        audit.occurredAt,
        audit.correlationId?.value ?? '',
      ),
    );

    return audit;
  }

  get identityId(): string | undefined {
    return this.props.identityId;
  }

  get actorIdentityId(): string | undefined {
    return this.props.actorIdentityId;
  }

  get actorType(): AuditActorType {
    return this.props.actorType;
  }

  get eventType(): IdentityAuditEventType {
    return this.props.eventType;
  }

  get severity(): AuditSeverity {
    return this.props.severity;
  }

  get result(): AuditResult {
    return this.props.result;
  }

  get resourceType(): AuditResourceType {
    return this.props.resourceType;
  }

  get resourcePublicId(): string | undefined {
    return this.props.resourcePublicId;
  }

  get correlationId(): AuditCorrelationId | undefined {
    return this.props.correlationId;
  }

  get context(): AuditContext {
    return this.props.context;
  }

  get metadata(): AuditMetadata {
    return this.props.metadata;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
