// -----------------------------------------------------------------------------
// Support — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Support bounded context.
//
// Support currently contains one aggregate root:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// This base event establishes the common Support Case domain-event boundary.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - provide the common base for Support Case domain events;
// - represent events emitted by SupportCaseAggregate;
// - preserve aggregate identity through DomainEvent metadata;
// - preserve correlation and causation metadata;
// - provide a common payload extension point;
// - maintain event version and schema-version metadata;
// - establish the Support event boundary;
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
// - resolve Identity references;
// - resolve Journey references;
// - resolve Booking references;
// - resolve Financial references;
// - resolve Trust references;
// - resolve Asset references.
//
// Those responsibilities belong to the appropriate application and
// infrastructure boundaries.
//
// -----------------------------------------------------------------------------
//
// Event metadata:
//
// DomainEvent provides:
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
// Aggregate identity remains in DomainEvent.metadata.aggregateId and should
// not normally be duplicated in the event payload.
//
// -----------------------------------------------------------------------------
//
// Support Case identifiers:
//
// Support Case events may expose:
//
// - support case public ID;
// - requester public ID;
// - assigned-to public ID;
// - reference type;
// - reference public ID;
// - status;
// - priority;
// - category;
// - subject;
// - description;
// - lifecycle timestamps.
//
// Cross-domain identifiers remain opaque primitive values in event payloads.
// They are not converted into objects from other bounded contexts.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// =============================================================================
// Support Case Domain Event
// =============================================================================

/**
 * Base domain event for the Support bounded context.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class SupportCaseDomainEvent extends DomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  protected constructor(
    aggregateId: string,
    eventName: string,
    correlationId?: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'SupportCase',
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
   * Returns the common payload shared by Support Case domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Support Case events should extend this payload with only the
   * domain data required by their specific event contract.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
