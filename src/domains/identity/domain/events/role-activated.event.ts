// -----------------------------------------------------------------------------
// Identity — Role Activated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Role becomes active.
//
// Aggregate:
// - RoleAggregate
//
// Aggregate Root:
// - RoleEntity
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

// =============================================================================
// Event
// =============================================================================

/**
 * Emitted when a Role becomes active.
 *
 * The RoleCode remains a domain value object within the event and is
 * serialized to a string in the event payload.
 */
export class RoleActivatedEvent extends IdentityDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    code: RoleCode,
    activatedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'Role',
      'RoleActivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.code = code;
    this.activatedAt = activatedAt;
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
   * Timestamp at which the Role was activated.
   */
  public readonly activatedAt: Date;

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      code: this.code.toString(),

      isActive: true,

      activatedAt: this.activatedAt,
    };
  }
}
