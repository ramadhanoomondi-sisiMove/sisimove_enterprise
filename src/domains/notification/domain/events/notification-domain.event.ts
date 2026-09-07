// -----------------------------------------------------------------------------
// Notification — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Notification bounded context.
//
// Notification contains two aggregate roots:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// This base event establishes the common Notification domain-event boundary.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - provide the common base for Notification domain events;
// - represent events emitted by Notification aggregate roots;
// - preserve aggregate identity through DomainEvent metadata;
// - preserve correlation and causation metadata;
// - provide a common payload extension point;
// - maintain event version and schema-version metadata;
// - establish the Notification event boundary;
// - keep event payloads independent of persistence models.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - represent persistence models;
// - access Prisma;
// - access repositories;
// - communicate with external systems;
// - load cross-domain aggregates;
// - validate authorization;
// - send notifications;
// - deliver notifications;
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers.
//
// Those responsibilities belong to the appropriate application and
// infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// Event payload:
//
// DomainEvent provides the common event metadata:
//
// - eventId
// - eventName
// - eventVersion
// - aggregateId
// - aggregateType
// - correlationId
// - causationId
// - eventTimestamp
// - producerPlatform
// - eventSchemaVersion
//
// Aggregate identity remains in DomainEvent.metadata and should not normally
// be duplicated in the event payload.
//
// Concrete Notification events extend getBasePayload() with only the safe,
// domain-relevant data required by their event contract.
//
// -----------------------------------------------------------------------------
//
// Notification identifiers:
//
// Notification events may expose safe public/domain identifiers such as:
//
// - notification publicId;
// - recipient publicId;
// - notification type;
// - notification priority;
// - notification status;
// - notification title;
// - notification body;
// - reference type;
// - reference public ID;
// - event type;
// - event public ID.
//
// Internal UniqueEntityId values remain in DomainEvent.metadata.aggregateId.
//
// -----------------------------------------------------------------------------
//
// Persistence boundary:
//
// NotificationDomainEvent is a domain-layer abstraction.
//
// It must not contain:
//
// - Prisma models;
// - Prisma enums;
// - database clients;
// - repository implementations;
// - database foreign keys;
// - persistence-specific metadata.
//
// Infrastructure is responsible for translating domain events into transport
// or integration representations where required.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// =============================================================================
// Notification Domain Event
// =============================================================================

/**
 * Base domain event for the Notification bounded context.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class NotificationDomainEvent extends DomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      aggregateType,
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );
  }

  // ===========================================================================
  // Base Payload
  // ===========================================================================

  /**
   * Returns the common payload shared by Notification domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Notification events should extend this payload with only the
   * domain data required by their specific event contract.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
