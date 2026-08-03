// src/domains/assets/domain/entities/asset.entity.ts

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { InvalidAssetStateTransitionException } from '../exceptions';

import { StatefulEntity } from './stateful-entity';

import type {
  AssetCategory,
  AssetId,
  AssetOwnerIdentityId,
  ChecksumAlgorithm,
  JsonValue,
  StorageProvider,
} from '../value-objects';

import { AssetType, AssetVisibility } from '../value-objects';

import { AssetStatus } from '../value-objects';

export interface AssetProps {
  publicId: AssetId;

  ownerIdentityId: AssetOwnerIdentityId | undefined;

  type: AssetType;
  category: AssetCategory;
  status: AssetStatus;
  visibility: AssetVisibility;

  storageProvider: StorageProvider;

  bucket: string;
  objectKey: string;

  originalFilename: string | undefined;
  storedFilename: string | undefined;

  mimeType: string;
  extension: string | undefined;

  sizeBytes: bigint;

  checksumAlgorithm: ChecksumAlgorithm | undefined;
  checksum: string | undefined;

  width: number | undefined;
  height: number | undefined;
  colorDepth: number | undefined;

  durationSeconds: number | undefined;
  bitrate: number | undefined;
  frameRate: number | undefined;

  blurHash: string | undefined;

  metadata: JsonValue | undefined;

  uploadedAt: Date | undefined;

