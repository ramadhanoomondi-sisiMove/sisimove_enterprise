// -----------------------------------------------------------------------------
// Accounting — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Accounting bounded context.
//
// Accounting contains multiple independent aggregate roots:
//
// AccountingAccountAggregate
// AccountingPeriodAggregate
// AccountingJournalAggregate
//
// AccountingDomainEvent represents events emitted by one of these concrete
// Accounting aggregate roots. It does not represent a fictional parent
// Accounting aggregate or the entire Accounting bounded context.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity[]
//         └── AccountingJournalLineEntity[]
//     └── AccountingPostingReferenceEntity?
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for Accounting domain events.
// - Represent events emitted by Accounting aggregate roots.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation and causation metadata.
// - Provide a common payload extension point for Accounting events.
// - Maintain event version and schema-version metadata.
// - Establish the Accounting event boundary.
// - Keep accounting event payloads independent of persistence models.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent a parent Accounting aggregate.
// - Represent the entire Accounting bounded context.
// - Contain accounting business rules.
// - Access persistence.
// - Access Prisma.
// - Communicate with external systems.
// - Resolve cross-aggregate references.
// - Perform authorization.
// - Calculate journal balances.
// - Post journals.
// - Reverse journals.
// - Open or close accounting periods.
// - Activate or close accounting accounts.
//
// Those responsibilities belong to the appropriate aggregate/application
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
// Concrete Accounting events should extend getBasePayload() with only the
// safe, domain-relevant data required by that event.
//
// -----------------------------------------------------------------------------
//
// Accounting identifiers:
//
// Accounting events may expose safe public identifiers such as:
//
// - accounting account publicId;
// - accounting period publicId;
// - accounting journal publicId;
// - accounting journal entry publicId;
// - accounting journal line publicId;
// - accounting posting reference publicId.
//
// Internal UniqueEntityId values should remain inside the domain boundary
// unless a specific integration contract explicitly requires them.
//
// -----------------------------------------------------------------------------
//
// Monetary data:
//
// Accounting events may expose monetary amounts and currencies where required
// by the event contract.
//
// Monetary values must preserve their accounting meaning:
//
// - amount represents magnitude;
// - debit/credit direction is represented separately;
// - currency is represented explicitly.
//
// Concrete events must not silently convert accounting amounts into signed
// values unless that is explicitly part of the event contract.
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// Accounting aggregates may reference other aggregates through identifiers.
//
// AccountingDomainEvent does not:
//
// - load referenced aggregates;
// - validate referenced aggregates;
// - access repositories;
// - enforce cross-aggregate business rules.
//
// Cross-aggregate coordination belongs to the appropriate application/domain
// workflow.
//
// -----------------------------------------------------------------------------
//
// Persistence boundary:
//
// AccountingDomainEvent is a domain-layer abstraction.
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
// Infrastructure is responsible for translating domain events into whatever
// transport or integration representation is required.
//
// -----------------------------------------------------------------------------
//
// Event immutability:
//
// Concrete Accounting events should expose event data through readonly
// properties and freeze themselves after construction where appropriate.
//
// DomainEvent already freezes its metadata.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Accounting Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Accounting bounded context.
 *
 * Accounting contains multiple independent aggregate roots:
 *
 * - AccountingAccountAggregate
 * - AccountingPeriodAggregate
 * - AccountingJournalAggregate
 *
 * This class therefore represents the concrete Accounting aggregate that
 * emitted an event rather than a fictional parent Accounting aggregate.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class AccountingDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Accounting domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Accounting events should extend this payload with only the
   * domain data required by their specific event contract.
   *
   * Persistence-specific data must not be included here.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
