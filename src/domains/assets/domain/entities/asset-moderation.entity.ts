// src/domains/assets/domain/entities/asset-moderation.entity.ts

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetModerationAlreadyCompletedException,
  InvalidAssetStateTransitionException,
} from '../exceptions';

import { StatefulEntity } from './stateful-entity';

import type {
  AssetId,
  AssetModerationId,
  AssetModerationType,
  AssetModeratorId,
  JsonValue,
  ModerationConfidence,
  ModerationReason,
} from '../value-objects';
import { AssetModerationStatus } from '../value-objects';

export interface AssetModerationProps {
  publicId: AssetModerationId;

  assetId: AssetId;

  type: AssetModerationType;
  status: AssetModerationStatus;

  moderatorId: AssetModeratorId | undefined;

  confidence: ModerationConfidence | undefined;

  reason: ModerationReason | undefined;

  metadata: JsonValue | undefined;

  moderatedAt: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class AssetModerationEntity extends StatefulEntity<
  AssetModerationProps,
  AssetModerationStatus,
  AssetModerationId
> {
  private static readonly ALLOWED_TRANSITIONS = Object.freeze(
    new Map<AssetModerationStatus, readonly AssetModerationStatus[]>([
      [
        AssetModerationStatus.PENDING,
        [AssetModerationStatus.APPROVED, AssetModerationStatus.REJECTED],
      ],
      [AssetModerationStatus.APPROVED, []],
      [AssetModerationStatus.REJECTED, []],
    ]),
  );

  private constructor(props: AssetModerationProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetModerationProps): AssetModerationEntity {
    return new AssetModerationEntity(props);
  }

  public static rehydrate(
    props: AssetModerationProps,
    id: UniqueEntityId,
  ): AssetModerationEntity {
    return new AssetModerationEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // State Machine
  // --------------------------------------------------------------------------

  protected override get allowedTransitions(): ReadonlyMap<
    AssetModerationStatus,
    readonly AssetModerationStatus[]
  > {
    return AssetModerationEntity.ALLOWED_TRANSITIONS;
  }

  protected override onInvalidTransition(
    current: AssetModerationStatus,
    next: AssetModerationStatus,
  ): never {
    throw new InvalidAssetStateTransitionException(current, next);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  override get publicId(): AssetModerationId {
    return this.props.publicId;
  }

  get assetId(): AssetId {
    return this.props.assetId;
  }

  get type(): AssetModerationType {
    return this.props.type;
  }

  override get status(): AssetModerationStatus {
    return this.props.status;
  }

  get moderatorId(): AssetModeratorId | undefined {
    return this.props.moderatorId;
  }

  get confidence(): ModerationConfidence | undefined {
    return this.props.confidence;
  }

  get reason(): ModerationReason | undefined {
    return this.props.reason;
  }

  get metadata(): JsonValue | undefined {
    return this.props.metadata;
  }

  get moderatedAt(): Date | undefined {
    return this.props.moderatedAt;
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
    return this.status === AssetModerationStatus.PENDING;
  }

  isApproved(): boolean {
    return this.status === AssetModerationStatus.APPROVED;
  }

  isRejected(): boolean {
    return this.status === AssetModerationStatus.REJECTED;
  }

  isFinished(): boolean {
    return this.isApproved() || this.isRejected();
  }

  wasModerated(): boolean {
    return this.moderatedAt !== undefined;
  }

  belongsTo(assetId: AssetId): boolean {
    return this.assetId.equals(assetId);
  }

  uses(type: AssetModerationType): boolean {
    return this.type === type;
  }

  hasModerator(): boolean {
    return this.moderatorId !== undefined;
  }

  hasConfidence(): boolean {
    return this.confidence !== undefined;
  }

  hasReason(): boolean {
    return this.reason !== undefined;
  }

  // --------------------------------------------------------------------------
  // Behavior
  // --------------------------------------------------------------------------

  approve(
    moderatorId?: AssetModeratorId,
    confidence?: ModerationConfidence,
    moderatedAt: Date = new Date(),
  ): void {
    this.ensureNotFinished();

    this.transitionTo(AssetModerationStatus.APPROVED, moderatedAt);

    this.markModerated(moderatedAt);
    this.assignModerator(moderatorId);
    this.assignConfidence(confidence);
    this.clearReason();
  }

  reject(
    reason: ModerationReason,
    moderatorId?: AssetModeratorId,
    confidence?: ModerationConfidence,
    moderatedAt: Date = new Date(),
  ): void {
    this.ensureNotFinished();

    this.transitionTo(AssetModerationStatus.REJECTED, moderatedAt);

    this.markModerated(moderatedAt);
    this.assignModerator(moderatorId);
    this.assignConfidence(confidence);

    this.props.reason = reason;
  }

  updateMetadata(metadata: JsonValue | undefined, at: Date = new Date()): void {
    this.props.metadata = metadata;

    this.touch(at);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetModerationEntity): boolean {
    return super.equals(other);
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  private ensureNotFinished(): void {
    if (this.isFinished()) {
      throw new AssetModerationAlreadyCompletedException();
    }
  }

  private markModerated(moderatedAt: Date): void {
    this.props.moderatedAt = moderatedAt;
  }

  private assignModerator(moderatorId: AssetModeratorId | undefined): void {
    this.props.moderatorId = moderatorId;
  }

  private assignConfidence(confidence: ModerationConfidence | undefined): void {
    this.props.confidence = confidence;
  }

  private clearReason(): void {
    this.props.reason = undefined;
  }
}
