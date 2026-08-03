// src/domains/assets/domain/entities/asset-variant.entity.ts

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { InvalidAssetStateTransitionException } from '../exceptions';

import { StatefulEntity } from './stateful-entity';

import type {
  AssetId,
  AssetVariantId,
  AssetVariantType,
  FileMetadata,
  ImageDimensions,
  MediaMetadata,
  StorageLocation,
} from '../value-objects';
import { AssetVariantStatus } from '../value-objects';

export interface AssetVariantProps {
  publicId: AssetVariantId;

  assetId: AssetId;

  variant: AssetVariantType;

  status: AssetVariantStatus;

  isGenerated: boolean;

  storage: StorageLocation;

  file: FileMetadata;

  image?: ImageDimensions;

  media?: MediaMetadata;

  createdAt: Date;
  updatedAt: Date;
}

export class AssetVariantEntity extends StatefulEntity<
  AssetVariantProps,
  AssetVariantStatus,
  AssetVariantId
> {
  private static readonly ALLOWED_TRANSITIONS = new Map<
    AssetVariantStatus,
    readonly AssetVariantStatus[]
  >([
    [AssetVariantStatus.PENDING, [AssetVariantStatus.PROCESSING]],
    [
      AssetVariantStatus.PROCESSING,
      [AssetVariantStatus.READY, AssetVariantStatus.FAILED],
    ],
    [AssetVariantStatus.READY, []],
    [AssetVariantStatus.FAILED, []],
  ]);

  private constructor(props: AssetVariantProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetVariantProps): AssetVariantEntity {
    return new AssetVariantEntity(props);
  }

  public static rehydrate(
    props: AssetVariantProps,
    id: UniqueEntityId,
  ): AssetVariantEntity {
    return new AssetVariantEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // StatefulEntity
  // --------------------------------------------------------------------------

  protected get allowedTransitions(): ReadonlyMap<
    AssetVariantStatus,
    readonly AssetVariantStatus[]
  > {
    return AssetVariantEntity.ALLOWED_TRANSITIONS;
  }

  protected onInvalidTransition(
    current: AssetVariantStatus,
    next: AssetVariantStatus,
  ): never {
    throw new InvalidAssetStateTransitionException(current, next);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  override get publicId(): AssetVariantId {
    return this.props.publicId;
  }

  get assetId(): AssetId {
    return this.props.assetId;
  }

  get variant(): AssetVariantType {
    return this.props.variant;
  }

  override get status(): AssetVariantStatus {
    return this.props.status;
  }

  get isGenerated(): boolean {
    return this.props.isGenerated;
  }

  get storage(): StorageLocation {
    return this.props.storage;
  }

  get file(): FileMetadata {
    return this.props.file;
  }

  get image(): ImageDimensions | undefined {
    return this.props.image;
  }

  get media(): MediaMetadata | undefined {
    return this.props.media;
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

  isPending(): boolean {
    return this.status === AssetVariantStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === AssetVariantStatus.PROCESSING;
  }

  isReady(): boolean {
    return this.status === AssetVariantStatus.READY;
  }

  isFailed(): boolean {
    return this.status === AssetVariantStatus.FAILED;
  }

  isTerminal(): boolean {
    return this.isReady() || this.isFailed();
  }

  // --------------------------------------------------------------------------
  // Commands
  // --------------------------------------------------------------------------

  markProcessing(at: Date = new Date()): void {
    this.transitionTo(AssetVariantStatus.PROCESSING, at);
  }

  markReady(at: Date = new Date()): void {
    this.transitionTo(AssetVariantStatus.READY, at);
  }

  markFailed(at: Date = new Date()): void {
    this.transitionTo(AssetVariantStatus.FAILED, at);
  }
}
