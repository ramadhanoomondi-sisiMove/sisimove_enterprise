// -----------------------------------------------------------------------------
// sisiMove — Assets
// Asset Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// AssetAggregate
// └── AssetEntity
//
// Asset is an independent aggregate responsible for the lifecycle, ownership,
// classification, visibility, storage metadata, and file metadata of exactly
// one Asset.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE RESPONSIBILITIES
//
// - own exactly one AssetEntity;
// - expose Asset state through the aggregate boundary;
// - coordinate Asset lifecycle transitions;
// - coordinate Asset metadata changes;
// - record Asset lifecycle domain events;
// - preserve correlation/causation metadata for domain events;
// - enforce aggregate-level structural consistency;
// - prevent aggregate operations from bypassing AssetEntity.
//
// -----------------------------------------------------------------------------
//
// THIS AGGREGATE DOES NOT
//
// - validate Identity domain state;
// - load the Identity aggregate;
// - access the filesystem;
// - access AWS S3;
// - access Cloudinary;
// - access Google Cloud Storage;
// - access Azure Blob Storage;
// - upload physical files;
// - delete physical files;
// - generate public URLs;
// - generate signed URLs;
// - inspect file contents;
// - detect MIME types;
// - hash files;
// - process images;
// - process videos;
// - persist itself;
// - access Prisma;
// - communicate with external systems;
// - perform authorization checks.
//
// Physical storage operations belong behind AssetStoragePort.
//
// Application orchestration belongs to application handlers/workflows.
//
// Persistence belongs to infrastructure.
//
// Cross-domain Identity validation belongs to the appropriate application
// workflow or domain policy.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE IDENTITY
//
// Internal identity:
// - AssetEntity.id
//
// Public identity:
// - AssetEntity.publicId
//
// Cross-domain reference:
// - AssetIdentityPublicId
//
// -----------------------------------------------------------------------------
//
// DOMAIN EVENTS
//
// - AssetCreatedEvent
// - AssetUploadedEvent
// - AssetReadyEvent
// - AssetArchivedEvent
// - AssetDeletedEvent
//
// correlationId is required for every state-changing event.
//
// causationId is optional.
//
// -----------------------------------------------------------------------------
//
// CREATION
//
// AssetEntity.create() establishes the initial Asset state.
//
// AssetAggregate.create() wraps the entity and validates aggregate structural
// consistency.
//
// Creation and creation-event recording are intentionally separate operations.
//
// The application command workflow is responsible for invoking recordCreated().
//
// -----------------------------------------------------------------------------
//
// REHYDRATION
//
// AssetAggregate.rehydrate() reconstructs the aggregate from persistence
// without recording domain events.
//
// -----------------------------------------------------------------------------
//
// LIFECYCLE
//
//     UPLOADING
//         │
//         ▼
//      UPLOADED
//         │
//         ▼
//        READY
//         │
//         ▼
//      ARCHIVED
//
//     UPLOADED ───────────────► DELETED
//     READY ──────────────────► DELETED
//     ARCHIVED ───────────────► DELETED
//
// DELETED is terminal.
//
// The aggregate delegates lifecycle state changes to AssetEntity.
//
// Physical storage operations are never performed by the aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AssetEntity } from '../entities/asset.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { AssetCreatedEvent } from '../events/asset-created.event';
import { AssetUploadedEvent } from '../events/asset-uploaded.event';
import { AssetReadyEvent } from '../events/asset-ready.event';
import { AssetArchivedEvent } from '../events/asset-archived.event';
import { AssetDeletedEvent } from '../events/asset-deleted.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AssetException } from '../exceptions/asset.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AssetIdentityPublicId } from '../value-objects/asset-identity-public-id.vo';
import type { AssetType } from '../value-objects/asset-type.vo';
import type { AssetCategory } from '../value-objects/asset-category.vo';
import type { AssetVisibility } from '../value-objects/asset-visibility.vo';
import type { AssetStorageProvider } from '../value-objects/asset-storage-provider.vo';
import type { AssetBucket } from '../value-objects/asset-bucket.vo';
import type { AssetObjectKey } from '../value-objects/asset-object-key.vo';
import type { AssetOriginalFilename } from '../value-objects/asset-original-filename.vo';
import type { AssetMimeType } from '../value-objects/asset-mime-type.vo';
import type { AssetSizeBytes } from '../value-objects/asset-size-bytes.vo';

// =============================================================================
// Props
// =============================================================================

