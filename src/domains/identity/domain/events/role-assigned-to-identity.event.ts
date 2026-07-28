// src/domains/authorization/domain/events/role-assigned-to-identity.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleAssignedToIdentityEvent extends DomainEvent {
  constructor(
    public readonly identityRoleId: string,
    public readonly identityId: string,
    public readonly roleId: string,
    public readonly assignedById: string | undefined,
    public readonly assignedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      identityRoleId,
      'IdentityRole',
      'RoleAssignedToIdentity',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      identityRoleId: this.identityRoleId,
      identityId: this.identityId,
      roleId: this.roleId,
      assignedById: this.assignedById,
      assignedAt: this.assignedAt,
    };
  }
}
