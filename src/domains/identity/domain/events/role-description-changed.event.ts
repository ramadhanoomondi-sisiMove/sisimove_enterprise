// src/domains/authorization/domain/events/role-description-changed.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleDescriptionChangedEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly previousDescription: string | undefined,
    public readonly newDescription: string | undefined,
    public readonly changedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'RoleDescriptionChanged',
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
      previousDescription: this.previousDescription,
      newDescription: this.newDescription,
      changedAt: this.changedAt,
    };
  }
}
