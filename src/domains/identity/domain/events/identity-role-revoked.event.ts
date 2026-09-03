// -----------------------------------------------------------------------------
// Identity Role Revoked Domain Event
// -----------------------------------------------------------------------------

import { IdentityDomainEvent } from './identity-domain.event';

import type {
  IdentityPublicId,
  IdentityRolePublicId,
  RolePublicId,
} from '../value-objects';

/**
 * Emitted when a Role assignment is revoked from an Identity.
 *
 * Aggregate:
 * - IdentityRole
 *
 * Aggregate identity:
 * - DomainEvent.metadata.aggregateId
 *
 * This event records the revocation of an authorization relationship.
 *
 * It does not:
 *
 * - delete the Identity;
 * - delete the Role;
 * - modify Role permissions;
 * - authenticate or de-authenticate the Identity.
 */
export class IdentityRoleRevokedEvent extends IdentityDomainEvent {
  public constructor(
    aggregateId: string,
    publicId: IdentityRolePublicId,
    identityPublicId: IdentityPublicId,
    rolePublicId: RolePublicId,
    revokedAt: Date,
    revokedByPublicId?: IdentityPublicId,
    reason?: string,
    correlationId = aggregateId,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'IdentityRole',
      'IdentityRoleRevoked',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.identityPublicId = identityPublicId;
    this.rolePublicId = rolePublicId;
    this.revokedByPublicId = revokedByPublicId;
    this.revokedAt = revokedAt;
    this.reason = reason;
  }

  public readonly publicId: IdentityRolePublicId;

  public readonly identityPublicId: IdentityPublicId;

  public readonly rolePublicId: RolePublicId;

  public readonly revokedByPublicId: IdentityPublicId | undefined;

  public readonly revokedAt: Date;

  public readonly reason: string | undefined;

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      identityPublicId: this.identityPublicId.toString(),

      rolePublicId: this.rolePublicId.toString(),

      revokedByPublicId: this.revokedByPublicId?.toString(),

      revokedAt: this.revokedAt.toISOString(),

      reason: this.reason,
    };
  }
}
