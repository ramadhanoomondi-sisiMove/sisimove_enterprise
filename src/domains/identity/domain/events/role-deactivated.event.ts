// src/domains/authorization/domain/events/role-deactivated.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleDeactivatedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleDeactivated',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      roleId: this.roleId,
      publicId: this.publicId,
      deactivatedAt: this.deactivatedAt,
    };
  }
}
