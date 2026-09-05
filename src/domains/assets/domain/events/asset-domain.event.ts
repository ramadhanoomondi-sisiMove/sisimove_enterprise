// -----------------------------------------------------------------------------
// Asset — Domain Event
// -----------------------------------------------------------------------------
//
// Base domain event for the Asset aggregate within the Asset bounded context.
//
// The Asset bounded context contains the independent Asset aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// AssetDomainEvent represents events emitted specifically by AssetAggregate.
//
// Aggregate identity is stored in the inherited DomainEvent metadata.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Provide the common base for Asset domain events.
// - Represent events emitted by AssetAggregate.
// - Preserve aggregate identity through DomainEvent metadata.
// - Preserve correlation/causation metadata.
// - Provide a common payload extension point for Asset events.
// - Maintain event version and schema-version metadata.
// - Establish the security boundary for Asset event payloads.
//
// -----------------------------------------------------------------------------
//
// This base event does NOT:
//
// - Represent IdentityAggregate.
// - Represent VerificationAggregate.
// - Represent another domain aggregate.
// - Represent the entire enterprise platform.
// - Contain Asset business rules.
// - Access persistence.
// - Access Prisma.
// - Access filesystem storage.
// - Access AWS S3.
// - Access Cloudinary.
// - Access Google Cloud Storage.
// - Access Azure Blob Storage.
// - Communicate with external systems.
// - Upload physical files.
// - Delete physical files.
// - Generate public URLs.
// - Generate signed URLs.
// - Validate Identity state.
// - Validate Verification state.
// - Perform authorization checks.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// Asset may reference:
//
// - ownerIdentityPublicId
//
// This is an opaque public identifier.
//
// AssetDomainEvent does not resolve, validate, or load the referenced
// Identity aggregate.
//
// Cross-aggregate coordination belongs to the appropriate application or
// domain boundary.
//
// -----------------------------------------------------------------------------
//
// Asset event payload security:
//
// Asset persistence may contain:
//
// - ownerIdentityPublicId;
// - asset identifiers;
// - asset classification;
// - lifecycle status;
// - visibility;
// - storage provider information;
// - storage bucket;
// - storage object key;
// - original filename;
// - MIME type;
// - file size;
// - lifecycle timestamps.
//
// Concrete Asset events should expose only explicitly approved event data.
//
// Domain events must never expose:
//
// - storage credentials;
// - access keys;
// - secret keys;
// - signed URLs;
// - private URLs containing credentials;
// - authentication credentials;
// - passwords;
// - password hashes;
// - access tokens;
// - refresh tokens;
// - OTP values;
// - cryptographic secrets;
// - private keys;
// - other unrelated security material.
//
// Storage metadata may be included when required by the event contract, but
// provider credentials and secret access material must never be included.
//
// -----------------------------------------------------------------------------
//
// DomainEvent foundation:
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
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

// -----------------------------------------------------------------------------
// Asset Domain Event
// -----------------------------------------------------------------------------

/**
 * Base domain event for the Asset aggregate.
 *
 * Asset is an independent aggregate root within the Asset bounded context.
 *
 * Aggregate identity remains in the inherited DomainEvent metadata.
 */
export abstract class AssetDomainEvent extends DomainEvent {
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
   * Returns the common payload shared by Asset domain events.
   *
   * Aggregate identity remains in DomainEvent.metadata and is therefore not
   * duplicated in the event payload.
   *
   * Concrete Asset events should extend this payload with only the data
   * required by their specific domain event.
   *
   * Storage credentials, signed URLs, authentication credentials, and other
   * secrets must never be included.
   */
  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
