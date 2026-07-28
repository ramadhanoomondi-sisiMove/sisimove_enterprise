// src/domains/authorization/domain/events/role-renamed.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleRenamedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly previousName: string,
    public readonly newName: string,
    public readonly renamedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleRenamed',
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
      previousName: this.previousName,
      newName: this.newName,
      renamedAt: this.renamedAt,
    };
  }
}
