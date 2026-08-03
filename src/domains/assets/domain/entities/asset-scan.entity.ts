// src/domains/assets/domain/entities/asset-scan.entity.ts

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetScanAlreadyCompletedException,
  InvalidAssetStateTransitionException,
} from '../exceptions';

import { StatefulEntity } from './stateful-entity';

import type {
  AssetId,
  AssetScanEngine,
  AssetScanId,
  AssetThreatName,
  JsonValue,
} from '../value-objects';
import { AssetScanStatus } from '../value-objects';

export interface AssetScanProps {
  publicId: AssetScanId;

  assetId: AssetId;

  engine: AssetScanEngine;
  status: AssetScanStatus;

  scannedAt: Date | undefined;

  threatName: AssetThreatName | undefined;

  metadata: JsonValue | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class AssetScanEntity extends StatefulEntity<
  AssetScanProps,
  AssetScanStatus,
  AssetScanId
> {
  private static readonly ALLOWED_TRANSITIONS = Object.freeze(
    new Map<AssetScanStatus, readonly AssetScanStatus[]>([
      [
        AssetScanStatus.PENDING,
        [
          AssetScanStatus.CLEAN,
          AssetScanStatus.INFECTED,
          AssetScanStatus.FAILED,
        ],
      ],
      [AssetScanStatus.CLEAN, []],
      [AssetScanStatus.INFECTED, []],
      [AssetScanStatus.FAILED, []],
    ]),
  );

  private constructor(props: AssetScanProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetScanProps): AssetScanEntity {
    return new AssetScanEntity(props);
  }

  public static rehydrate(
    props: AssetScanProps,
    id: UniqueEntityId,
  ): AssetScanEntity {
    return new AssetScanEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // State Machine
  // --------------------------------------------------------------------------

  protected override get allowedTransitions(): ReadonlyMap<
    AssetScanStatus,
    readonly AssetScanStatus[]
  > {
    return AssetScanEntity.ALLOWED_TRANSITIONS;
  }

  protected override onInvalidTransition(
    current: AssetScanStatus,
    next: AssetScanStatus,
  ): never {
    throw new InvalidAssetStateTransitionException(current, next);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  override get publicId(): AssetScanId {
    return this.props.publicId;
  }

  get assetId(): AssetId {
    return this.props.assetId;
  }

  get engine(): AssetScanEngine {
    return this.props.engine;
  }

  override get status(): AssetScanStatus {
    return this.props.status;
  }

  get scannedAt(): Date | undefined {
    return this.props.scannedAt;
  }

  get threatName(): AssetThreatName | undefined {
    return this.props.threatName;
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
    return this.status === AssetScanStatus.PENDING;
  }

  isClean(): boolean {
    return this.status === AssetScanStatus.CLEAN;
  }

  isInfected(): boolean {
    return this.status === AssetScanStatus.INFECTED;
  }

  isFailed(): boolean {
    return this.status === AssetScanStatus.FAILED;
  }

  isFinished(): boolean {
    return this.isClean() || this.isInfected() || this.isFailed();
  }

  wasScanned(): boolean {
    return this.scannedAt !== undefined;
  }

  belongsTo(assetId: AssetId): boolean {
    return this.assetId.equals(assetId);
  }

  uses(engine: AssetScanEngine): boolean {
    return this.engine === engine;
  }

  hasThreat(): boolean {
    return this.threatName !== undefined;
  }

  // --------------------------------------------------------------------------
  // Behavior
  // --------------------------------------------------------------------------

  markClean(scannedAt: Date = new Date()): void {
    this.ensureNotFinished();

    this.transitionTo(AssetScanStatus.CLEAN, scannedAt);

    this.markScanned(scannedAt);
    this.clearThreat();
  }

  markInfected(
    threatName: AssetThreatName,
    scannedAt: Date = new Date(),
  ): void {
    this.ensureNotFinished();

    this.transitionTo(AssetScanStatus.INFECTED, scannedAt);

    this.markScanned(scannedAt);

    this.props.threatName = threatName;
  }

  markFailed(scannedAt: Date = new Date()): void {
    this.ensureNotFinished();

    this.transitionTo(AssetScanStatus.FAILED, scannedAt);

    this.markScanned(scannedAt);
    this.clearThreat();
  }

  updateMetadata(metadata: JsonValue | undefined, at: Date = new Date()): void {
    this.props.metadata = metadata;

    this.touch(at);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetScanEntity): boolean {
    return super.equals(other);
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  private ensureNotFinished(): void {
    if (this.isFinished()) {
      throw new AssetScanAlreadyCompletedException();
    }
  }

  private markScanned(scannedAt: Date): void {
    this.props.scannedAt = scannedAt;
  }

  private clearThreat(): void {
    this.props.threatName = undefined;
  }
}
