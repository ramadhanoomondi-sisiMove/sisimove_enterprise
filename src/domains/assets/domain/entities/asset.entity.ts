// -----------------------------------------------------------------------------
// Asset — Entity
// -----------------------------------------------------------------------------
//
// Represents the Asset entity within the Asset domain.
//
// Aggregate context:
//
// AssetAggregate
// └── AssetEntity
//
// The Asset entity is the authoritative owner of:
//
// - Asset identity;
// - Asset public identity;
// - opaque Identity ownership reference;
// - Asset type;
// - Asset category;
// - Asset lifecycle status;
// - Asset visibility;
// - storage provider;
// - storage bucket;
// - storage object key;
// - original filename;
// - MIME type;
// - file size;
// - upload timestamp;
// - archive timestamp;
// - deletion timestamp;
// - creation timestamp;
// - update timestamp.
//
// Cross-domain Identity references remain opaque and are represented by
// AssetIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Asset identity;
// - maintain Asset public identity;
// - maintain the opaque Identity ownership reference;
// - maintain Asset classification;
// - maintain Asset lifecycle status;
// - maintain Asset visibility;
// - maintain storage metadata;
// - maintain file metadata;
// - manage upload lifecycle;
// - manage archive lifecycle;
// - manage deletion lifecycle;
// - enforce Asset-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
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
// - perform authorization checks;
// - validate Identity domain state.
//
// Physical storage operations belong behind AssetStoragePort.
//
// Workflow orchestration belongs to the application layer.
//
// Persistence belongs to infrastructure.
//
// Cross-domain Identity validation belongs to the appropriate application
// workflow or domain policy.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
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
// The entity does not perform physical storage operations while changing
// lifecycle state. It records the domain state only.
//
// -----------------------------------------------------------------------------
//
// Ownership:
//
// ownerIdentityPublicId is optional because the persistence model permits
// ownerIdentityId to be nullable.
//
// When present, the value is an opaque reference to the Identity aggregate.
// The Asset domain does not load or mutate the referenced Identity.
//
// -----------------------------------------------------------------------------
//
// File metadata:
//
// originalFilename is optional because the persistence model permits null.
//
// mimeType and sizeBytes are required.
//
// Storage metadata:
//
// storageProvider, bucket, and objectKey are required.
//
// objectKey identifies the physical object in storage and is distinct from
// AssetPublicId.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AssetException } from '../exceptions/asset.exception';

import { AssetArchivedException } from '../exceptions/asset-archived.exception';

import { AssetDeletedException } from '../exceptions/asset-deleted.exception';

import { AssetInvalidStatusException } from '../exceptions/asset-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { AssetPublicId } from '../value-objects/asset-public-id.vo';

import type { AssetIdentityPublicId } from '../value-objects/asset-identity-public-id.vo';

import type { AssetType } from '../value-objects/asset-type.vo';

import type { AssetCategory } from '../value-objects/asset-category.vo';

import { AssetStatus } from '../value-objects/asset-status.vo';

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

export interface AssetProps {
  /**
   * Opaque public reference to the Identity that owns the Asset.
   *
   * Optional because the persistence model permits an Asset without a current
   * owner.
   */
  ownerIdentityPublicId: AssetIdentityPublicId | undefined;

  /**
   * Primary media/content type of the Asset.
   */
  type: AssetType;

  /**
   * Functional business category of the Asset.
   */
  category: AssetCategory;

  /**
   * Asset lifecycle status.
   */
  status: AssetStatus;

  /**
   * Asset visibility.
   */
  visibility: AssetVisibility;

  /**
   * Infrastructure storage provider.
   */
  storageProvider: AssetStorageProvider;

  /**
   * Logical storage bucket containing the Asset.
   */
  bucket: AssetBucket;

  /**
   * Physical object key used to locate the Asset in storage.
   */
  objectKey: AssetObjectKey;

  /**
   * Original filename supplied for the Asset.
   *
   * Optional because the persistence model permits null.
   */
  originalFilename: AssetOriginalFilename | undefined;

  /**
   * MIME type of the stored content.
   */
  mimeType: AssetMimeType;

  /**
   * Size of the Asset in bytes.
   */
  sizeBytes: AssetSizeBytes;

  /**
   * Timestamp at which the physical Asset was successfully uploaded.
   */
  uploadedAt: Date | undefined;

