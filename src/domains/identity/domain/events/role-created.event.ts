// -----------------------------------------------------------------------------
// Identity — Role Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Role is created.
//
// Aggregate:
// - RoleAggregate
//
// Aggregate Root:
// - RoleEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// The externally meaningful Role public identity is included in the payload.
//
// This event does NOT:
// - Assign the Role to an Identity.
// - Grant Permissions.
// - Persist IdentityRole.
// - Persist RolePermission.
//
// Those responsibilities belong to their respective boundaries.
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

import type { RoleCode } from '../value-objects/role-code.vo';

import type { RoleName } from '../value-objects/role-name.vo';

// =============================================================================
// Event
// =============================================================================

/**
 * Emitted when a Role is created.
 *
 * RoleCode and RoleName remain domain value objects at the event boundary.
 * They are converted to primitives only when the event payload is serialized.
 */
export class RoleCreatedEvent extends IdentityDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    code: RoleCode,
    name: RoleName,
    description: string | undefined,
    displayOrder: number,
    isSystem: boolean,
    isActive: boolean,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Role',
      'RoleCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.code = code;
    this.name = name;
    this.description = description;
    this.displayOrder = displayOrder;
    this.isSystem = isSystem;
    this.isActive = isActive;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  /**
   * Public identity of the Role.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Stable machine-readable Role code.
   */
  public readonly code: RoleCode;

  /**
   * Human-readable Role name.
   */
  public readonly name: RoleName;

  /**
   * Optional Role description.
   */
  public readonly description: string | undefined;

  /**
   * Administrative display ordering.
   */
  public readonly displayOrder: number;

  /**
   * Indicates whether the Role is system-managed.
   */
  public readonly isSystem: boolean;

  /**
   * Indicates whether the Role is currently active.
   */
  public readonly isActive: boolean;

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      code: this.code.toString(),

      name: this.name.toString(),

      description: this.description,

      displayOrder: this.displayOrder,

      isSystem: this.isSystem,

      isActive: this.isActive,
    };
  }
}
