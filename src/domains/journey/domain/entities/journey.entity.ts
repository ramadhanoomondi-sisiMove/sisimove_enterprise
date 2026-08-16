// src/domains/journey/domain/entities/journey.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { JourneyProviderPublicId } from '../value-objects/journey-provider-public-id.vo';
import type { JourneyStatusValueObject } from '../value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyCorridorEntity } from './journey-corridor.entity';
import type { JourneyScheduleEntity } from './journey-schedule.entity';
import type { JourneyVehicleEntity } from './journey-vehicle.entity';
import type { JourneyCapacityEntity } from './journey-capacity.entity';
import type { JourneyPricingEntity } from './journey-pricing.entity';
import type { JourneyPreferencesEntity } from './journey-preferences.entity';
import type { JourneyAssetEntity } from './journey-asset.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyProps {
  publicId: JourneyPublicId;

  providerPublicId: JourneyProviderPublicId;

  status: JourneyStatusValueObject;

  publishedAt: Date | undefined;
  startedAt: Date | undefined;
  completionRequestedAt: Date | undefined;
  completedAt: Date | undefined;
  cancelledAt: Date | undefined;
  expiredAt: Date | undefined;

  version: number;

  corridor: JourneyCorridorEntity | undefined;
  schedule: JourneyScheduleEntity | undefined;
  vehicle: JourneyVehicleEntity | undefined;
  capacity: JourneyCapacityEntity | undefined;
  pricing: JourneyPricingEntity | undefined;
  preferences: JourneyPreferencesEntity | undefined;

  assets: JourneyAssetEntity[];

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyEntity extends Entity<JourneyProps> {
  private constructor(props: JourneyProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId: JourneyPublicId;
    providerPublicId: JourneyProviderPublicId;
    status: JourneyStatusValueObject;
    createdAt?: Date;
    updatedAt?: Date;
  }): JourneyEntity {
    const now = new Date();

    return new JourneyEntity({
      publicId: props.publicId,
      providerPublicId: props.providerPublicId,
      status: props.status,

      publishedAt: undefined,
      startedAt: undefined,
      completionRequestedAt: undefined,
      completedAt: undefined,
      cancelledAt: undefined,
      expiredAt: undefined,

      version: 1,

      corridor: undefined,
      schedule: undefined,
      vehicle: undefined,
      capacity: undefined,
      pricing: undefined,
      preferences: undefined,

      assets: [],

      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  public static rehydrate(
    props: JourneyProps,
    id: UniqueEntityId,
  ): JourneyEntity {
    return new JourneyEntity(
      {
        ...props,
        assets: [...props.assets],
      },
      id,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get providerPublicId(): JourneyProviderPublicId {
    return this.props.providerPublicId;
  }

  get status(): JourneyStatusValueObject {
    return this.props.status;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get completionRequestedAt(): Date | undefined {
    return this.props.completionRequestedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  get expiredAt(): Date | undefined {
    return this.props.expiredAt;
  }

  get version(): number {
    return this.props.version;
  }

  get corridor(): JourneyCorridorEntity | undefined {
    return this.props.corridor;
  }

  get schedule(): JourneyScheduleEntity | undefined {
    return this.props.schedule;
  }

  get vehicle(): JourneyVehicleEntity | undefined {
    return this.props.vehicle;
  }

  get capacity(): JourneyCapacityEntity | undefined {
    return this.props.capacity;
  }

  get pricing(): JourneyPricingEntity | undefined {
    return this.props.pricing;
  }

  get preferences(): JourneyPreferencesEntity | undefined {
    return this.props.preferences;
  }

  get assets(): readonly JourneyAssetEntity[] {
    return this.props.assets;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // State Mutators
  // ---------------------------------------------------------------------------

  setStatus(status: JourneyStatusValueObject): void {
    this.props.status = status;
  }

  setProviderPublicId(providerPublicId: JourneyProviderPublicId): void {
    this.props.providerPublicId = providerPublicId;
  }

  setPublishedAt(publishedAt: Date | undefined): void {
    this.props.publishedAt = publishedAt;
  }

  setStartedAt(startedAt: Date | undefined): void {
    this.props.startedAt = startedAt;
  }

  setCompletionRequestedAt(completionRequestedAt: Date | undefined): void {
    this.props.completionRequestedAt = completionRequestedAt;
  }

  setCompletedAt(completedAt: Date | undefined): void {
    this.props.completedAt = completedAt;
  }

  setCancelledAt(cancelledAt: Date | undefined): void {
    this.props.cancelledAt = cancelledAt;
  }

  setExpiredAt(expiredAt: Date | undefined): void {
    this.props.expiredAt = expiredAt;
  }

  setVersion(version: number): void {
    if (!Number.isInteger(version) || version < 1) {
      throw new Error('Journey version must be a positive integer.');
    }

    this.props.version = version;
  }

  incrementVersion(): void {
    this.props.version += 1;
  }

  setCorridor(corridor: JourneyCorridorEntity | undefined): void {
    this.props.corridor = corridor;
  }

  setSchedule(schedule: JourneyScheduleEntity | undefined): void {
    this.props.schedule = schedule;
  }

  setVehicle(vehicle: JourneyVehicleEntity | undefined): void {
    this.props.vehicle = vehicle;
  }

  setCapacity(capacity: JourneyCapacityEntity | undefined): void {
    this.props.capacity = capacity;
  }

  setPricing(pricing: JourneyPricingEntity | undefined): void {
    this.props.pricing = pricing;
  }

  setPreferences(preferences: JourneyPreferencesEntity | undefined): void {
    this.props.preferences = preferences;
  }

  addAsset(asset: JourneyAssetEntity): void {
    if (this.props.assets.some((existing) => existing.equals(asset))) {
      return;
    }

    this.props.assets.push(asset);
  }

  removeAsset(asset: JourneyAssetEntity): void {
    this.props.assets = this.props.assets.filter(
      (existing) => !existing.equals(asset),
    );
  }

  clearAssets(): void {
    this.props.assets = [];
  }

  setAssets(assets: JourneyAssetEntity[]): void {
    this.props.assets = [...assets];
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasCorridor(): boolean {
    return this.props.corridor !== undefined;
  }

  hasSchedule(): boolean {
    return this.props.schedule !== undefined;
  }

  hasVehicle(): boolean {
    return this.props.vehicle !== undefined;
  }

  hasCapacity(): boolean {
    return this.props.capacity !== undefined;
  }

  hasPricing(): boolean {
    return this.props.pricing !== undefined;
  }

  hasPreferences(): boolean {
    return this.props.preferences !== undefined;
  }

  hasAssets(): boolean {
    return this.props.assets.length > 0;
  }

  assetCount(): number {
    return this.props.assets.length;
  }

  belongsToProvider(providerPublicId: JourneyProviderPublicId): boolean {
    return this.props.providerPublicId.equals(providerPublicId);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyProps };
