// -----------------------------------------------------------------------------
// Permission Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Permission is created.
//
// Aggregate:
// - PermissionAggregate
//
// Aggregate Root:
// - PermissionEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// This event represents the creation of an authorization Permission. It does
// NOT assign the Permission to a Role.
//
// Role-Permission assignment belongs to the RolePermission authorization
// boundary.
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
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Permission is created.
 *
 * The Permission public identity is included in the payload because it is the
 * externally meaningful identity of the newly created Permission.
 */
export class PermissionCreatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    name: string,
    code: string,
    resource: string,
    action: string,
    description: string | undefined,
    isSystem: boolean,
    isActive: boolean,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Permission',
      'PermissionCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.name = name;
    this.code = code;
    this.resource = resource;
    this.action = action;
    this.description = description;
    this.isSystem = isSystem;
    this.isActive = isActive;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Permission.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Human-readable Permission name.
   */
  public readonly name: string;

  /**
   * Stable machine-readable Permission code.
   */
  public readonly code: string;

  /**
   * Resource protected by the Permission.
   */
  public readonly resource: string;

  /**
   * Action authorized by the Permission.
   */
  public readonly action: string;

  /**
   * Optional Permission description.
   */
  public readonly description: string | undefined;

  /**
   * Indicates whether the Permission is system-managed.
   */
  public readonly isSystem: boolean;

  /**
   * Indicates whether the Permission is currently active.
   */
  public readonly isActive: boolean;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      name: this.name,

      code: this.code,

      resource: this.resource,

      action: this.action,

      description: this.description,

      isSystem: this.isSystem,

      isActive: this.isActive,
    };
  }
}
