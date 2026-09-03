// -----------------------------------------------------------------------------
// Permission Activated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Permission is activated.
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
// This event represents the activation of an existing Permission. It does NOT
// assign the Permission to any Role.
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
 * Emitted when a Permission becomes active.
 *
 * The Permission public identity is included in the payload because it is the
 * externally meaningful identity of the activated Permission.
 */
export class PermissionActivatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    code: string,
    resource: string,
    action: string,
    activatedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Permission',
      'PermissionActivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.code = code;
    this.resource = resource;
    this.action = action;
    this.activatedAt = activatedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Permission.
   */
  public readonly publicId: PublicEntityId;

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
   * Timestamp at which the Permission was activated.
   */
  public readonly activatedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      code: this.code,

      resource: this.resource,

      action: this.action,

      isActive: true,

      activatedAt: this.activatedAt,
    };
  }
}
