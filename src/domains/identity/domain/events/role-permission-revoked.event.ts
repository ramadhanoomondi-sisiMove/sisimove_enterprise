// -----------------------------------------------------------------------------
// Role Permission Revoked Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Permission assignment is revoked from a Role.
//
// Aggregate:
// - RolePermissionAggregate
//
// Aggregate Root:
// - RolePermissionEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// This event represents the removal/revocation of an authorization
// relationship between a Role and a Permission.
//
// It does NOT:
// - Deactivate the Role.
// - Deactivate the Permission.
// - Revoke the Role from an Identity.
// - Modify Identity authentication state.
//
// Those responsibilities belong to their respective authorization boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

import { IdentityDomainEvent } from './identity-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  RolePermissionPermissionPublicId,
  RolePermissionRolePublicId,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Permission assignment is revoked from a Role.
 *
 * The RolePermission aggregate identity is stored in
 * DomainEvent.metadata.aggregateId.
 *
 * The public identities of the Role and Permission are included in the
 * payload because they are the externally meaningful references of the
 * revoked relationship.
 */
export class RolePermissionRevokedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    roleId: RolePermissionRolePublicId,
    permissionId: RolePermissionPermissionPublicId,
    revokedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'RolePermission',
      'RolePermissionRevoked',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.roleId = roleId;
    this.permissionId = permissionId;
    this.revokedAt = revokedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the RolePermission assignment.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Role from which the Permission was revoked.
   */
  public readonly roleId: RolePermissionRolePublicId;

  /**
   * Public identity of the Permission that was revoked.
   */
  public readonly permissionId: RolePermissionPermissionPublicId;

  /**
   * Timestamp at which the Permission assignment was revoked.
   */
  public readonly revokedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      roleId: this.roleId.toString(),

      permissionId: this.permissionId.toString(),

      revokedAt: this.revokedAt,
    };
  }
}
