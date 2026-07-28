// src/domains/authorization/domain/events/permission-assigned-to-role.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class PermissionAssignedToRoleEvent extends DomainEvent {
  constructor(
    public readonly roleId: string,
    public readonly publicId: string,
    public readonly permissionId: string,
    public readonly assignedAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      roleId,
      'Role',
      'PermissionAssignedToRole',
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
      permissionId: this.permissionId,
      assignedAt: this.assignedAt,
    };
  }
}
