// src/domains/identity/application/handlers/record-identity-audit.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_AUDIT_EVENT_PUBLISHER,
  IDENTITY_AUDIT_REPOSITORY,
} from '../identity-audit.tokens';

import { RecordIdentityAuditCommand } from '../commands/record-identity-audit.command';

import { IdentityAuditAggregate } from '../../domain/aggregates/identity-audit.aggregate';

import type { IdentityAuditRepository } from '../../domain/repositories/identity-audit.repository';

@Injectable()
export class RecordIdentityAuditHandler implements CommandHandler<
  RecordIdentityAuditCommand,
  void
> {
  constructor(
    @Inject(IDENTITY_AUDIT_REPOSITORY)
    private readonly repository: IdentityAuditRepository,

    @Inject(IDENTITY_AUDIT_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RecordIdentityAuditCommand): Promise<void> {
    const audit = IdentityAuditAggregate.record({
      identityId: command.identityId,

      actorIdentityId: command.actorIdentityId,
      actorType: command.actorType,

      eventType: command.eventType,
      severity: command.severity,
      result: command.result,

      resourceType: command.resourceType,
      resourcePublicId: command.resourcePublicId,

      correlationId: command.correlationId,

      context: command.context,
      metadata: command.metadata,

      occurredAt: command.occurredAt,
    });

    await this.repository.save(audit);

    await this.eventPublisher.publishAll(audit.pullDomainEvents());
  }
}