  /**
   * Timestamp at which the Asset was archived.
   */
  archivedAt: Date | undefined;

  /**
   * Timestamp at which the Asset was deleted.
   */
  deletedAt: Date | undefined;

  /**
   * Asset creation timestamp.
   */
  createdAt: Date;

  /**
   * Asset last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class AssetEntity extends Entity<AssetProps, AssetPublicId> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: AssetProps,
    id?: UniqueEntityId,
    publicId?: AssetPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Asset entity.
   *
   * A newly created Asset begins in UPLOADING state.
   *
   * The physical object does not need to have been successfully stored yet.
   */
  public static create(
    ownerIdentityPublicId: AssetIdentityPublicId | undefined,
    type: AssetType,
    category: AssetCategory,
    visibility: AssetVisibility,
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
    originalFilename: AssetOriginalFilename | undefined,
    mimeType: AssetMimeType,
    sizeBytes: AssetSizeBytes,
    createdAt: Date = new Date(),
  ): AssetEntity {
    AssetEntity.ensureType(type);

    AssetEntity.ensureCategory(category);

    AssetEntity.ensureVisibility(visibility);

    AssetEntity.ensureStorageProvider(storageProvider);

    AssetEntity.ensureBucket(bucket);

    AssetEntity.ensureObjectKey(objectKey);

    AssetEntity.ensureMimeType(mimeType);

    AssetEntity.ensureSizeBytes(sizeBytes);

    AssetEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AssetEntity.cloneDate(createdAt);

    const entity = new AssetEntity(
      {
        ownerIdentityPublicId,

        type,

        category,

        status: AssetStatus.uploading(),

        visibility,

        storageProvider,

        bucket,

        objectKey,

        originalFilename,

        mimeType,

        sizeBytes,

        uploadedAt: undefined,

        archivedAt: undefined,

        deletedAt: undefined,

        createdAt: timestamp,

        updatedAt: AssetEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new AssetPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Asset entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: AssetProps,
    id: UniqueEntityId,
    publicId: AssetPublicId,
  ): AssetEntity {
    if (props === undefined) {
      throw new AssetException(
        'Asset properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AssetException(
        'Asset internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AssetException(
        'Asset public identity is required for rehydration.',
      );
    }

    AssetEntity.ensureType(props.type);

    AssetEntity.ensureCategory(props.category);

    AssetEntity.ensureStatus(props.status);

    AssetEntity.ensureVisibility(props.visibility);

    AssetEntity.ensureStorageProvider(props.storageProvider);

    AssetEntity.ensureBucket(props.bucket);

    AssetEntity.ensureObjectKey(props.objectKey);

    AssetEntity.ensureMimeType(props.mimeType);

    AssetEntity.ensureSizeBytes(props.sizeBytes);

    AssetEntity.ensureValidDate(props.createdAt, 'creation date');

    AssetEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AssetException(
        'Asset updated date cannot be before creation date.',
      );
    }

    AssetEntity.ensureOptionalDate(props.uploadedAt, 'uploaded date');

    AssetEntity.ensureOptionalDate(props.archivedAt, 'archived date');

    AssetEntity.ensureOptionalDate(props.deletedAt, 'deleted date');

    const entity = new AssetEntity(
      {
        ownerIdentityPublicId: props.ownerIdentityPublicId,

        type: props.type,

        category: props.category,

        status: props.status,

        visibility: props.visibility,

        storageProvider: props.storageProvider,

        bucket: props.bucket,

        objectKey: props.objectKey,

        originalFilename: props.originalFilename,

        mimeType: props.mimeType,

        sizeBytes: props.sizeBytes,

        uploadedAt: AssetEntity.cloneOptionalDate(props.uploadedAt),

        archivedAt: AssetEntity.cloneOptionalDate(props.archivedAt),

        deletedAt: AssetEntity.cloneOptionalDate(props.deletedAt),

        createdAt: AssetEntity.cloneDate(props.createdAt),

        updatedAt: AssetEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Asset entity.
   */
  public override get publicId(): AssetPublicId {
    return super.publicId;
  }

  /**
   * Opaque public reference to the Identity that owns the Asset.
   */
  public get ownerIdentityPublicId(): AssetIdentityPublicId | undefined {
    return this.props.ownerIdentityPublicId;
  }

  /**
   * Determines whether this Asset belongs to the supplied Identity.
   */
  public belongsToIdentity(identityPublicId: AssetIdentityPublicId): boolean {
    if (identityPublicId === undefined) {
      return false;
    }

    if (this.props.ownerIdentityPublicId === undefined) {
      return false;
    }

    return this.props.ownerIdentityPublicId.equals(identityPublicId);
  }

  /**
   * Determines whether the Asset currently has an owner.
   */
  public hasOwner(): boolean {
    return this.props.ownerIdentityPublicId !== undefined;
  }

  /**
   * Assigns an Identity as the owner of the Asset.
   *
   * This changes ownership metadata only. It does not validate the referenced
   * Identity because Identity is owned by another aggregate/domain.
   */
  public assignOwner(identityPublicId: AssetIdentityPublicId): void {
    if (identityPublicId === undefined) {
      throw new AssetException(
        'Asset owner Identity public identity is required.',
      );
    }

    this.ensureMutable();

    if (
      this.props.ownerIdentityPublicId !== undefined &&
      this.props.ownerIdentityPublicId.equals(identityPublicId)
    ) {
      return;
    }

    this.props.ownerIdentityPublicId = identityPublicId;

    this.touch();
  }

  /**
   * Removes the current Identity owner.
   *
   * This mirrors the nullable owner relation in persistence.
   */
  public removeOwner(): void {
    this.ensureMutable();

    if (this.props.ownerIdentityPublicId === undefined) {
      return;
    }

    this.props.ownerIdentityPublicId = undefined;

    this.touch();
  }

  // ===========================================================================
  // Classification
  // ===========================================================================

  /**
   * Current Asset type.
   */
  public get type(): AssetType {
    return this.props.type;
  }

  /**
   * Changes the Asset type.
   */
  public changeType(type: AssetType): void {
    AssetEntity.ensureType(type);

    this.ensureMutable();

    if (this.props.type.equals(type)) {
      return;
    }

    this.props.type = type;

    this.touch();
  }

  /**
   * Current Asset category.
   */
  public get category(): AssetCategory {
    return this.props.category;
  }

  /**
   * Changes the Asset category.
   */
  public changeCategory(category: AssetCategory): void {
    AssetEntity.ensureCategory(category);

    this.ensureMutable();

    if (this.props.category.equals(category)) {
      return;
    }

    this.props.category = category;

    this.touch();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Asset lifecycle status.
   */
  public get status(): AssetStatus {
    return this.props.status;
  }

  /**
   * Determines whether the Asset is uploading.
   */
  public isUploading(): boolean {
    return this.props.status.isUploading();
  }

  /**
   * Determines whether the Asset has been uploaded.
   */
  public isUploaded(): boolean {
    return this.props.status.isUploaded();
  }

  /**
   * Determines whether the Asset is ready for use.
   */
  public isReady(): boolean {
    return this.props.status.isReady();
  }

  /**
   * Determines whether the Asset is archived.
   */
  public isArchived(): boolean {
    return this.props.status.isArchived();
  }

  /**
   * Determines whether the Asset is deleted.
   */
  public isDeleted(): boolean {
    return this.props.status.isDeleted();
  }

  /**
   * Determines whether the Asset can currently be used.
   *
   * Only READY Assets are considered usable.
   */
  public isUsable(): boolean {
    return this.props.status.isUsable();
  }

  /**
   * Marks the Asset as uploaded.
   *
   * The application layer must call this only after the physical object has
   * been successfully stored by AssetStoragePort.
   */
  public markUploaded(uploadedAt: Date = new Date()): void {
    if (!this.isUploading()) {
      throw new AssetInvalidStatusException(
        'Only an uploading Asset can be marked as uploaded.',
      );
    }

    AssetEntity.ensureValidDate(uploadedAt, 'uploaded date');

    const timestamp = AssetEntity.cloneDate(uploadedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AssetException(
        'Asset uploaded date cannot be before creation date.',
      );
    }

    this.props.status = AssetStatus.uploaded();

    this.props.uploadedAt = timestamp;

    this.touch(timestamp);
  }

  /**
   * Marks the Asset as ready for use.
   *
   * READY represents successful completion of any required processing.
   */
  public markReady(): void {
    if (!this.isUploaded()) {
      throw new AssetInvalidStatusException(
        'Only an uploaded Asset can be marked as ready.',
      );
    }

    this.props.status = AssetStatus.ready();

    this.touch();
  }

  /**
   * Archives the Asset.
   *
   * An archived Asset remains retained but is no longer active.
   */
  public archive(archivedAt: Date = new Date()): void {
    if (this.isArchived()) {
      return;
    }

    if (this.isDeleted()) {
      throw new AssetDeletedException('A deleted Asset cannot be archived.');
    }

    if (!this.isReady()) {
      throw new AssetInvalidStatusException(
        'Only a ready Asset can be archived.',
      );
    }

    AssetEntity.ensureValidDate(archivedAt, 'archived date');

    const timestamp = AssetEntity.cloneDate(archivedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AssetException(
        'Asset archived date cannot be before creation date.',
      );
    }

    if (
      this.props.uploadedAt !== undefined &&
      timestamp.getTime() < this.props.uploadedAt.getTime()
    ) {
      throw new AssetException(
        'Asset archived date cannot be before uploaded date.',
      );
    }

    this.props.status = AssetStatus.archived();

    this.props.archivedAt = timestamp;

    this.touch(timestamp);
  }

  /**
   * Marks the Asset as deleted.
   *
   * Deletion is terminal.
   *
   * Physical storage deletion is intentionally outside this entity.
   */
  public delete(deletedAt: Date = new Date()): void {
    if (this.isDeleted()) {
      return;
    }

    AssetEntity.ensureValidDate(deletedAt, 'deleted date');

    const timestamp = AssetEntity.cloneDate(deletedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AssetException(
        'Asset deleted date cannot be before creation date.',
      );
    }

    if (
      this.props.uploadedAt !== undefined &&
      timestamp.getTime() < this.props.uploadedAt.getTime()
    ) {
      throw new AssetException(
        'Asset deleted date cannot be before uploaded date.',
      );
    }

    if (
      this.props.archivedAt !== undefined &&
      timestamp.getTime() < this.props.archivedAt.getTime()
    ) {
      throw new AssetException(
        'Asset deleted date cannot be before archived date.',
      );
    }

    this.props.status = AssetStatus.deleted();

    this.props.deletedAt = timestamp;

    this.touch(timestamp);
  }

  // ===========================================================================
  // Visibility
  // ===========================================================================

  /**
   * Current Asset visibility.
   */
  public get visibility(): AssetVisibility {
    return this.props.visibility;
  }

  /**
   * Determines whether the Asset is public.
   */
  public isPublic(): boolean {
    return this.props.visibility.isPublic();
  }

  /**
   * Determines whether the Asset is private.
   */
  public isPrivate(): boolean {
    return this.props.visibility.isPrivate();
  }

  /**
   * Changes Asset visibility.
   */
  public changeVisibility(visibility: AssetVisibility): void {
    AssetEntity.ensureVisibility(visibility);

    this.ensureMutable();

    if (this.props.visibility.equals(visibility)) {
      return;
    }

    this.props.visibility = visibility;

    this.touch();
  }

  // ===========================================================================
  // Storage
  // ===========================================================================

  /**
   * Storage provider responsible for the physical Asset.
   */
  public get storageProvider(): AssetStorageProvider {
    return this.props.storageProvider;
  }

  /**
   * Changes the storage provider reference.
   *
   * This changes metadata only. Actual object migration belongs to the
   * application/infrastructure workflow.
   */
  public changeStorageProvider(storageProvider: AssetStorageProvider): void {
    AssetEntity.ensureStorageProvider(storageProvider);

    this.ensureMutable();

    if (this.props.storageProvider.equals(storageProvider)) {
      return;
    }

    this.props.storageProvider = storageProvider;

    this.touch();
  }

  /**
   * Logical storage bucket.
   */
  public get bucket(): AssetBucket {
    return this.props.bucket;
  }

  /**
   * Physical storage object key.
   */
  public get objectKey(): AssetObjectKey {
    return this.props.objectKey;
  }

  /**
   * Changes the physical storage reference.
   *
   * Actual object movement or copying belongs to infrastructure.
   */
  public changeStorageLocation(
    storageProvider: AssetStorageProvider,
    bucket: AssetBucket,
    objectKey: AssetObjectKey,
  ): void {
    AssetEntity.ensureStorageProvider(storageProvider);

    AssetEntity.ensureBucket(bucket);

    AssetEntity.ensureObjectKey(objectKey);

    this.ensureMutable();

    this.props.storageProvider = storageProvider;

    this.props.bucket = bucket;

    this.props.objectKey = objectKey;

    this.touch();
  }

  // ===========================================================================
  // File Metadata
  // ===========================================================================

  /**
   * Original filename supplied for the Asset.
   */
  public get originalFilename(): AssetOriginalFilename | undefined {
    return this.props.originalFilename;
  }

  /**
   * MIME type of the Asset.
   */
  public get mimeType(): AssetMimeType {
    return this.props.mimeType;
  }

  /**
   * Size of the Asset in bytes.
   */
  public get sizeBytes(): AssetSizeBytes {
    return this.props.sizeBytes;
  }

  /**
   * Updates file metadata.
   *
   * This is metadata only and does not modify the physical object.
   */
  public updateFileMetadata(
    mimeType: AssetMimeType,
    sizeBytes: AssetSizeBytes,
    originalFilename?: AssetOriginalFilename,
  ): void {
    AssetEntity.ensureMimeType(mimeType);

    AssetEntity.ensureSizeBytes(sizeBytes);

    this.ensureMutable();

    this.props.mimeType = mimeType;

    this.props.sizeBytes = sizeBytes;

    this.props.originalFilename = originalFilename;

    this.touch();
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Timestamp at which the Asset was uploaded.
   */
  public get uploadedAt(): Date | undefined {
    return AssetEntity.cloneOptionalDate(this.props.uploadedAt);
  }

  /**
   * Timestamp at which the Asset was archived.
   */
  public get archivedAt(): Date | undefined {
    return AssetEntity.cloneOptionalDate(this.props.archivedAt);
  }

  /**
   * Timestamp at which the Asset was deleted.
   */
  public get deletedAt(): Date | undefined {
    return AssetEntity.cloneOptionalDate(this.props.deletedAt);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Asset creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return AssetEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Asset last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return AssetEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AssetEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AssetEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AssetException(
        'Asset updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Asset entity-level invariants.
   */
  private validateInvariants(): void {
    AssetEntity.ensureType(this.props.type);

    AssetEntity.ensureCategory(this.props.category);

    AssetEntity.ensureStatus(this.props.status);

    AssetEntity.ensureVisibility(this.props.visibility);

    AssetEntity.ensureStorageProvider(this.props.storageProvider);

    AssetEntity.ensureBucket(this.props.bucket);

    AssetEntity.ensureObjectKey(this.props.objectKey);

    AssetEntity.ensureMimeType(this.props.mimeType);

    AssetEntity.ensureSizeBytes(this.props.sizeBytes);

    AssetEntity.ensureValidDate(this.props.createdAt, 'creation date');

    AssetEntity.ensureValidDate(this.props.updatedAt, 'updated date');

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AssetException(
        'Asset updated date cannot be before creation date.',
      );
    }

    AssetEntity.ensureOptionalDate(this.props.uploadedAt, 'uploaded date');

    AssetEntity.ensureOptionalDate(this.props.archivedAt, 'archived date');

    AssetEntity.ensureOptionalDate(this.props.deletedAt, 'deleted date');

    AssetEntity.validateLifecycleState(this.props);
  }

  // ===========================================================================
  // Lifecycle Invariants
  // ===========================================================================

  /**
   * Validates lifecycle-related invariants.
   */
  private static validateLifecycleState(props: AssetProps): void {
    const status = props.status.value;

    // -------------------------------------------------------------------------
    // UPLOADING
    // -------------------------------------------------------------------------

    if (status === AssetStatus.UPLOADING && props.uploadedAt !== undefined) {
      throw new AssetException(
        'Uploading Asset cannot have an uploaded timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // UPLOADED
    // -------------------------------------------------------------------------

    if (
      (status === AssetStatus.UPLOADED ||
        status === AssetStatus.READY ||
        status === AssetStatus.ARCHIVED ||
        status === AssetStatus.DELETED) &&
      props.uploadedAt === undefined
    ) {
      throw new AssetException(
        'Uploaded, ready, archived, or deleted Asset must have an uploaded timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // ARCHIVED
    // -------------------------------------------------------------------------

    if (status === AssetStatus.ARCHIVED && props.archivedAt === undefined) {
      throw new AssetException(
        'Archived Asset must have an archived timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // NON-ARCHIVED
    // -------------------------------------------------------------------------

    if (
      status !== AssetStatus.ARCHIVED &&
      status !== AssetStatus.DELETED &&
      props.archivedAt !== undefined
    ) {
      throw new AssetException(
        'Only an archived or deleted Asset may retain an archived timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // DELETED
    // -------------------------------------------------------------------------

    if (status === AssetStatus.DELETED && props.deletedAt === undefined) {
      throw new AssetException('Deleted Asset must have a deleted timestamp.');
    }

    // -------------------------------------------------------------------------
    // NON-DELETED
    // -------------------------------------------------------------------------

    if (status !== AssetStatus.DELETED && props.deletedAt !== undefined) {
      throw new AssetException(
        'Only a deleted Asset may have a deleted timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp ordering
    // -------------------------------------------------------------------------

    if (
      props.uploadedAt !== undefined &&
      props.uploadedAt.getTime() < props.createdAt.getTime()
    ) {
      throw new AssetException(
        'Asset uploaded date cannot be before creation date.',
      );
    }

    if (
      props.archivedAt !== undefined &&
      props.uploadedAt !== undefined &&
      props.archivedAt.getTime() < props.uploadedAt.getTime()
    ) {
      throw new AssetException(
        'Asset archived date cannot be before uploaded date.',
      );
    }

    if (
      props.deletedAt !== undefined &&
      props.uploadedAt !== undefined &&
      props.deletedAt.getTime() < props.uploadedAt.getTime()
    ) {
      throw new AssetException(
        'Asset deleted date cannot be before uploaded date.',
      );
    }

    if (
      props.deletedAt !== undefined &&
      props.archivedAt !== undefined &&
      props.deletedAt.getTime() < props.archivedAt.getTime()
    ) {
      throw new AssetException(
        'Asset deleted date cannot be before archived date.',
      );
    }
  }

  // ===========================================================================
  // Mutable State Guard
  // ===========================================================================

  /**
   * Ensures the Asset can still be modified.
   *
   * Deleted Assets are terminal and cannot be mutated.
   */
  private ensureMutable(): void {
    if (this.isDeleted()) {
      throw new AssetDeletedException('A deleted Asset cannot be modified.');
    }

    if (this.isArchived()) {
      throw new AssetArchivedException('An archived Asset cannot be modified.');
    }
  }

  // ===========================================================================
  // Type Guards
  // ===========================================================================

  private static ensureType(type: AssetType): void {
    if (type === undefined) {
      throw new AssetException('Asset type is required.');
    }
  }

  private static ensureCategory(category: AssetCategory): void {
    if (category === undefined) {
      throw new AssetException('Asset category is required.');
    }
  }

  private static ensureStatus(status: AssetStatus): void {
    if (status === undefined) {
      throw new AssetException('Asset status is required.');
    }
  }

  private static ensureVisibility(visibility: AssetVisibility): void {
    if (visibility === undefined) {
      throw new AssetException('Asset visibility is required.');
    }
  }

  private static ensureStorageProvider(
    storageProvider: AssetStorageProvider,
  ): void {
    if (storageProvider === undefined) {
      throw new AssetException('Asset storage provider is required.');
    }
  }

  private static ensureBucket(bucket: AssetBucket): void {
    if (bucket === undefined) {
      throw new AssetException('Asset bucket is required.');
    }
  }

  private static ensureObjectKey(objectKey: AssetObjectKey): void {
    if (objectKey === undefined) {
      throw new AssetException('Asset object key is required.');
    }
  }

  private static ensureMimeType(mimeType: AssetMimeType): void {
    if (mimeType === undefined) {
      throw new AssetException('Asset MIME type is required.');
    }
  }

  private static ensureSizeBytes(sizeBytes: AssetSizeBytes): void {
    if (sizeBytes === undefined) {
      throw new AssetException('Asset size is required.');
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AssetException(`Asset ${fieldName} must be a valid date.`);
    }
  }

  /**
   * Validates an optional Date.
   */
  private static ensureOptionalDate(
    value: Date | undefined,
    fieldName: string,
  ): void {
    if (value === undefined) {
      return;
    }

    AssetEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    AssetEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  /**
   * Creates a defensive optional Date copy.
   */
  private static cloneOptionalDate(value: Date | undefined): Date | undefined {
    if (value === undefined) {
      return undefined;
    }

    return AssetEntity.cloneDate(value);
  }
}
