// src/domains/social/domain/entities/traveller-profile-corridor.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { CorridorKey } from '../value-objects/corridor-key.vo';
import type { TravellerProfileCorridorId } from '../value-objects/traveller-profile-corridor-id.vo';
import type { TravellerProfileId } from '../value-objects/traveller-profile-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TravellerProfileCorridorProps {
  publicId: TravellerProfileCorridorId;

  profileId: TravellerProfileId;

  originName: string;
  destinationName: string;

  originLatitude: number;
  originLongitude: number;

  destinationLatitude: number;
  destinationLongitude: number;

  corridorKey: CorridorKey;

  isPrimary: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TravellerProfileCorridorEntity extends Entity<TravellerProfileCorridorProps> {
  private constructor(
    props: TravellerProfileCorridorProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    props: TravellerProfileCorridorProps,
  ): TravellerProfileCorridorEntity {
    return new TravellerProfileCorridorEntity(props);
  }

  public static rehydrate(
    props: TravellerProfileCorridorProps,
    id: UniqueEntityId,
  ): TravellerProfileCorridorEntity {
    return new TravellerProfileCorridorEntity(props, id);
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

  get profileId(): TravellerProfileId {
    return this.props.profileId;
  }

  get originName(): string {
    return this.props.originName;
  }

  get destinationName(): string {
    return this.props.destinationName;
  }

  get originLatitude(): number {
    return this.props.originLatitude;
  }

  get originLongitude(): number {
    return this.props.originLongitude;
  }

  get destinationLatitude(): number {
    return this.props.destinationLatitude;
  }

  get destinationLongitude(): number {
    return this.props.destinationLongitude;
  }

  get corridorKey(): CorridorKey {
    return this.props.corridorKey;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
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

  setOriginName(originName: string): void {
    this.props.originName = originName;
  }

  setDestinationName(destinationName: string): void {
    this.props.destinationName = destinationName;
  }

  setOriginCoordinates(latitude: number, longitude: number): void {
    this.props.originLatitude = latitude;
    this.props.originLongitude = longitude;
  }

  setDestinationCoordinates(latitude: number, longitude: number): void {
    this.props.destinationLatitude = latitude;
    this.props.destinationLongitude = longitude;
  }

  setCorridorKey(corridorKey: CorridorKey): void {
    this.props.corridorKey = corridorKey;
  }

  setPrimary(isPrimary: boolean): void {
    this.props.isPrimary = isPrimary;
  }

  makePrimary(): void {
    this.props.isPrimary = true;
  }

  makeNonPrimary(): void {
    this.props.isPrimary = false;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  belongsToProfile(profileId: TravellerProfileId): boolean {
    return this.props.profileId.equals(profileId);
  }

  isPrimaryCorridor(): boolean {
    return this.props.isPrimary;
  }

  hasCorridorKey(corridorKey: CorridorKey): boolean {
    return this.props.corridorKey.equals(corridorKey);
  }

  connects(originName: string, destinationName: string): boolean {
    return (
      this.props.originName === originName &&
      this.props.destinationName === destinationName
    );
  }

  hasOriginCoordinates(latitude: number, longitude: number): boolean {
    return (
      this.props.originLatitude === latitude &&
      this.props.originLongitude === longitude
    );
  }

  hasDestinationCoordinates(latitude: number, longitude: number): boolean {
    return (
      this.props.destinationLatitude === latitude &&
      this.props.destinationLongitude === longitude
    );
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TravellerProfileCorridorEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TravellerProfileCorridorProps };