interface AssetAggregateProps {
  /**
   * Root entity owned by the Asset aggregate.
   */
  asset: AssetEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Asset aggregate root.
 *
 * Owns exactly one AssetEntity representing the lifecycle and metadata of
 * exactly one Asset.
 */
export class AssetAggregate extends AggregateRoot<AssetAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AssetAggregateProps) {
    if (props === undefined) {
      throw new AssetException('Asset aggregate properties are required.');
    }

    if (props.asset === undefined) {
      throw new AssetException('Asset aggregate root is required.');
    }

    super(props, props.asset.id, props.asset.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Asset aggregate around a newly created AssetEntity.
   *
   * Entity creation and creation-event recording remain separate operations.
   */
  public static create(asset: AssetEntity): AssetAggregate {
    AssetAggregate.ensureEntity(asset);

    const aggregate = new AssetAggregate({
      asset,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Asset aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(asset: AssetEntity): AssetAggregate {
    AssetAggregate.ensureEntity(asset);

    const aggregate = new AssetAggregate({
      asset,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Asset aggregate root entity.
   */
  public get asset(): AssetEntity {
    return this.props.asset;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.asset.id {
    return this.asset.id;
  }

  /**
   * Public identity of the Asset aggregate.
   */
  public override get publicId(): typeof this.asset.publicId {
    return this.asset.publicId;
  }

  /**
   * Opaque public reference to the Identity associated with this Asset.
   */
  public get ownerIdentityPublicId(): AssetIdentityPublicId | undefined {
    return this.asset.ownerIdentityPublicId;
  }

  /**
   * Determines whether this Asset belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: AssetIdentityPublicId): boolean {
    return this.asset.belongsToIdentity(identityPublicId);
  }

  /**
   * Determines whether the Asset currently has an owner.
   */
  public hasOwner(): boolean {
    return this.asset.hasOwner();
  }

  /**
   * Assigns an Identity as the owner of this Asset.
   *
   * Identity validation remains outside this aggregate.
   */
  public assignOwner(identityPublicId: AssetIdentityPublicId): void {
    this.asset.assignOwner(identityPublicId);
  }

  /**
   * Removes the current Identity owner.
   */
  public removeOwner(): void {
    this.asset.removeOwner();
  }

  // ===========================================================================
  // Classification
  // ===========================================================================

  /**
   * Current Asset type.
   */
  public get type(): AssetType {
    return this.asset.type;
  }

  /**
   * Changes the Asset type.
   */
  public changeType(type: AssetType): void {
    this.asset.changeType(type);
  }

  /**
   * Current Asset category.
   */
  public get category(): AssetCategory {
    return this.asset.category;
  }

  /**
   * Changes the Asset category.
   */
  public changeCategory(category: AssetCategory): void {
    this.asset.changeCategory(category);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Asset lifecycle status.
   */
  public get status(): typeof this.asset.status {
    return this.asset.status;
  }

  /**
   * Determines whether the Asset is uploading.
   */
  public isUploading(): boolean {
    return this.asset.isUploading();
  }

  /**
   * Determines whether the Asset has been uploaded.
   */
  public isUploaded(): boolean {
    return this.asset.isUploaded();
  }

  /**
   * Determines whether the Asset is ready for normal application use.
   */
  public isReady(): boolean {
    return this.asset.isReady();
  }

  /**
   * Determines whether the Asset is archived.
   */
  public isArchived(): boolean {
    return this.asset.isArchived();
  }

  /**
   * Determines whether the Asset is deleted.
   */
  public isDeleted(): boolean {
    return this.asset.isDeleted();
  }

  /**
   * Determines whether the Asset is currently usable.
   *
   * AssetEntity owns the actual usability rule.
   */
  public isUsable(): boolean {
    return this.asset.isUsable();
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records creation of the Asset aggregate.
   *
   * Aggregate construction remains free of application-event metadata.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new AssetCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.ownerIdentityPublicId?.value,
        this.type.value,
        this.category.value,
        this.visibility.value,
        this.storageProvider.value,
        this.bucket.value,
        this.objectKey.value,
        this.originalFilename?.value,
        this.mimeType.value,
        this.sizeBytes.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Upload
  // ===========================================================================

  /**
   * Marks the Asset as successfully uploaded.
   *
   * Lifecycle:
   *
   *     UPLOADING → UPLOADED
   *
   * The application workflow is responsible for completing the physical
   * storage operation before invoking this method.
   *
   * AssetEntity remains responsible for enforcing the actual lifecycle rule.
   */
  public markUploaded(
    correlationId: string,
    uploadedAt: Date = new Date(),
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    AssetAggregate.ensureValidDate(
      uploadedAt,
      'Asset upload timestamp must be valid.',
    );

    this.asset.markUploaded(uploadedAt);

    const effectiveUploadedAt = this.asset.uploadedAt;

    if (effectiveUploadedAt === undefined) {
      throw new AssetException(
        'Uploaded Asset must have an uploaded timestamp.',
      );
    }

    this.addDomainEvent(
      new AssetUploadedEvent(
        this.id.value,
        this.publicId.value,
        this.storageProvider.value,
        this.bucket.value,
        this.objectKey.value,
        this.sizeBytes.value,
        effectiveUploadedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Ready
  // ===========================================================================

  /**
   * Marks the Asset as ready for normal application use.
   *
   * Lifecycle:
   *
   *     UPLOADED → READY
   *
   * The aggregate does not decide whether external processing is required.
   * The application workflow invokes this method when the current Asset
   * readiness criteria have been satisfied.
   *
   * AssetEntity remains responsible for enforcing the lifecycle transition.
   */
  public markReady(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.asset.markReady();

    this.addDomainEvent(
      new AssetReadyEvent(
        this.id.value,
        this.publicId.value,
        this.type.value,
        this.category.value,
        this.visibility.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Archive
  // ===========================================================================

  /**
   * Archives the Asset.
   *
   * Lifecycle:
   *
   *     READY → ARCHIVED
   */
  public archive(
    archivedAt: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    AssetAggregate.ensureValidDate(
      archivedAt,
      'Asset archive timestamp must be valid.',
    );

    this.asset.archive(archivedAt);

    const effectiveArchivedAt = this.asset.archivedAt;

    if (effectiveArchivedAt === undefined) {
      throw new AssetException(
        'Archived Asset must have an archived timestamp.',
      );
    }

    this.addDomainEvent(
      new AssetArchivedEvent(
        this.id.value,
        this.publicId.value,
        effectiveArchivedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes the Asset.
   *
   * Physical storage deletion remains outside the aggregate.
   *
   * Lifecycle:
   *
   *     UPLOADED  → DELETED
   *     READY     → DELETED
   *     ARCHIVED  → DELETED
   *
   * AssetEntity owns the actual transition rules.
   */
  public delete(
    deletedAt: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    AssetAggregate.ensureValidDate(
      deletedAt,
      'Asset deletion timestamp must be valid.',
    );

    this.asset.delete(deletedAt);

    const effectiveDeletedAt = this.asset.deletedAt;

    if (effectiveDeletedAt === undefined) {
      throw new AssetException('Deleted Asset must have a deleted timestamp.');
    }

    this.addDomainEvent(
      new AssetDeletedEvent(
        this.id.value,
        this.publicId.value,
        effectiveDeletedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Visibility
  // ===========================================================================

  /**
   * Current Asset visibility.
   */
  public get visibility(): AssetVisibility {
    return this.asset.visibility;
  }

  /**
   * Determines whether the Asset is public.
   */
  public isPublic(): boolean {
    return this.asset.isPublic();
  }

  /**
   * Determines whether the Asset is private.
   */
  public isPrivate(): boolean {
    return this.asset.isPrivate();
  }

  /**
   * Changes Asset visibility.
   *
   * Visibility changes currently do not have a dedicated Asset domain event.
   */
  public changeVisibility(visibility: AssetVisibility): void {
    this.asset.changeVisibility(visibility);
  }

  // ===========================================================================
  // Storage
  // ===========================================================================

  /**
   * Storage provider responsible for the physical Asset.
   */
  public get storageProvider(): AssetStorageProvider {
    return this.asset.storageProvider;
  }

  /**
   * Logical storage bucket.
   */
  public get bucket(): AssetBucket {
    return this.asset.bucket;
  }

  /**
   * Physical storage object key.
   */
  public get objectKey(): AssetObjectKey {
    return this.asset.objectKey;
  }

  /**
   * Changes storage-provider metadata.
   *
   * Actual physical-object migration remains an application/infrastructure
   * workflow.
   */
  public changeStorageProvider(storageProvider: AssetStorageProvider): void {
    this.asset.changeStorageProvider(storageProvider);
  }

  /**
   * Changes storage-location metadata.
   *
   * Actual physical-object movement remains an application/infrastructure
   * workflow.
   */
  public changeStorageLocation(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): void {
    this.asset.changeStorageLocation(storageProvider, bucket, objectKey);
  }

  // ===========================================================================
  // File Metadata
  // ===========================================================================

  /**
   * Original filename supplied for the Asset.
   */
  public get originalFilename(): AssetOriginalFilename | undefined {
    return this.asset.originalFilename;
  }

  /**
   * MIME type of the Asset.
   */
  public get mimeType(): AssetMimeType {
    return this.asset.mimeType;
  }

  /**
   * Size of the Asset in bytes.
   */
  public get sizeBytes(): AssetSizeBytes {
    return this.asset.sizeBytes;
  }

  /**
   * Updates Asset file metadata.
   *
   * This does not modify the physical object.
   */
  public updateFileMetadata(
    mimeType: AssetMimeType,
    sizeBytes: AssetSizeBytes,
    originalFilename?: AssetOriginalFilename,
  ): void {
    this.asset.updateFileMetadata(mimeType, sizeBytes, originalFilename);
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Timestamp at which the physical Asset upload completed.
   */
  public get uploadedAt(): Date | undefined {
    return this.asset.uploadedAt;
  }

  /**
   * Timestamp at which the Asset was archived.
   */
  public get archivedAt(): Date | undefined {
    return this.asset.archivedAt;
  }

  /**
   * Timestamp at which the Asset was deleted.
   */
  public get deletedAt(): Date | undefined {
    return this.asset.deletedAt;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Asset creation timestamp.
   */
  public get createdAt(): Date {
    return this.asset.createdAt;
  }

  /**
   * Asset last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.asset.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate persistence timestamp.
   *
   * This is persistence-support behavior and does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AssetAggregate.ensureValidDate(
      updatedAt,
      'Asset update timestamp must be valid.',
    );

    this.asset.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the Asset aggregate.
   *
   * Entity-level business invariants remain owned by AssetEntity.
   *
   * Cross-domain Identity validation remains outside this aggregate.
   */
  private ensureAggregateConsistency(): void {
    AssetAggregate.ensureEntity(this.asset);

    if (this.asset.id === undefined) {
      throw new AssetException(
        'Asset aggregate internal identity is required.',
      );
    }

    if (this.asset.publicId === undefined) {
      throw new AssetException('Asset aggregate public identity is required.');
    }

    if (this.hasOwner() !== (this.ownerIdentityPublicId !== undefined)) {
      throw new AssetException(
        'Asset owner state is structurally inconsistent.',
      );
    }

    AssetAggregate.ensureValidDate(
      this.createdAt,
      'Asset creation timestamp must be valid.',
    );

    AssetAggregate.ensureValidDate(
      this.updatedAt,
      'Asset update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new AssetException(
        'Asset updated timestamp cannot be before its creation timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Upload timestamp invariants
    // -------------------------------------------------------------------------

    if (this.isUploading() && this.uploadedAt !== undefined) {
      throw new AssetException(
        'Uploading Asset cannot have an uploaded timestamp.',
      );
    }

    if (
      this.isUploaded() ||
      this.isReady() ||
      this.isArchived() ||
      this.isDeleted()
    ) {
      if (this.uploadedAt === undefined) {
        throw new AssetException(
          'Asset past UPLOADING must have an uploaded timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Archive timestamp invariants
    // -------------------------------------------------------------------------

    if (this.isArchived() && this.archivedAt === undefined) {
      throw new AssetException(
        'Archived Asset must have an archived timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Delete timestamp invariants
    // -------------------------------------------------------------------------

    if (this.isDeleted() && this.deletedAt === undefined) {
      throw new AssetException('Deleted Asset must have a deleted timestamp.');
    }

    // -------------------------------------------------------------------------
    // Terminal-state invariant
    // -------------------------------------------------------------------------

    if (this.isDeleted()) {
      if (this.archivedAt === undefined && this.status.value === 'DELETED') {
        // A deleted Asset does not require an archived timestamp because
        // UPLOADED and READY may transition directly to DELETED.
      }
    }
  }

  // ===========================================================================
  // Entity Guard
  // ===========================================================================

  /**
   * Ensures an AssetEntity exists before it can become the aggregate root.
   */
  private static ensureEntity(
    asset: AssetEntity | undefined,
  ): asserts asset is AssetEntity {
    if (asset === undefined) {
      throw new AssetException('Asset entity is required.');
    }
  }

  // ===========================================================================
  // Correlation Guard
  // ===========================================================================

  /**
   * Ensures a correlation identifier exists before recording a domain event.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new AssetException('Asset operation correlation ID is required.');
    }
  }

  // ===========================================================================
  // Date Guard
  // ===========================================================================

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AssetException(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssetAggregate;