  archivedAt: Date | undefined;
  deletedAt: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class AssetEntity extends StatefulEntity<
  AssetProps,
  AssetStatus,
  AssetId
> {
  private static readonly ALLOWED_TRANSITIONS = new Map<
    AssetStatus,
    readonly AssetStatus[]
  >([
    [AssetStatus.UPLOADING, [AssetStatus.UPLOADED, AssetStatus.DELETING]],
    [AssetStatus.UPLOADED, [AssetStatus.SCANNING, AssetStatus.DELETING]],
    [
      AssetStatus.SCANNING,
      [
        AssetStatus.SCAN_FAILED,
        AssetStatus.PROCESSING,
        AssetStatus.READY,
        AssetStatus.DELETING,
      ],
    ],
    [AssetStatus.SCAN_FAILED, [AssetStatus.SCANNING, AssetStatus.DELETING]],
    [
      AssetStatus.PROCESSING,
      [AssetStatus.PROCESSING_FAILED, AssetStatus.READY, AssetStatus.DELETING],
    ],
    [
      AssetStatus.PROCESSING_FAILED,
      [AssetStatus.PROCESSING, AssetStatus.DELETING],
    ],
    [AssetStatus.READY, [AssetStatus.ARCHIVING, AssetStatus.DELETING]],
    [AssetStatus.ARCHIVING, [AssetStatus.ARCHIVED, AssetStatus.DELETING]],
    [AssetStatus.ARCHIVED, [AssetStatus.DELETING]],
    [AssetStatus.DELETING, [AssetStatus.DELETED]],
    [AssetStatus.DELETED, []],
  ]);

  private constructor(props: AssetProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetProps): AssetEntity {
    return new AssetEntity(props);
  }

  public static rehydrate(props: AssetProps, id: UniqueEntityId): AssetEntity {
    return new AssetEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // State Machine
  // --------------------------------------------------------------------------

  protected override get allowedTransitions(): ReadonlyMap<
    AssetStatus,
    readonly AssetStatus[]
  > {
    return AssetEntity.ALLOWED_TRANSITIONS;
  }

  protected override onInvalidTransition(
    current: AssetStatus,
    next: AssetStatus,
  ): never {
    throw new InvalidAssetStateTransitionException(current, next);
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  override get publicId(): AssetId {
    return this.props.publicId;
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get ownerIdentityId(): AssetOwnerIdentityId | undefined {
    return this.props.ownerIdentityId;
  }

  get type(): AssetType {
    return this.props.type;
  }

  get category(): AssetCategory {
    return this.props.category;
  }

  override get status(): AssetStatus {
    return this.props.status;
  }

  get visibility(): AssetVisibility {
    return this.props.visibility;
  }

  get storageProvider(): StorageProvider {
    return this.props.storageProvider;
  }

  get bucket(): string {
    return this.props.bucket;
  }

  get objectKey(): string {
    return this.props.objectKey;
  }

  get originalFilename(): string | undefined {
    return this.props.originalFilename;
  }

  get storedFilename(): string | undefined {
    return this.props.storedFilename;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get extension(): string | undefined {
    return this.props.extension;
  }

  get sizeBytes(): bigint {
    return this.props.sizeBytes;
  }

  get checksumAlgorithm(): ChecksumAlgorithm | undefined {
    return this.props.checksumAlgorithm;
  }

  get checksum(): string | undefined {
    return this.props.checksum;
  }

  get width(): number | undefined {
    return this.props.width;
  }

  get height(): number | undefined {
    return this.props.height;
  }

  get colorDepth(): number | undefined {
    return this.props.colorDepth;
  }

  get durationSeconds(): number | undefined {
    return this.props.durationSeconds;
  }

  get bitrate(): number | undefined {
    return this.props.bitrate;
  }

  get frameRate(): number | undefined {
    return this.props.frameRate;
  }

  get blurHash(): string | undefined {
    return this.props.blurHash;
  }

  get metadata(): JsonValue | undefined {
    return this.props.metadata;
  }

  get uploadedAt(): Date | undefined {
    return this.props.uploadedAt;
  }

  get archivedAt(): Date | undefined {
    return this.props.archivedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  override get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  isUploading(): boolean {
    return this.status === AssetStatus.UPLOADING;
  }

  isUploaded(): boolean {
    return this.status === AssetStatus.UPLOADED;
  }

  isScanning(): boolean {
    return this.status === AssetStatus.SCANNING;
  }

  isScanFailed(): boolean {
    return this.status === AssetStatus.SCAN_FAILED;
  }

  isProcessing(): boolean {
    return this.status === AssetStatus.PROCESSING;
  }

  isProcessingFailed(): boolean {
    return this.status === AssetStatus.PROCESSING_FAILED;
  }

  isReady(): boolean {
    return this.status === AssetStatus.READY;
  }

  isArchiving(): boolean {
    return this.status === AssetStatus.ARCHIVING;
  }

  isArchived(): boolean {
    return this.status === AssetStatus.ARCHIVED;
  }

  isDeleting(): boolean {
    return this.status === AssetStatus.DELETING;
  }

  isDeleted(): boolean {
    return this.status === AssetStatus.DELETED;
  }

  isImage(): boolean {
    return this.type === AssetType.IMAGE;
  }

  isVideo(): boolean {
    return this.type === AssetType.VIDEO;
  }

  isAudio(): boolean {
    return this.type === AssetType.AUDIO;
  }

  isDocument(): boolean {
    return this.type === AssetType.DOCUMENT;
  }

  isArchive(): boolean {
    return this.type === AssetType.ARCHIVE;
  }

  isOther(): boolean {
    return this.type === AssetType.OTHER;
  }

  isPublic(): boolean {
    return this.visibility === AssetVisibility.PUBLIC;
  }

  isCommunity(): boolean {
    return this.visibility === AssetVisibility.COMMUNITY;
  }

  isConnections(): boolean {
    return this.visibility === AssetVisibility.CONNECTIONS;
  }

  isPrivate(): boolean {
    return this.visibility === AssetVisibility.PRIVATE;
  }

  belongsTo(ownerIdentityId: AssetOwnerIdentityId): boolean {
    return (
      this.ownerIdentityId !== undefined &&
      this.ownerIdentityId.equals(ownerIdentityId)
    );
  }

  isOwned(): boolean {
    return this.ownerIdentityId !== undefined;
  }

  hasChecksum(): boolean {
    return this.checksumAlgorithm !== undefined && this.checksum !== undefined;
  }

  hasDimensions(): boolean {
    return this.width !== undefined && this.height !== undefined;
  }

  hasDuration(): boolean {
    return this.durationSeconds !== undefined;
  }

  hasBlurHash(): boolean {
    return this.blurHash !== undefined;
  }

  hasMetadata(): boolean {
    return this.metadata !== undefined;
  }

  hasExtension(): boolean {
    return this.extension !== undefined;
  }

  hasOriginalFilename(): boolean {
    return this.originalFilename !== undefined;
  }

  hasStoredFilename(): boolean {
    return this.storedFilename !== undefined;
  }

  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------

  markUploaded(uploadedAt: Date = new Date()): void {
    this.transitionTo(AssetStatus.UPLOADED, uploadedAt);

    this.props.uploadedAt = uploadedAt;
  }

  startScanning(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.SCANNING, at);
  }

  failScan(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.SCAN_FAILED, at);
  }

  startProcessing(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.PROCESSING, at);
  }

  failProcessing(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.PROCESSING_FAILED, at);
  }

  markReady(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.READY, at);
  }

  startArchiving(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.ARCHIVING, at);
  }

