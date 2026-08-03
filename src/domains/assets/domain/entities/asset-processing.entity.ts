// src/domains/assets/domain/entities/asset-processing.entity.ts

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { InvalidAssetStateTransitionException } from '../exceptions';

import { StatefulEntity } from './stateful-entity';

import {
  AssetProcessingStatus,
  type AssetId,
  type AssetProcessingFailureReason,
  type AssetProcessingId,
  type AssetProcessingOperation,
  type AssetProcessor,
  type JsonValue,
} from '../value-objects';

export interface AssetProcessingProps {
  publicId: AssetProcessingId;

  assetId: AssetId;

  operation: AssetProcessingOperation;
  status: AssetProcessingStatus;

  processor: AssetProcessor | undefined;

  startedAt: Date | undefined;
  completedAt: Date | undefined;
  failedAt: Date | undefined;

  failureReason: AssetProcessingFailureReason | undefined;

  metadata: JsonValue | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class AssetProcessingEntity extends StatefulEntity<
  AssetProcessingProps,
  AssetProcessingStatus,
  AssetProcessingId
> {
  private static readonly ALLOWED_TRANSITIONS = new Map<
    AssetProcessingStatus,
    readonly AssetProcessingStatus[]
  >([
    [
      AssetProcessingStatus.PENDING,
      [AssetProcessingStatus.RUNNING, AssetProcessingStatus.CANCELLED],
    ],
    [
      AssetProcessingStatus.RUNNING,
      [
        AssetProcessingStatus.COMPLETED,
        AssetProcessingStatus.FAILED,
        AssetProcessingStatus.CANCELLED,
      ],
    ],
    [AssetProcessingStatus.COMPLETED, []],
    [AssetProcessingStatus.FAILED, []],
    [AssetProcessingStatus.CANCELLED, []],
  ]);

  private constructor(props: AssetProcessingProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetProcessingProps): AssetProcessingEntity {
    return new AssetProcessingEntity(props);
  }

  public static rehydrate(
    props: AssetProcessingProps,
    id: UniqueEntityId,
  ): AssetProcessingEntity {
    return new AssetProcessingEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // State Machine
  // --------------------------------------------------------------------------

  protected override get allowedTransitions(): ReadonlyMap<
    AssetProcessingStatus,
    readonly AssetProcessingStatus[]
  > {
    return AssetProcessingEntity.ALLOWED_TRANSITIONS;
  }

  protected override onInvalidTransition(
    current: AssetProcessingStatus,
    next: AssetProcessingStatus,
  ): never {
    throw new InvalidAssetStateTransitionException(current, next);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  override get publicId(): AssetProcessingId {
    return this.props.publicId;
  }

  get assetId(): AssetId {
    return this.props.assetId;
  }

  get operation(): AssetProcessingOperation {
    return this.props.operation;
  }

  override get status(): AssetProcessingStatus {
    return this.props.status;
  }

  get processor(): AssetProcessor | undefined {
    return this.props.processor;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  get failureReason(): AssetProcessingFailureReason | undefined {
    return this.props.failureReason;
  }

  get metadata(): JsonValue | undefined {
    return this.props.metadata;
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
    return this.status === AssetProcessingStatus.PENDING;
  }

  isRunning(): boolean {
    return this.status === AssetProcessingStatus.RUNNING;
  }

  isCompleted(): boolean {
    return this.status === AssetProcessingStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === AssetProcessingStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === AssetProcessingStatus.CANCELLED;
  }

  isFinished(): boolean {
    return this.isCompleted() || this.isFailed() || this.isCancelled();
  }

  belongsTo(assetId: AssetId): boolean {
    return this.assetId.equals(assetId);
  }

  uses(operation: AssetProcessingOperation): boolean {
    return this.operation === operation;
  }

  // --------------------------------------------------------------------------
  // Behavior
  // --------------------------------------------------------------------------

  start(processor?: AssetProcessor, startedAt: Date = new Date()): void {
    this.transitionTo(AssetProcessingStatus.RUNNING, startedAt);

    this.props.processor = processor;
    this.props.startedAt = startedAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.failureReason = undefined;
  }

  complete(completedAt: Date = new Date()): void {
    this.transitionTo(AssetProcessingStatus.COMPLETED, completedAt);

    this.props.completedAt = completedAt;
    this.props.failedAt = undefined;
    this.props.failureReason = undefined;
  }

  fail(
    reason: AssetProcessingFailureReason,
    failedAt: Date = new Date(),
  ): void {
    this.transitionTo(AssetProcessingStatus.FAILED, failedAt);

    this.props.failedAt = failedAt;
    this.props.failureReason = reason;
    this.props.completedAt = undefined;
  }

  cancel(at: Date = new Date()): void {
    this.transitionTo(AssetProcessingStatus.CANCELLED, at);
  }

  updateMetadata(metadata?: JsonValue, at: Date = new Date()): void {
    this.props.metadata = metadata;
    this.touch(at);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetProcessingEntity): boolean {
    return super.equals(other);
  }
}
