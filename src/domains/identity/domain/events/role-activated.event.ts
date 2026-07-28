// src/domains/authorization/domain/events/role-activated.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleActivatedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly activatedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleActivated',
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
      activatedAt: this.activatedAt,
    };
  }
}