  markArchived(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.ARCHIVED, at);

    this.props.archivedAt = at;
  }

  startDeleting(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.DELETING, at);
  }

  markDeleted(at: Date = new Date()): void {
    this.transitionTo(AssetStatus.DELETED, at);

    this.props.deletedAt = at;
  }
  // --------------------------------------------------------------------------
  // Mutators
  // --------------------------------------------------------------------------

  changeVisibility(visibility: AssetVisibility, at: Date = new Date()): void {
    if (this.props.visibility === visibility) {
      return;
    }

    this.props.visibility = visibility;
    this.touch(at);

    this.props.visibility = visibility;
    this.touch(at);
  }

  setOwnerIdentity(
    ownerIdentityId: AssetOwnerIdentityId | undefined,
    at: Date = new Date(),
  ): void {
    this.props.ownerIdentityId = ownerIdentityId;
    this.touch(at);
  }

  setOriginalFilename(
    filename: string | undefined,
    at: Date = new Date(),
  ): void {
    this.props.originalFilename = filename;
    this.touch(at);
  }

  setStoredFilename(filename: string | undefined, at: Date = new Date()): void {
    this.props.storedFilename = filename;
    this.touch(at);
  }

  setChecksum(
    algorithm: ChecksumAlgorithm | undefined,
    checksum: string | undefined,
    at: Date = new Date(),
  ): void {
    this.props.checksumAlgorithm = algorithm;
    this.props.checksum = checksum;

    this.touch(at);
  }

  setImageMetadata(
    width: number | undefined,
    height: number | undefined,
    colorDepth: number | undefined,
    at: Date = new Date(),
  ): void {
    this.props.width = width;
    this.props.height = height;
    this.props.colorDepth = colorDepth;

    this.touch(at);
  }

  setVideoMetadata(
    durationSeconds: number | undefined,
    bitrate: number | undefined,
    frameRate: number | undefined,
    at: Date = new Date(),
  ): void {
    this.props.durationSeconds = durationSeconds;
    this.props.bitrate = bitrate;
    this.props.frameRate = frameRate;

    this.touch(at);
  }

  setAudioMetadata(
    durationSeconds: number | undefined,
    bitrate: number | undefined,
    at: Date = new Date(),
  ): void {
    this.props.durationSeconds = durationSeconds;
    this.props.bitrate = bitrate;

    this.props.frameRate = undefined;

    this.touch(at);
  }

  setBlurHash(blurHash: string | undefined, at: Date = new Date()): void {
    this.props.blurHash = blurHash;

    this.touch(at);
  }

  setMetadata(metadata: JsonValue | undefined, at: Date = new Date()): void {
    this.props.metadata = metadata;

    this.touch(at);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetEntity): boolean {
    return super.equals(other);
  }
}
