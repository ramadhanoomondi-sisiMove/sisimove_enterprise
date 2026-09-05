// -----------------------------------------------------------------------------
// Messaging — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Messaging bounded context.
//
// Messaging contains multiple independent aggregate roots:
//
// MessagingConversationAggregate
//
// The MessagingConversationAggregate owns:
//
// MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// MessagingDomainEvent represents events emitted by the Messaging Conversation
// aggregate.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - provide the common base for Messaging domain events;
// - represent events emitted by Messaging aggregate roots;
// - preserve aggregate identity through DomainEvent metadata;
// - preserve correlation and causation metadata;
// - provide a common payload extension point;
// - maintain event version and schema-version metadata;
// - establish the Messaging event boundary;
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
// - create conversations;
// - add participants;
// - remove participants;
// - send messages;
// - edit messages;
// - moderate messages;
// - close conversations.
//
// Those responsibilities belong to the Messaging aggregate and application
// boundaries.
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
// Concrete Messaging events should extend getBasePayload() with only the
// safe, domain-relevant data required by their specific event contract.
//
// -----------------------------------------------------------------------------
//
// Messaging identifiers:
//
// Messaging events may expose safe public identifiers such as:
//
// - conversation publicId;
// - participant publicId;
// - message publicId;
// - journey publicId;
// - booking publicId;
// - member publicId;
// - sender publicId;
// - asset publicId.
//
// Internal UniqueEntityId values should remain inside the domain boundary
// unless a specific integration contract explicitly requires them.
//
// -----------------------------------------------------------------------------
//
// Persistence boundary:
//
// MessagingDomainEvent is a domain-layer abstraction.
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
// Messaging Domain Event
// =============================================================================

/**
 * Base domain event for the Messaging bounded context.
 *
 * Messaging currently exposes the MessagingConversationAggregate as its
 * aggregate boundary.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class MessagingDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Messaging domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Messaging events should extend this payload with only the domain
   * data required by their specific event contract.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
