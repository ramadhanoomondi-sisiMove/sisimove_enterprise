// -----------------------------------------------------------------------------
// Role Deactivated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Role is deactivated.
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
// This event represents the deactivation of an existing Role. It does NOT
// revoke existing IdentityRole assignments or delete RolePermission
// associations.
//
// Those responsibilities belong to the appropriate authorization
// application/domain boundaries.
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
 * Emitted when a Role becomes inactive.
 *
 * The Role public identity is included in the payload because it is the
 * externally meaningful identity of the deactivated Role.
 */
export class RoleDeactivatedEvent extends IdentityDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    code: string,
    deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Role',
      'RoleDeactivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.code = code;
    this.deactivatedAt = deactivatedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Role.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Stable machine-readable Role code.
   */
  public readonly code: string;

  /**
   * Timestamp at which the Role was deactivated.
   */
  public readonly deactivatedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      code: this.code,

      isActive: false,

      deactivatedAt: this.deactivatedAt,
    };
  }
}
