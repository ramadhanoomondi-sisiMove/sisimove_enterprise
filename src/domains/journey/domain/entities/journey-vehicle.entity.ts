// src/domains/journey/domain/entities/journey-vehicle.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyVehiclePublicId } from '../value-objects/journey-vehicle-public-id.vo';
import type { JourneyVehicleMake } from '../value-objects/journey-vehicle-make.vo';
import type { JourneyVehicleModel } from '../value-objects/journey-vehicle-model.vo';
import type { JourneyVehicleYear } from '../value-objects/journey-vehicle-year.vo';
import type { JourneyVehicleColor } from '../value-objects/journey-vehicle-color.vo';
import type { JourneyVehicleRegistration } from '../value-objects/journey-vehicle-registration.vo';
import type { JourneyVehicleAssetPublicId } from '../value-objects/journey-vehicle-asset-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyVehicleProps {
  publicId: JourneyVehiclePublicId;

  make: JourneyVehicleMake;
  model: JourneyVehicleModel;
  year: JourneyVehicleYear | undefined;
  color: JourneyVehicleColor | undefined;
  registration: JourneyVehicleRegistration | undefined;

  assetPublicId: JourneyVehicleAssetPublicId | undefined;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyVehicleEntity extends Entity<JourneyVehicleProps> {
  private constructor(props: JourneyVehicleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyVehicleProps): JourneyVehicleEntity {
    return new JourneyVehicleEntity(props);
  }

  public static rehydrate(
    props: JourneyVehicleProps,
    id: UniqueEntityId,
  ): JourneyVehicleEntity {
    return new JourneyVehicleEntity(props, id);
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

  get make(): JourneyVehicleMake {
    return this.props.make;
  }

  get model(): JourneyVehicleModel {
    return this.props.model;
  }

  get year(): JourneyVehicleYear | undefined {
    return this.props.year;
  }

  get color(): JourneyVehicleColor | undefined {
    return this.props.color;
  }

  get registration(): JourneyVehicleRegistration | undefined {
    return this.props.registration;
  }

  get assetPublicId(): JourneyVehicleAssetPublicId | undefined {
    return this.props.assetPublicId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setMake(make: JourneyVehicleMake): void {
    this.props.make = make;
  }

  setModel(model: JourneyVehicleModel): void {
    this.props.model = model;
  }

  setYear(year: JourneyVehicleYear | undefined): void {
    this.props.year = year;
  }

  setColor(color: JourneyVehicleColor | undefined): void {
    this.props.color = color;
  }

  setRegistration(registration: JourneyVehicleRegistration | undefined): void {
    this.props.registration = registration;
  }

  setAssetPublicId(
    assetPublicId: JourneyVehicleAssetPublicId | undefined,
  ): void {
    this.props.assetPublicId = assetPublicId;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasYear(): boolean {
    return this.props.year !== undefined;
  }

  hasColor(): boolean {
    return this.props.color !== undefined;
  }

  hasRegistration(): boolean {
    return this.props.registration !== undefined;
  }

  hasAsset(): boolean {
    return this.props.assetPublicId !== undefined;
  }

  usesAsset(assetPublicId: JourneyVehicleAssetPublicId): boolean {
    return this.props.assetPublicId?.equals(assetPublicId) ?? false;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyVehicleEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyVehicleProps };
