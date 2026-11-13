import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';
import { PublicEntityId as PublicEntityIdValue } from '../../../../foundation/kernel/domain/public-entity-id';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import { FinancialDomainEvent } from './financial-domain.event';
import {
  FinancialAccountOwnerPublicId,
  FinancialAccountStatus,
  FinancialAccountType,
  Currency,
} from '../value-objects';

export class FinancialAccountCreatedEvent extends FinancialDomainEvent {
  constructor(
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
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      'FinancialAccount',
      'FinancialAccountCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      restoredMetadata,
    );

    this.publicId = publicId;
    this.type = type;
    this.status = status;
    this.ownerPublicId = ownerPublicId;
    this.currency = currency;
  }

  readonly publicId: PublicEntityId;
  readonly type: FinancialAccountType;
  readonly status: FinancialAccountStatus;
  readonly ownerPublicId: FinancialAccountOwnerPublicId | undefined;
  readonly currency: Currency;

  public static rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): FinancialAccountCreatedEvent {
    const publicId = this.getRequiredString(payload, 'publicId');
    const type = this.getRequiredString(payload, 'type');
    const status = this.getRequiredString(payload, 'status');
    const currency = this.getRequiredString(payload, 'currency');

    const ownerPublicId = payload.ownerPublicId;

    if (ownerPublicId !== undefined && typeof ownerPublicId !== 'string') {
      throw new Error(
        'Invalid FinancialAccountCreated event payload: ownerPublicId must be a string when provided',
      );
    }

    return new FinancialAccountCreatedEvent(
      metadata.aggregateId,
      new PublicEntityIdValue(publicId),
      FinancialAccountType.create(type),
      FinancialAccountStatus.create(status),
      ownerPublicId !== undefined
        ? FinancialAccountOwnerPublicId.create(ownerPublicId)
        : undefined,
      Currency.create(currency),
      metadata.correlationId ?? '',
      metadata.causationId,
      metadata.eventVersion,
      metadata.eventSchemaVersion,
      metadata,
    );
  }

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

  private static getRequiredString(
    payload: Record<string, unknown>,
    field: string,
  ): string {
    const value = payload[field];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(
        `Invalid FinancialAccountCreated event payload: ${field} must be a non-empty string`,
      );
    }

    return value;
  }
}
