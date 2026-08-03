// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { AssetEntity } from '../entities/asset.entity';
import type { AssetModerationEntity } from '../entities/asset-moderation.entity';
import type { AssetProcessingEntity } from '../entities/asset-processing.entity';
import type { AssetReferenceEntity } from '../entities/asset-reference.entity';
import type { AssetScanEntity } from '../entities/asset-scan.entity';
import type { AssetVariantEntity } from '../entities/asset-variant.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  AssetArchivedEvent,
  AssetCreatedEvent,
  AssetDeletedEvent,
  AssetModerationApprovedEvent,
  AssetModerationRejectedEvent,
  AssetProcessingCompletedEvent,
  AssetProcessingStartedEvent,
  AssetScanCompletedEvent,
  AssetUploadedEvent,
  AssetVisibilityChangedEvent,
} from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  AssetAlreadyArchivedException,
  AssetAlreadyDeletedException,
  AssetAlreadyUploadedException,
  AssetModerationNotFoundException,
  AssetNotReadyException,
  AssetProcessingNotFoundException,
  AssetProcessingNotStartedException,
  AssetScanNotFoundException,
  DuplicateAssetReferenceException,
  DuplicateAssetVariantException,
  InvalidAssetStateTransitionException,
  InvalidAssetThreatNameException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  AssetModeratorId,
  AssetThreatName,
  Checksum,
  JsonValue,
  ModerationConfidence,
  ModerationReason,
} from '../value-objects';
import {
  type AssetProcessingOperation,
  type AssetProcessor,
  type AssetReferenceField,
  type AssetResourceType,
  type AssetScanEngine,
  AssetScanStatus,
  type AssetVisibility,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface AssetAggregateProps {
  asset: AssetEntity;

  variants: AssetVariantEntity[];

  references: AssetReferenceEntity[];

  processings: AssetProcessingEntity[];

  scans: AssetScanEntity[];

  moderations: AssetModerationEntity[];
}

export class AssetAggregate extends AggregateRoot<AssetAggregateProps> {
  private constructor(props: AssetAggregateProps) {
    super(props);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  static create(
    asset: AssetEntity,
    correlationId: string,
    causationId?: string,
  ): AssetAggregate {
    const aggregate = new AssetAggregate({
      asset,
      variants: [],
      references: [],
      processings: [],
      scans: [],
      moderations: [],
    });

    aggregate.addDomainEvent(
      new AssetCreatedEvent(
        asset.id.value,
        asset.publicId.value,
        asset.ownerIdentityId?.value ?? null,
        asset.type,
        asset.category,
        correlationId,
        causationId,
      ),
    );

    return aggregate;
  }

  static rehydrate(
    asset: AssetEntity,
    variants: AssetVariantEntity[],
    references: AssetReferenceEntity[],
    processings: AssetProcessingEntity[],
    scans: AssetScanEntity[],
    moderations: AssetModerationEntity[],
  ): AssetAggregate {
    return new AssetAggregate({
      asset,
      variants,
      references,
      processings,
      scans,
      moderations,
    });
  }

  // --------------------------------------------------------------------------
  // Aggregate State
  // --------------------------------------------------------------------------

  get asset(): AssetEntity {
    return this.props.asset;
  }

  get variants(): readonly AssetVariantEntity[] {
    return this.props.variants;
  }

  get references(): readonly AssetReferenceEntity[] {
    return this.props.references;
  }

  get processings(): readonly AssetProcessingEntity[] {
    return this.props.processings;
  }

  get scans(): readonly AssetScanEntity[] {
    return this.props.scans;
  }

  get moderations(): readonly AssetModerationEntity[] {
    return this.props.moderations;
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  override get id() {
    return this.asset.id;
  }

  override get publicId() {
    return this.asset.publicId;
  }

  // --------------------------------------------------------------------------
  // Asset Properties
  // --------------------------------------------------------------------------

  get ownerIdentityId() {
    return this.asset.ownerIdentityId;
  }

  get type() {
    return this.asset.type;
  }

  get category() {
    return this.asset.category;
  }

  get status() {
    return this.asset.status;
  }

  get visibility() {
    return this.asset.visibility;
  }

  get storageProvider() {
    return this.asset.storageProvider;
  }

  get bucket() {
    return this.asset.bucket;
  }

  get objectKey() {
    return this.asset.objectKey;
  }

  get mimeType() {
    return this.asset.mimeType;
  }

  get extension() {
    return this.asset.extension;
  }

  get sizeBytes() {
    return this.asset.sizeBytes;
  }

  get createdAt() {
    return this.asset.createdAt;
  }

  get updatedAt() {
    return this.asset.updatedAt;
  }

  get uploadedAt() {
    return this.asset.uploadedAt;
  }

  get archivedAt() {
    return this.asset.archivedAt;
  }

  get deletedAt() {
    return this.asset.deletedAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  isUploading(): boolean {
    return this.asset.isUploading();
  }

  isUploaded(): boolean {
    return this.asset.isUploaded();
  }

  isScanning(): boolean {
    return this.asset.isScanning();
  }

  isProcessing(): boolean {
    return this.asset.isProcessing();
  }

  isReady(): boolean {
    return this.asset.isReady();
  }

  isArchived(): boolean {
    return this.asset.isArchived();
  }

  isDeleted(): boolean {
    return this.asset.isDeleted();
  }

  // --------------------------------------------------------------------------
  // Variants
  // --------------------------------------------------------------------------

  variantsCount(): number {
    return this.props.variants.length;
  }

  hasVariants(): boolean {
    return this.props.variants.length > 0;
  }

  hasNoVariants(): boolean {
    return this.props.variants.length === 0;
  }

  variant(type: AssetVariantEntity['variant']): AssetVariantEntity | undefined {
    return this.findVariant(type);
  }

  hasVariant(type: AssetVariantEntity['variant']): boolean {
    return this.findVariant(type) !== undefined;
  }

  addVariant(variant: AssetVariantEntity): void {
    if (this.hasVariant(variant.variant)) {
      throw new DuplicateAssetVariantException(variant.variant);
    }

    this.props.variants.push(variant);
  }

  removeVariant(type: AssetVariantEntity['variant']): void {
    const index = this.props.variants.findIndex(
      (variant) => variant.variant === type,
    );

    if (index >= 0) {
      this.props.variants.splice(index, 1);
    }
  }

  latestVariant(): AssetVariantEntity | undefined {
    return this.props.variants.at(-1);
  }

  // --------------------------------------------------------------------------
  // References
  // --------------------------------------------------------------------------

  referencesCount(): number {
    return this.props.references.length;
  }

  hasReferences(): boolean {
    return this.props.references.length > 0;
  }

  hasNoReferences(): boolean {
    return this.props.references.length === 0;
  }

  reference(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): AssetReferenceEntity | undefined {
    return this.findReference(resourceType, resourcePublicId, referenceField);
  }

  hasReference(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): boolean {
    return (
      this.findReference(resourceType, resourcePublicId, referenceField) !==
      undefined
    );
  }

  addReference(reference: AssetReferenceEntity): void {
    if (
      this.hasReference(
        reference.resourceType,
        reference.resourcePublicId,
        reference.referenceField,
      )
    ) {
      throw new DuplicateAssetReferenceException(
        reference.resourceType,
        reference.resourcePublicId,
        reference.referenceField,
      );
    }

    this.props.references.push(reference);
  }

  removeReference(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): void {
    const index = this.props.references.findIndex(
      (reference) =>
        reference.resourceType === resourceType &&
        reference.resourcePublicId === resourcePublicId &&
        reference.referenceField === referenceField,
    );

    if (index >= 0) {
      this.props.references.splice(index, 1);
    }
  }

  latestReference(): AssetReferenceEntity | undefined {
    return this.props.references.at(-1);
  }
  // --------------------------------------------------------------------------
  // Upload Lifecycle
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // Upload
  // --------------------------------------------------------------------------

  public upload(
    checksum: Checksum,
    metadata: JsonValue | undefined,
    uploadedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.asset.isUploaded()) {
      throw new AssetAlreadyUploadedException();
    }

    this.asset.setChecksum(checksum.algorithm, checksum.value, uploadedAt);

    this.asset.setMetadata(metadata, uploadedAt);

    this.asset.markUploaded(uploadedAt);

    this.addDomainEvent(
      new AssetUploadedEvent(
        this.id.value,
        this.publicId.value,
        uploadedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Processing
  // --------------------------------------------------------------------------

  processing(
    operation: AssetProcessingOperation,
  ): AssetProcessingEntity | undefined {
    return this.findProcessing(operation);
  }

  hasProcessing(operation: AssetProcessingOperation): boolean {
    return this.processing(operation) !== undefined;
  }

  startProcessing(
    operation: AssetProcessingOperation,
    processor: AssetProcessor | undefined,
    startedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    const processing = this.findProcessing(operation);

    if (!processing) {
      throw new AssetProcessingNotFoundException(operation);
    }

    // ------------------------------------------------------------------------
    // Start Processing
    // ------------------------------------------------------------------------

    processing.start(processor, startedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetProcessingStartedEvent(
        this.id.value,
        this.publicId.value,
        operation,
        correlationId,
        causationId,
      ),
    );
  }

  completeProcessing(
    operation: AssetProcessingOperation,
    completedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    const processing = this.findProcessing(operation);

    if (!processing) {
      throw new AssetProcessingNotFoundException(operation);
    }

    // ------------------------------------------------------------------------
    // Complete Processing
    // ------------------------------------------------------------------------

    processing.complete(completedAt);

    const processor = processing.processor;

    if (!processor) {
      throw new AssetProcessingNotStartedException(operation);
    }

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetProcessingCompletedEvent(
        this.id.value,
        this.publicId.value,
        operation,
        processor,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Scanning
  // --------------------------------------------------------------------------

  scan(engine: AssetScanEngine): AssetScanEntity | undefined {
    return this.findScan(engine);
  }

  hasScan(engine: AssetScanEngine): boolean {
    return this.scan(engine) !== undefined;
  }

  completeScan(
    engine: AssetScanEngine,
    status: AssetScanStatus,
    threatName: AssetThreatName | undefined,
    scannedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    const scan = this.findScan(engine);

    if (!scan) {
      throw new AssetScanNotFoundException(engine);
    }

    // ------------------------------------------------------------------------
    // Complete Scan
    // ------------------------------------------------------------------------

    switch (status) {
      case AssetScanStatus.CLEAN:
        scan.markClean(scannedAt);
        break;

      case AssetScanStatus.INFECTED:
        if (!threatName) {
          throw new InvalidAssetThreatNameException();
        }

        scan.markInfected(threatName, scannedAt);
        break;

      case AssetScanStatus.FAILED:
        scan.markFailed(scannedAt);
        break;

      default:
        throw new InvalidAssetStateTransitionException(scan.status, status);
    }

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetScanCompletedEvent(
        this.id.value,
        this.publicId.value,
        engine,
        scan.status,
        threatName?.value ?? null,
        correlationId,
        causationId,
      ),
    );
  }
  // --------------------------------------------------------------------------
  // Visibility
  // --------------------------------------------------------------------------

  changeVisibility(
    visibility: AssetVisibility,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.asset.visibility === visibility) {
      return;
    }

    const previousVisibility = this.asset.visibility;

    // ------------------------------------------------------------------------
    // Change Visibility
    // ------------------------------------------------------------------------

    this.asset.changeVisibility(visibility, changedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetVisibilityChangedEvent(
        this.id.value,
        this.publicId.value,
        previousVisibility,
        visibility,
        correlationId,
        causationId,
      ),
    );
  }
  // --------------------------------------------------------------------------
  // Archive
  // --------------------------------------------------------------------------

  archive(archivedAt: Date, correlationId: string, causationId?: string): void {
    if (this.asset.isArchived()) {
      throw new AssetAlreadyArchivedException();
    }

    this.ensureReady();

    // ------------------------------------------------------------------------
    // Archive Asset
    // ------------------------------------------------------------------------

    this.asset.startArchiving(archivedAt);
    this.asset.markArchived(archivedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetArchivedEvent(
        this.id.value,
        this.publicId.value,
        archivedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Delete
  // --------------------------------------------------------------------------

  delete(deletedAt: Date, correlationId: string, causationId?: string): void {
    if (this.asset.isDeleted()) {
      throw new AssetAlreadyDeletedException();
    }

    // ------------------------------------------------------------------------
    // Delete Asset
    // ------------------------------------------------------------------------

    this.asset.startDeleting(deletedAt);
    this.asset.markDeleted(deletedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetDeletedEvent(
        this.id.value,
        this.publicId.value,
        deletedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Moderation
  // --------------------------------------------------------------------------

  moderation(
    type: AssetModerationEntity['type'],
  ): AssetModerationEntity | undefined {
    return this.findModeration(type);
  }

  hasModeration(type: AssetModerationEntity['type']): boolean {
    return this.findModeration(type) !== undefined;
  }

  addModeration(moderation: AssetModerationEntity): void {
    this.props.moderations.push(moderation);
  }

  removeModeration(type: AssetModerationEntity['type']): void {
    const index = this.props.moderations.findIndex(
      (moderation) => moderation.type === type,
    );

    if (index >= 0) {
      this.props.moderations.splice(index, 1);
    }
  }

  latestModeration(): AssetModerationEntity | undefined {
    return this.props.moderations.at(-1);
  }

  approveModeration(
    type: AssetModerationEntity['type'],
    moderatorId: AssetModeratorId | undefined,
    confidence: ModerationConfidence | undefined,
    moderatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    const moderation = this.findModeration(type);

    if (!moderation) {
      throw new AssetModerationNotFoundException(type);
    }

    // ------------------------------------------------------------------------
    // Approve Moderation
    // ------------------------------------------------------------------------

    moderation.approve(moderatorId, confidence, moderatedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetModerationApprovedEvent(
        this.id.value,
        this.publicId.value,
        type,
        moderatorId?.value ?? null,
        confidence?.value ?? null,
        moderatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  rejectModeration(
    type: AssetModerationEntity['type'],
    reason: ModerationReason,
    moderatorId: AssetModeratorId | undefined,
    confidence: ModerationConfidence | undefined,
    moderatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    const moderation = this.findModeration(type);

    if (!moderation) {
      throw new AssetModerationNotFoundException(type);
    }

    // ------------------------------------------------------------------------
    // Reject Moderation
    // ------------------------------------------------------------------------

    moderation.reject(reason, moderatorId, confidence, moderatedAt);

    // ------------------------------------------------------------------------
    // Domain Event
    // ------------------------------------------------------------------------

    this.addDomainEvent(
      new AssetModerationRejectedEvent(
        this.id.value,
        this.publicId.value,
        type,
        reason.value,
        moderatorId?.value ?? null,
        confidence?.value ?? null,
        moderatedAt,
        correlationId,
        causationId,
      ),
    );
  }
  // --------------------------------------------------------------------------
  // Private Helpers
  // --------------------------------------------------------------------------

  private findVariant(
    type: AssetVariantEntity['variant'],
  ): AssetVariantEntity | undefined {
    return this.props.variants.find((variant) => variant.variant === type);
  }

  private findReference(
    resourceType: AssetResourceType,
    resourcePublicId: string,
    referenceField: AssetReferenceField,
  ): AssetReferenceEntity | undefined {
    return this.props.references.find(
      (reference) =>
        reference.resourceType === resourceType &&
        reference.resourcePublicId === resourcePublicId &&
        reference.referenceField === referenceField,
    );
  }

  private findProcessing(
    operation: AssetProcessingOperation,
  ): AssetProcessingEntity | undefined {
    return this.props.processings.find(
      (processing) => processing.operation === operation,
    );
  }

  private findScan(engine: AssetScanEngine): AssetScanEntity | undefined {
    return this.props.scans.find((scan) => scan.engine === engine);
  }

  private findModeration(
    type: AssetModerationEntity['type'],
  ): AssetModerationEntity | undefined {
    return this.props.moderations.find(
      (moderation) => moderation.type === type,
    );
  }

  // --------------------------------------------------------------------------
  // Guards
  // --------------------------------------------------------------------------

  private ensureReady(): void {
    if (!this.asset.isReady()) {
      throw new AssetNotReadyException();
    }
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetAggregate): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
