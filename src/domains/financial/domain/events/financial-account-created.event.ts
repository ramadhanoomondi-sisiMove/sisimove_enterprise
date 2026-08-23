// -----------------------------------------------------------------------------
// Financial Account Created Domain Event
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
  FinancialAccountStatus,
  Currency,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Account is created.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 * The public account identity is included in the payload because it is the
 * externally meaningful identity consumed by other bounded contexts.
 */
export class FinancialAccountCreatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    type: FinancialAccountType,
    status: FinancialAccountStatus,
    ownerPublicId: FinancialAccountOwnerPublicId | undefined,
    currency: Currency,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialAccount',
      'FinancialAccountCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.type = type;
    this.status = status;
    this.ownerPublicId = ownerPublicId;
    this.currency = currency;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public readonly publicId: PublicEntityId;

  public readonly type: FinancialAccountType;

  public readonly status: FinancialAccountStatus;

  public readonly ownerPublicId: FinancialAccountOwnerPublicId | undefined;

  public readonly currency: Currency;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId.toString(),
      type: this.type.toString(),
      status: this.status.toString(),
      ownerPublicId:
        this.ownerPublicId !== undefined
          ? this.ownerPublicId.toString()
          : undefined,
      currency: this.currency.toString(),
    };
  }
}
