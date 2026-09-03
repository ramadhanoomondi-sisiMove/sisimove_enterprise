// -----------------------------------------------------------------------------
// Identity Role Assigned Domain Event
// -----------------------------------------------------------------------------

import { IdentityDomainEvent } from './identity-domain.event';

import type {
  IdentityPublicId,
  IdentityRolePublicId,
  RolePublicId,
} from '../value-objects';

/**
 * Emitted when a Role is assigned to an Identity.
 *
 * Aggregate:
 * - IdentityRole
 *
 * Aggregate identity:
 * - DomainEvent.metadata.aggregateId
 *
 * This event records the authorization relationship established between an
 * Identity and a Role.
 *
 * It does not:
 *
 * - create the Identity;
 * - create the Role;
 * - modify Role permissions;
 * - authenticate the Identity;
 * - create authentication credentials;
 * - create a session.
 */
export class IdentityRoleAssignedEvent extends IdentityDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: IdentityRolePublicId,
    identityPublicId: IdentityPublicId,
    rolePublicId: RolePublicId,
    assignedAt: Date,
    assignedByPublicId?: IdentityPublicId,
    expiresAt?: Date,
    correlationId = aggregateId,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'IdentityRole',
      'IdentityRoleAssigned',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.identityPublicId = identityPublicId;
    this.rolePublicId = rolePublicId;
    this.assignedByPublicId = assignedByPublicId;
    this.assignedAt = assignedAt;
    this.expiresAt = expiresAt;
  }

  public readonly publicId: IdentityRolePublicId;

  public readonly identityPublicId: IdentityPublicId;

  public readonly rolePublicId: RolePublicId;

  public readonly assignedByPublicId: IdentityPublicId | undefined;

  public readonly assignedAt: Date;

  public readonly expiresAt: Date | undefined;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      identityPublicId: this.identityPublicId.toString(),

      rolePublicId: this.rolePublicId.toString(),

      assignedByPublicId: this.assignedByPublicId?.toString(),

      assignedAt: this.assignedAt.toISOString(),

      expiresAt: this.expiresAt?.toISOString(),
    };
  }
}
