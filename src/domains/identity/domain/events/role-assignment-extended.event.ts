// src/domains/authorization/domain/events/role-assignment-extended.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class RoleAssignmentExtendedEvent extends DomainEvent {
  constructor(
    public readonly identityRoleId: string,
    public readonly identityId: string,
    public readonly roleId: string,
    public readonly expiresAt: Date,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      identityRoleId,
      'IdentityRole',
      'RoleAssignmentExtended',
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
      expiresAt: this.expiresAt,
    };
  }
}
