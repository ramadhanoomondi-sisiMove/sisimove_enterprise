// -----------------------------------------------------------------------------
// Role Permission Assigned Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Permission is assigned to a Role.
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
// This event represents the creation of an authorization relationship between
// a Role and a Permission.
//
// It does NOT:
// - Assign the Role to an Identity.
// - Modify the Role.
// - Modify the Permission.
// - Authenticate an Identity.
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
 * Emitted when a Permission is assigned to a Role.
 *
 * The RolePermission aggregate identity is stored in
 * DomainEvent.metadata.aggregateId.
 *
 * The public identities of the Role and Permission are included in the payload
 * because they are the externally meaningful references of the relationship.
 */
export class RolePermissionAssignedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    roleId: RolePermissionRolePublicId,
    permissionId: RolePermissionPermissionPublicId,
    assignedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'RolePermission',
      'RolePermissionAssigned',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.roleId = roleId;
    this.permissionId = permissionId;
    this.assignedAt = assignedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the RolePermission assignment.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Role receiving the Permission.
   */
  public readonly roleId: RolePermissionRolePublicId;

  /**
   * Public identity of the Permission assigned to the Role.
   */
  public readonly permissionId: RolePermissionPermissionPublicId;

  /**
   * Timestamp at which the Permission was assigned to the Role.
   */
  public readonly assignedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      roleId: this.roleId.toString(),

      permissionId: this.permissionId.toString(),

      assignedAt: this.assignedAt,
    };
  }
}
