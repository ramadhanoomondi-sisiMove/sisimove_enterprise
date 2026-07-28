// src/domains/authorization/domain/events/role-created.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleCreatedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly code: string,
    public readonly name: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleCreated',
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
      code: this.code,
      name: this.name,
    };
  }
}
