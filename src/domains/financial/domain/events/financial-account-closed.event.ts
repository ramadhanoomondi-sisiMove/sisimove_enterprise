// -----------------------------------------------------------------------------
// Financial Account Closed Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// =============================================================================
// Event
// =============================================================================

/**
 * Emitted when a Financial Account transitions into the CLOSED state.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 * The public account identity is included in the payload as the externally
 * meaningful identity of the Financial Account.
 */
export class FinancialAccountClosedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccount',
      'FinancialAccountClosed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public readonly publicId: PublicEntityId;

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountClosedEvent {
    const { publicId } = payload;

    if (typeof publicId !== 'string') {
      throw new Error('Invalid payload for FinancialAccountClosed event');
    }

    return new FinancialAccountClosedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

  // ===========================================================================
  // Payload
  // ===========================================================================

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
    };
  }
}
